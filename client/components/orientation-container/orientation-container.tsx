import React from 'react'
import { Card } from '../ui/card'
import CompassContainer from './compass-container/compass-container'
import AngleContainer from './angle-container/angle-container'
import DistanceCalculator from './distance-calculator/distance-calculator'
import { Coordinate, WayPoint } from '../MapContainer'

interface OrientationContainerProps{
    waypoints:WayPoint[]
    rover:Coordinate
}

const OrientationContainer = (props:OrientationContainerProps) => {
  return (
    <div className='h-[93vh] fixed bottom-0 top-0 left-0 w-[20%] mt-[7vh]'>
        <DistanceCalculator {...props}/>
        <AngleContainer/> 
        <CompassContainer/>
    </div>
  )
}

export default OrientationContainer