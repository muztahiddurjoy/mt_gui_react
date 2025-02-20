"use client"
import { MapContainer as Container, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React from 'react'
import "leaflet/dist/leaflet.css";
// import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
import TopBar from './dashboard/top-bar/top-bar';
const MapContainer = () => {
  return (
    <div className='relative'>
      <TopBar/>
        <Container center={[23.772794613186193, 90.4253266921477]} style={{ height: '80vh',width:'70%',marginLeft:'15%',marginTop:'7vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  />
  <Marker position={[23.772794613186193, 90.4253266921477]}>
    <Popup>
      <p className='text-red-500'>hi</p>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</Container>

    </div>
  )
}

export default MapContainer