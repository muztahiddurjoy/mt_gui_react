"use client"
import { Circle, MapContainer as Container, Marker, Polyline, Popup, TileLayer, useMap,useMapEvents } from 'react-leaflet'

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
import { calculateDistance } from './orientation-container/distance-calculator/functions/calculate-distance'
import TestComponent from './dashboard/test-component'
import MapController from './dashboard/test-component'

export interface WayPoint{
  lat:number;
  lng:number;
  id:number;
  type:WayPointType;
  name:string;
}

export interface Coordinate{
  lat:number
  lng:number
}

export enum WayPointType{
  GNSS,
  MALLETE,
  BOTTLE,
  ARUCO
}
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
 const [roverPosition, setroverPosition] = useState<Coordinate>({lat:23.772505, lng:90.4227142})
 const [roverRotation, setroverRotation] = useState(Math.PI)
 const [roverPositions, setroverPositions] = useState<Coordinate[]>([])
 const [ros, setros] = useState<Ros | null>(null)
 const [isRosConnected, setisRosConnected] = useState<boolean>(false)

 const roverMarker = useRef(null)

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
          setwaypoints([...waypoints,{lat:e.latlng.lat,lng:e.latlng.lng,id:waypoints.length,type:wptype,name:`${getInitial(wptype)}${waypoints.filter((v)=>v.type==wptype).length+1}`}])
        },
      });
    }
    return null;
  };

  useEffect(() => {
    setwaypoints(JSON.parse(localStorage.getItem('waypoints')||'[]'))
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
  return ()=>{
    if(ros){
      ros.close()
    }
  }
   
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setroverRotation((prevState) => (prevState + 0.1) % (2 * Math.PI)); // Increment rotation and keep it within 0-2π
  //     setroverPosition((prevState) => ({
  //       lat: prevState.lat + Math.random()/1000000,
  //       lng: prevState.lng + Math.random()/1000000,
  //     })); // Move rover in the direction of rotation
  //   }, 100);
  
  //   return () => clearInterval(interval); // Cleanup interval on unmount
  // }, []);

  useEffect(() => {
      if(roverPositions.length>0){
        const distance = calculateDistance(roverPosition.lat,roverPosition.lng,roverPositions[roverPositions.length-1].lat,roverPositions[roverPositions.length-1].lng)
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


  useEffect(() => {
    if(waypoints){
      localStorage.setItem('waypoints',JSON.stringify(waypoints))
    }
  }, [waypoints])
  

 

  const clearRoverWaypoints = ()=>{
    setroverPositions([])
  }
  

  
  
  return (
    <div className='relative'>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[7vh] left-[50%] font-bold absolute z-50 bg-orange-500/50" onClick={clearRoverWaypoints}>N</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[87vh] left-[50%] font-bold absolute z-50 bg-sky-500/50">S</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] left-[20%] font-bold absolute z-50 bg-purple-500/50">W</div>
      <div className="w-[40px] h-[40px] flex items-center justify-center text-2xl top-[45vh] right-[15%] font-bold absolute z-50 bg-red-500/50">E</div>
      <OrientationContainer rover={roverPosition} waypoints={waypoints}/>
        <Container center={[roverPosition.lat, roverPosition.lng]} style={{ position:'fixed',height: '86vh',width:'65%',marginLeft:'20%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
  maxZoom={25}
  maxNativeZoom={19}
    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    url="http://localhost:8080/wmts/gm_layer/gm_grid/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">Google</a>'
  />
  
  <MapClickHandler/>
  {
    waypoints.map((waypoint,index)=>{
      const waypointIcon = L.divIcon({
        html: `<div class="flex flex-col items-center">
        ${renderToString(
          <div className='relative'>
            <div className={`h-[40px] w-[2px] ${getColor(waypoint.type)}`}></div>
            <div className={`h-[20px] absolute top-0 left-0 w-[40px] ${getColor(waypoint.type)} text-xs flex items-center justify-center text-white`}>{waypoint.name}</div>
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
          radius={
            waypoint.type === WayPointType.GNSS
              ? 2
              : waypoint.type === WayPointType.ARUCO
              ? 20
              : 10
          } // 3 meters
          pathOptions={{
            color: getColor(waypoint.type),    // Border color matches waypoint
            fillColor: waypoint.type == WayPointType.ARUCO? 'white': waypoint.type==WayPointType.BOTTLE ? 'teal' : waypoint.type == WayPointType.GNSS ? 'blue':'orange' ,// Fill color matches waypoint
            fillOpacity: 0.2,         // Semi-transparent fill
            weight: 1                 // Border thickness
          }}
        />
        <Marker key={waypoint.id} icon={waypointIcon} position={[waypoint.lat,waypoint.lng]} autoPanOnFocus={true} eventHandlers={{click:()=>{
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
  <Polyline
  positions={waypoints.map(waypoint=>[waypoint.lat,waypoint.lng])}
  pathOptions={{color: '#03ffcd'}}
  dashArray={[3, 10]}
/>
<MapController roverPos={roverPosition}/>

<Polyline
  positions={roverPositions.map(waypoint=>[waypoint.lat,waypoint.lng])}
  
  pathOptions={{color: 'red'}}
/>
</Container>
<div className='fixed bottom-0 ml-[20%] w-full'>   
  <MapMenubar mapActive={mapActive} setMapActive={setmapActive} setWaypoint={setwaypoints} wayPoints={waypoints} setwpType={setwptype} wpType={wptype}/>
</div>

<WaypointContainer selectedWaypoints={selectedWaypoints} setSelectedWaypoints={setselectedWaypoints} setSelectedWaypoint={setselectedWaypoint} setWaypoints={setwaypoints} selectedWaypoint={selectedWaypoint} waypoints={waypoints}/>
    </div>
  )
}

export default MapContainer