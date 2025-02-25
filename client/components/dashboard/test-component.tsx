"use client"
import { useEffect } from "react"
import { useMap } from "react-leaflet"
import { Coordinate } from "../MapContainer"

interface MapControllerProps{
    roverPos:Coordinate
}

const MapController = (props:MapControllerProps)=>{
    const map = useMap()
    useEffect(()=>{
        if(map){
            map.flyTo(props.roverPos,map.getZoom())
        }
  //  map.flyTo

    },[props])
    return(
        <></>
    )
}

export default MapController