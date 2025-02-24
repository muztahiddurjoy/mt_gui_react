import { getColor, WayPoint } from '@/components/MapContainer'
import { Card } from '@/components/ui/card'
import React from 'react'
import { calculateDistance } from './functions/calculate-distance'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface DistanceCalculatorProps{
    waypoints:WayPoint[]
    rover:{lat:number,lng:number}
}

const DistanceCalculator = (props:DistanceCalculatorProps) => {
  return (
    <Card className='p-2 h-[30vh] overflow-y-scroll'>
        <p className='text-sm'>Steps</p>
        <div className='flex items-center flex-wrap gap-1 mt-2'>
        {props.waypoints.length>0&&<div className='flex items-center gap-2'>
        <img src="/marker/rover-marker.png" className='h-[20px] w-[20px] rotate-45'/>
        <p className='text-xs gap-2 flex items-center'><ArrowRight size={15}/>{calculateDistance(props.rover.lat,props.rover.lng,props.waypoints[0].lat,props.waypoints[0].lng).toFixed(2)}m<ArrowRight size={15}/></p>
        </div>}
        {props.waypoints.sort((a,b)=>a.id-b.id).map((wp,i)=>{
            return <div className='flex items-center'>
                <div className={`text-xs ${getColor(wp.type)} p-1`}>{wp.name}</div>
                {
                    i<props.waypoints.length-1&&<div className='text-xs flex items-center'><ArrowRight size={15}/>{Math.floor(calculateDistance(wp.lat,wp.lng,props.waypoints[i+1].lat,props.waypoints[i+1].lng)).toFixed(2)}m<ArrowRight size={15}/></div>
                }
            </div>
        })}
        </div>
        <p></p>
    </Card>
  )
}

export default DistanceCalculator