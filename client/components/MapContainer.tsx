"use client"
import { Circle, MapContainer as Container, Marker, Popup, TileLayer, useMap,useMapEvents } from 'react-leaflet'

import L from 'leaflet'
import 'leaflet-rotatedmarker'
import React, { useEffect, useRef, useState } from 'react'
import "leaflet/dist/leaflet.css";
// import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import TopBar from './dashboard/top-bar/top-bar';
import { FlagIcon, FlagTriangleRight, Map } from 'lucide-react';
import { Button } from './ui/button';
import WaypointContainer from './way-point-container/way-point-container';
import { toast } from 'sonner';
import {renderToString} from 'react-dom/server'
import { Colors } from './way-point-container/data/colors';
import MapMenubar from './map-menubar/map-menubar';
import OrientationContainer from './orientation-container/orientation-container';
import { getROS } from '@/ros-functions/connect';
import ROSLIB, { Ros } from 'roslib';
import RoverFollower from './rover-follower'
import { degreeToRadian, radianToDegree } from './orientation-container/angle-container/angle-container'

export interface WayPoint{
  lat:number;
  lng:number;
  id:number;
  color:string;
  name:string;
}

export interface Coordinate{
  lat:number
  lng:number
}


const MapContainer = () => {
  const [waypoints, setwaypoints] = useState<WayPoint[]>([])
  const [selectedWaypoint, setselectedWaypoint] = useState<WayPoint|null>(null)
 const [tempColor, settempColor] = useState<string>('auto')
 const [mapActive, setmapActive] = useState<boolean>(false)
 const [roverPosition, setroverPosition] = useState<Coordinate>({lat:23.7683770084366, lng:90.45138097558959})
 const [roverRotation, setroverRotation] = useState(Math.PI)
 const [ros, setros] = useState<Ros | null>(null)
 const [isRosConnected, setisRosConnected] = useState<boolean>(false)

 const roverMarker = useRef(null)
  // const map = useMap();

  useEffect(() => {
    if (roverMarker.current) {
      // console.log('Setting rotation angle:', roverRotation);
      (roverMarker.current as any).setRotationAngle(roverRotation);
      (roverMarker.current as any).setRotationOrigin('center');
    }
  }, [roverRotation]);



 const [selectedWaypoints, setselectedWaypoints] = useState<WayPoint[]>([])
  const roverIcon = new L.Icon({
    iconUrl: '/marker/rover-marker.png',
    className:'transition-transform duration-100 ease-in-out',
    iconSize: [35, 35],
    iconAnchor: [17, 35],
    popupAnchor: [1, -34],
    // shadowSize: [41, 41]
  });

  

  

  const MapClickHandler = () => {
    if(mapActive){
      useMapEvents({
        click(e) {
          setwaypoints([...waypoints,{lat:e.latlng.lat,lng:e.latlng.lng,id:waypoints.length,color:tempColor=="auto"?Object.values(Colors)[Math.floor(Math.random() * Object.values(Colors).length)]:tempColor,name:`WP${waypoints.length+1}`}])
        },
      });
    }
    return null;
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'M' || event.key === 'm') {
        setmapActive(prevState => !prevState);
      }
    };
    getROS().then(ros=>{
     ros.on('connection',()=>{
        setisRosConnected(true)
      })
      setros(ros)
      ros.on('close',()=>{
        setisRosConnected(false)
      })
    }
    )

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if(ros){
        ros.close()
      }
    };
  }, []);

  // useEffect(() => {
  //   // const interval = setInterval(() => {
  //   //   setroverRotation((prevState) => (prevState + 0.1) % (2 * Math.PI)); // Increment rotation and keep it within 0-2π
  //   //   setroverPosition((prevState) => ({
  //   //     lat: prevState.lat + Math.sin(roverRotation) * 0.0001,
  //   //     lng: prevState.lng + Math.cos(roverRotation) * 0.0001,
  //   //   })); // Move rover in the direction of rotation
  //   // }, 200);
  
  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, []);


  useEffect(() => {
      getROS().then((ros)=>{
        if(ros.isConnected){
        const angleTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/sbg/ekf_euler',
          messageType:'sbg_driver/SbgEkfEuler'
        })
        const gpsTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/sbg/gps_pos',
          messageType:'sbg_driver/SbgGpsPos'
        })

        angleTopic.subscribe((msg:any)=>{
          // console.log(msg)
          setroverRotation(radianToDegree(msg.angle.z))
        })

        gpsTopic.subscribe((msg:any)=>{
          setroverPosition({
            lat:msg.latitude,
            lng:msg.longitude
          })
          console.log(msg.latitude,msg.longitude)
        })
        
        console.log('subscribed to',angleTopic.name)
      }
      else{
        toast.error('Cannot subscribe to angle topic. ROS not connected')
      }
      })
      
    }, [])
  

  // useEffect(() => {
  //   if(tempColor=='auto'){
  //     if(waypoints.length>0){
  //     const colors = Object.values(Colors)
  //     const lastColor = waypoints[waypoints.length-1].color
  //     const index = colors.findIndex(color=>color===lastColor)
  //     if(index==colors.length-1){
  //       settempColor(colors[0])
  //     }
  //     else{
  //       settempColor(colors[index+1])
  //     }
  //   }else{
  //     settempColor(Colors.green)
  //   }
  //   }
  // }, [tempColor])

  

  
  
  return (
    <div className='relative'>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[7vh] left-[50%] font-bold absolute z-50 bg-orange-500/50">N</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[87vh] left-[50%] font-bold absolute z-50 bg-sky-500/50">S</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] left-[20%] font-bold absolute z-50 bg-purple-500/50">W</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] right-[15%] font-bold absolute z-50 bg-red-500/50">E</div>
      <OrientationContainer waypoints={waypoints}/>
        <Container  center={[roverPosition.lat, roverPosition.lng]} style={{ position:'fixed',height: '86vh',width:'65%',marginLeft:'20%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
  maxZoom={25}
  maxNativeZoom={19}
    attribution='&copy; <a href="#">Google</a>'
    // url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    url='http://localhost:8080/wmts/gm_layer/gm_grid/{z}/{x}/{y}.png'
  />
  
  <MapClickHandler/>
  {
    waypoints.map((waypoint,index)=>{
      const waypointIcon = L.divIcon({
        html: `<div class="flex flex-col items-center">
        ${renderToString(
          <div className='relative'>
            <div className={`h-[40px] w-[2px] ${waypoint.color}`}></div>
            <div className={`h-[20px] absolute top-0 left-0 w-[40px] ${waypoint.color} text-xs flex items-center justify-center text-white`}>{waypoint.name}</div>
          </div>
        )}
       
        </div>`,
        className: `w-20 h-20 `,
        iconSize: [40, 40],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });  
        return <>
         <Circle
          center={[waypoint.lat, waypoint.lng]}
          radius={1.5} // 3 meters
          pathOptions={{
            color: waypoint.color,    // Border color matches waypoint
            fillColor: 'blue',// Fill color matches waypoint
            fillOpacity: 0.2,         // Semi-transparent fill
            weight: 1                 // Border thickness
          }}
        />
        <Marker key={index} icon={waypointIcon} position={[waypoint.lat,waypoint.lng]} autoPanOnFocus={true} eventHandlers={{click:()=>{
            setselectedWaypoint(waypoint)
          }}}>
          </Marker>
          </>
    })
  }
  <Marker ref={roverMarker} icon={roverIcon} position={[roverPosition.lat,roverPosition.lng]} >
    <Popup>
      Rover is currently here
    </Popup>
  </Marker>
  
</Container>
<div className='fixed bottom-0 ml-[20%] w-full'>
           
  <MapMenubar mapActive={mapActive} setMapActive={setmapActive} setWaypoint={setwaypoints} wayPoints={waypoints} settempColor={settempColor} tempColor={tempColor}/>
</div>

<WaypointContainer selectedWaypoints={selectedWaypoints} setSelectedWaypoints={setselectedWaypoints} setSelectedWaypoint={setselectedWaypoint} setWaypoints={setwaypoints} selectedWaypoint={selectedWaypoint} waypoints={waypoints}/>
    </div>
  )
}

export default MapContainer