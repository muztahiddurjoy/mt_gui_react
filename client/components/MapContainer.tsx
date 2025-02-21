"use client"
import { MapContainer as Container, Marker, Popup, TileLayer, useMap,useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import React, { useState } from 'react'
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

export interface WayPoint{
  lat:number;
  lng:number;
  id:number;
  color:string;
  name:string;
}


const MapContainer = () => {
  const [waypoints, setwaypoints] = useState<WayPoint[]>([])
  const [selectedWaypoint, setselectedWaypoint] = useState<WayPoint|null>(null)
 const [tempColor, settempColor] = useState(Colors.green)
 const [selectedWaypoints, setselectedWaypoints] = useState<WayPoint[]>([])
  const roverIcon = new L.Icon({
    iconUrl: '/marker/rover-marker.png',
    iconSize: [40, 40],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        setwaypoints([...waypoints,{lat:e.latlng.lat,lng:e.latlng.lng,id:waypoints.length,color:tempColor,name:`WP${waypoints.length+1}`}])
      },
    });
    return null;
  };
  
  return (
    <div className='relative'>
        <Container center={[23.773543143713756, 90.42405371687714]} style={{ position:'fixed',height: '93vh',width:'65%',marginLeft:'20%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
  maxZoom={25}
  maxNativeZoom={19}
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
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
        return <Marker key={index} icon={waypointIcon} position={[waypoint.lat,waypoint.lng]} autoPanOnFocus={true} eventHandlers={{click:()=>{
            setselectedWaypoint(waypoint)
          }}}>
          </Marker>
    })
  }
  <Marker icon={roverIcon} position={[23.773543143713756, 90.42405371687714]}>
    <Popup>
      <p className='text-red-500'>hi</p>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</Container>
<WaypointContainer selectedWaypoints={selectedWaypoints} setSelectedWaypoints={setselectedWaypoints} setSelectedWaypoint={setselectedWaypoint} setWaypoints={setwaypoints} selectedWaypoint={selectedWaypoint} waypoints={waypoints}/>
    </div>
  )
}

export default MapContainer