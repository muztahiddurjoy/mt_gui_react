import { WayPoint } from '@/components/MapContainer'
import { Card } from '@/components/ui/card'
import React from 'react'
import { calculateDistance } from './functions/calculate-distance'

interface DistanceCalculatorProps{
    waypoints:WayPoint[]
}

const DistanceCalculator = (props:DistanceCalculatorProps) => {
  return (
    <Card className='p-2'>
        <p className='text-sm'>Steps</p>
        <div className='flex items-center flex-wrap gap-1 mt-2'>
        {/* <img src="/marker/rover-marker.png" className='h-[30px] w-[30px]'/> */}
        {props.waypoints.sort((a,b)=>a.id-b.id).map((wp,i)=>{
            return <div className='flex items-center'>
                <div className={`text-xs ${wp.color} p-1`}>{wp.name}</div>
                {
                    i<props.waypoints.length-1&&<div className='text-xs'>..{Math.floor(calculateDistance(wp.lat,wp.lng,props.waypoints[i+1].lat,props.waypoints[i+1].lng)).toFixed(2)}m..</div>
                }
            </div>
        })}
        </div>
        <p></p>
    </Card>
  )
}

export default DistanceCalculator