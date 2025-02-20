"use client"
import { MapContainer as Container, Marker, Popup, TileLayer, useMap,useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import React, { useState } from 'react'
import "leaflet/dist/leaflet.css";
// import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import TopBar from './dashboard/top-bar/top-bar';
import { Map } from 'lucide-react';
import { Button } from './ui/button';
import WaypointContainer from './way-point-container/way-point-container';
import { toast } from 'sonner';

export interface WayPoint{
  lat:number;
  lng:number;
  id:number;
  color?:string;
}


const MapContainer = () => {
  const [waypoints, setwaypoints] = useState<WayPoint[]>([])
  const [selectedWaypoint, setselectedWaypoint] = useState<WayPoint|null>(null)
 
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
        setwaypoints([...waypoints,{lat:e.latlng.lat,lng:e.latlng.lng,id:waypoints.length}])
      },
    });
    return null;
  };
  
  return (
    <div className='relative'>
        <Container center={[23.772794613186193, 90.4253266921477]} style={{ position:'fixed',height: '93vh',width:'65%',marginLeft:'20%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
  maxZoom={25}
  maxNativeZoom={19}
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  />
  <MapClickHandler/>
  {
    waypoints.map((waypoint,index)=>(
      <Marker key={index} icon={roverIcon} position={[waypoint.lat,waypoint.lng]} autoPanOnFocus={true} eventHandlers={{click:()=>{
        setselectedWaypoint(waypoint)
      }}}>
      </Marker>
    ))
  }
  <Marker icon={roverIcon} position={[23.772794613186193, 90.4253266921477]}>
    <Popup>
      <p className='text-red-500'>hi</p>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</Container>
<WaypointContainer setSelectedWaypoint={setselectedWaypoint} setWaypoints={setwaypoints} selectedWaypoint={selectedWaypoint} waypoints={waypoints}/>
    </div>
  )
}

export default MapContainer