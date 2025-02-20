"use client"
import { MapContainer as Container, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React from 'react'
import "leaflet/dist/leaflet.css";
import 'leaflet.offline';
import 'leaflet/dist/leaflet.css';
const MapContainer = () => {
  return (
    <div>
        <Container center={[23.772794613186193, 90.4253266921477]} style={{ height: '100vh' }} zoom={100} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  />
  <Marker position={[23.772794613186193, 90.4253266921477]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</Container>

    </div>
  )
}

export default MapContainer