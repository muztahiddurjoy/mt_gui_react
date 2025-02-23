"use client"
import React from 'react'
import { useMap } from 'react-leaflet'
import { Button } from './ui/button'
import { Target } from 'lucide-react'

interface RoverFollowerProps{
    lat:number
    lng:number
}

const RoverFollower = (props:RoverFollowerProps) => {
    const map = useMap()
    const goToPosition = ()=>{
        map.flyTo([props.lat, props.lng],map.getZoom())
    }
  return (
    <div>
        <Button size="icon" onClick={goToPosition}><Target/></Button>
    </div>
  )
}

export default RoverFollower