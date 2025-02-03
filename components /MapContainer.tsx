"use client"
import { MapContainer as Container, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import React from 'react'
import "leaflet/dist/leaflet.css";

const MapContainer = () => {
  return (
    <div>
        <Container center={[51.505, -0.09]} style={{ height: '100vh' }} zoom={13} scrollWheelZoom={true}>
  <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[51.505, -0.09]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</Container>

    </div>
  )
}

export default MapContainer