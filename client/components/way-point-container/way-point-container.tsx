import React from 'react'
import { Card } from '../ui/card'
import { WayPoint } from '../MapContainer'

interface WaypointContainerProps{
  waypoints:WayPoint[]
  selectedWaypoint:WayPoint|null
}

const WaypointContainer = (props:WaypointContainerProps) => {
  return (
    <div className='mt-[7vh] grid grid-rows-3 fixed top-0 right-0 w-[15%] h-[100vh] gap-3 p-1'>
      <div>
      {props.selectedWaypoint&&<Card className='p-2'>
        <p className='text-xs'>Selected Waypoint</p>
        <div className="flex items-center gap-2">
          <div className='h-[3px] w-[3px] bg-blue-500'></div>
        </div>
      </Card>}
      <Card className='p-2'>
        <p className='text-xs'>All Waypoint</p>
      </Card>
      </div>
    </div>
  )
}

export default WaypointContainer