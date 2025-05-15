"use client"
import { Circle, MapContainer as Container, Marker, Polyline, Popup, Rectangle, TileLayer, useMap,useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-rotatedmarker'
import React, { useEffect, useRef, useState } from 'react'
import "leaflet/dist/leaflet.css";
import { Colors } from '../way-point-container/data/colors'
import ROSLIB, { Ros } from 'roslib'
import { getROS } from '@/ros-functions/connect'
import { calculateDistance } from '../orientation-container/distance-calculator/functions/calculate-distance'
import { toast } from 'sonner'
import { renderToString } from 'react-dom/server'
import MapController from '../dashboard/test-component'
import MapMenubar from '../map-menubar/map-menubar'
import WaypointContainer from './waypoint-container'
import OrientationContainer from './orientation-container'
import { Path } from './path.model'

export interface WayPoint{
  lat:number;
  lng:number;
  id:number;
  type:WayPointType;
  name:string;
}

interface Coordinate{
  lat:number | string 
  lng:number | string
}

export enum WayPointType{
  GNSS,
  MALLETE,
  BOTTLE,
  ARUCO
}

// Utility function to convert meters to degrees
const metersToDegrees = (meters: number, latitude: number) => {
  const lat = meters / 111320; // Approximately 111.32 km per degree latitude
  const lng = meters / (111320 * Math.cos(latitude * (Math.PI / 180))); // Adjust for longitude
  return { lat, lng };
};

export const getColor = (type:WayPointType):string=>{
  switch(type){
    case WayPointType.ARUCO:
      return Colors.amber
    case WayPointType.BOTTLE:
      return Colors.teal
    case WayPointType.GNSS:
      return Colors.blue
    case WayPointType.MALLETE:
      return Colors.orange
  }
}

export const getInitial = (type:WayPointType):string=>{
  switch(type){
    case WayPointType.ARUCO:
      return 'AR'
    case WayPointType.BOTTLE:
      return 'BT'
    case WayPointType.GNSS:
      return 'GNSS'
    case WayPointType.MALLETE:
      return 'ML'
  }
}

const MapContainer = () => {
  const [waypoints, setwaypoints] = useState<WayPoint[]>([])
  const [selectedWaypoint, setselectedWaypoint] = useState<WayPoint|null>(null)
  const [wptype, setwptype] = useState<WayPointType>(WayPointType.GNSS)
  const [mapActive, setmapActive] = useState<boolean>(false)
  const [roverPosition, setroverPosition] = useState<Coordinate>({lat:38.42390688, lng:-110.7852678})
  const [roverRotation, setroverRotation] = useState(Math.PI)
  const [roverPositions, setroverPositions] = useState<Coordinate[]>([])
  const [ros, setros] = useState<Ros | null>(null)
  const [isRosConnected, setisRosConnected] = useState<boolean>(false)

  const roverMarker = useRef(null)

  // Calculate 20m rectangle bounds
  const rectangleSize = 20; // meters
  const sizeInDegrees = metersToDegrees(rectangleSize, Number(roverPosition.lat));



  const getRectangleBounds = (position: Coordinate, offsetLat: number, offsetLng: number, size: number) => {
    const sizeInDegrees = metersToDegrees(size, position.lat);
    const offsetInDegrees = metersToDegrees(rectangleSize, position.lat);
    
    return [
      [
        roverpo.lat + (offsetInDegrees.lat * offsetLat) - sizeInDegrees.lat,
        position.lng + (offsetInDegrees.lng * offsetLng) - sizeInDegrees.lng
      ],
      [
        position.lat + (offsetInDegrees.lat * offsetLat) + sizeInDegrees.lat,
        position.lng + (offsetInDegrees.lng * offsetLng) + sizeInDegrees.lng
      ]
    ];
  };

  const rectangleBounds = [
    [Number(roverPosition.lat) - sizeInDegrees.lat, Number(roverPosition.lng) - sizeInDegrees.lng],
    [Number(roverPosition.lat) + sizeInDegrees.lat, Number(roverPosition.lng) + sizeInDegrees.lng]
  ];

  useEffect(() => {
    if (roverMarker.current) {
      console.log('Setting rotation angle:', roverRotation);
      (roverMarker.current as any).setRotationAngle(roverRotation);
      (roverMarker.current as any).setRotationOrigin('center');
    }
  }, [roverRotation]);

  const [selectedWaypoints, setselectedWaypoints] = useState<WayPoint[]>([])

  const [start, setstart] = useState<Coordinate>({
    lat: 0,
    lng: 0
  })

  const [end, setend] = useState<Coordinate>({
    lat: 0,
    lng: 0
  })

  const roverIcon = new L.Icon({
    iconUrl: '/marker/rover-marker.png',
    className:'transition-transform duration-100 ease-in-out',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
  });

  const retrieveIcon = new L.Icon({
    iconUrl: '/marker/retrieve.png',
    className:'transition-transform duration-100 ease-in-out',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
  });

  const MapClickHandler = () => {
    if(mapActive){
      useMapEvents({
        click(e) {
          setwaypoints([...waypoints,{lat:e.latlng.lat,lng:e.latlng.lng,id:waypoints.length,type:wptype,name:`${getInitial(wptype)}${waypoints.filter((v)=>v.type==wptype).length+1}`}])
        },
      });
    }
    return null;
  };

  useEffect(() => {
    setwaypoints(JSON.parse(localStorage.getItem('waypoints')||'[]'))
    const path = localStorage.getItem('path')
    const wpPaths:WayPoint[] = Array.isArray(path)?path.map((pose, index) => ({
      lat: pose.pose.position.x,
      lng: pose.pose.position.y,
      id: index,
      type: WayPointType.GNSS,
      name: `GNSS${index + 1}`,
    })):[]
    setwaypoints(wpPaths)
    getROS().then(ros=>{
      ros.on('connection',()=>{
        setisRosConnected(true)
      })
      setros(ros)
      ros.on('close',()=>{
        setisRosConnected(false)
      })
    })
    return ()=>{
      if(ros){
        ros.close()
      }
    }
  }, []);

  useEffect(() => {
    if(roverPositions.length>0){
      const distance = calculateDistance(Number(roverPosition.lat),Number(roverPosition.lng),Number(roverPositions[roverPositions.length-1].lat),Number(roverPositions[roverPositions.length-1].lng))
      console.log(distance)
      if(distance>0.7){
        setroverPositions(p=>[...p,roverPosition])
      }
    }
    else{
      if(roverPosition.lat!=0.00&&roverPosition.lng!=0.0){
        setroverPositions(p=>[...p,roverPosition])
      }
    }
  }, [roverPosition])

  useEffect(() => {
    getROS().then((ros)=>{
      if(ros.isConnected){
        const angleTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/witmotion_eular/yaw',
          messageType:'/std_msgs/Float64'
        })
        const gpsTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/sbg/gps_pos',
          messageType:'sbg_driver/SbgGpsPos'
        })

        const semiAutoTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/semi_auto',
          messageType:'std_msgs/msg/String'
        })

        const pathTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/cord_path',
          messageType:'nav_msgs/Path'
        })

        semiAutoTopic.subscribe((msg:any)=>{
          if(!msg.data){
            toast.error('Invalid waypoints received')
            return
          }
          const waypoints = msg.data.split(',')
          if(waypoints.length!=4){
            toast.error('Invalid waypoints received')
            return
          }
          setstart({
            lat:waypoints[0],
            lng:waypoints[1]
          })
          setend({
            lat:waypoints[2],
            lng:waypoints[3]
          })
          console.log('Received waypoints:', msg);
        })

        pathTopic.subscribe((msg:Path)=>{
          console.log('Received path:', msg);
          localStorage.setItem('path',JSON.stringify(msg))
          const poses = msg.poses.map((pose, index) => ({
            lat: pose.pose.position.y,
            lng: pose.pose.position.x,
            id: index,
            type: WayPointType.GNSS,
            name: `GNSS${index + 1}`,
          }));
          console.log('poses',poses)
          setwaypoints(poses);
        })

        angleTopic.subscribe((msg:any)=>{
          setroverRotation(msg.data)
        })

        gpsTopic.subscribe((msg:any)=>{
          console.log('gps',msg)
          setroverPosition({
            lat:msg.latitude,
            lng:msg.longitude
          })
          console.log(msg.latitude,msg.longitude)
        })
      }
      else{
        toast.error('Cannot subscribe to angle topic. ROS not connected')
      }
    })
  }, [])

  useEffect(() => {
    console.log('WAYPOINTS',waypoints)
  }, [waypoints])

  useEffect(() => {
    if(waypoints){
      localStorage.setItem('waypoints',JSON.stringify(waypoints))
    }
  }, [waypoints])

  const clearRoverWaypoints = ()=>{
    setroverPositions([])
  }

  const startIcon = L.divIcon({
    html: `<div class="flex flex-col items-center">
    ${renderToString(
      <div className='relative'>
        <div className={`h-[40px] w-[2px] ${getColor(WayPointType.GNSS)}`}></div>
        <div className={`h-[20px] absolute top-0 left-0 w-[40px] ${getColor(WayPointType.GNSS)} text-xs flex items-center justify-center text-white`}>START</div>
      </div>
    )}
    </div>`,
    className: `w-20 h-20 `,
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });  

  const endIcon = L.divIcon({
    html: `<div class="flex flex-col items-center">
    ${renderToString(
      <div className='relative'>
        <div className={`h-[40px] w-[2px] ${getColor(WayPointType.GNSS)}`}></div>
        <div className={`h-[20px] absolute top-0 left-0 w-[40px] ${getColor(WayPointType.GNSS)} text-xs flex items-center justify-center text-white`}>END</div>
      </div>
    )}
    </div>`,
    className: `w-20 h-20 `,
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });  

  const waypointIcon = L.divIcon({
    html: `<div class="flex flex-col items-center">
    ${renderToString(
      <div className='relative'>
      </div>
    )}
    </div>`,
    className: `w-20 h-20 `,
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });  

  useEffect(() => {
    // Fix for default marker icons not showing
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
  }, []);

  return (
    <div className='relative'>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[7vh] left-[50%] font-bold absolute z-50 bg-orange-500/50" onClick={clearRoverWaypoints}>N</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[90vh] left-[50%] font-bold absolute z-50 bg-sky-500/50">S</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] left-[20%] font-bold absolute z-50 bg-purple-500/50">W</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] right-[15%] font-bold absolute z-50 bg-red-500/50">E</div>
      <OrientationContainer rover={roverPosition} waypoints={waypoints}/>
      <Container center={[Number(roverPosition.lat), Number(roverPosition.lng)]} style={{ position:'fixed',height: '90vh',width:'65%',marginLeft:'20%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
        <TileLayer
          maxZoom={25}
          maxNativeZoom={19}
          url="http://localhost:8080/tiles/google_maps/webmercator/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Open Street Map</a> Contributors'
        />
        
        <MapClickHandler/>

        {/* 20m Rectangle around rover */}
        <Rectangle
          bounds={rectangleBounds}
          pathOptions={{
            color: getColor(WayPointType.GNSS),
            fillColor: 'orange',
            fillOpacity: 0.2,
            weight: 1
          }}
        />

        <div>
          <Circle
            center={[Number(start.lat), Number(start.lng)]}
            radius={2}
            pathOptions={{
              color: getColor(WayPointType.GNSS),
              fillColor: "blue",
              fillOpacity: 0.2,
              weight: 1
            }}
          />
          <Marker icon={startIcon} position={[Number(start.lat),Number(start.lng)]} autoPanOnFocus={true}>
          </Marker>
        </div>

        <div>
          <Circle
            center={[Number(end.lat), Number(end.lng)]}
            radius={2}
            pathOptions={{
              color: getColor(WayPointType.GNSS),
              fillColor: "blue",
              fillOpacity: 0.2,
              weight: 1
            }}
          />
          <Marker icon={endIcon} position={[Number(end.lat),Number(end.lng)]} autoPanOnFocus={true}>
          </Marker>
        </div>

        {waypoints.map((waypoint, index) => (
          <Marker 
            key={`${waypoint.id}-${index}`}
            position={[waypoint.lat,waypoint.lng]}
            icon={roverIcon}
            eventHandlers={{
              click: () => setselectedWaypoint(waypoint)
            }}
          >
            <Popup>
              Waypoint {index+1}
            </Popup>
          </Marker>
        ))}

        <Marker ref={roverMarker} icon={roverIcon} position={[Number(roverPosition.lat),Number(roverPosition.lng)]} >
          <Popup>
            Rover is currently here
          </Popup>
        </Marker>

        <MapController roverPos={roverPosition}/>

        <Polyline
          positions={roverPositions.map(waypoint=>[waypoint.lat,waypoint.lng])}
          pathOptions={{color: 'red'}}
        />
      </Container>
      <WaypointContainer/>
    </div>
  )
}

export default MapContainer