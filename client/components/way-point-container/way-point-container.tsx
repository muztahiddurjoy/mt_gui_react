import React, { useState } from 'react'
import { Card } from '../ui/card'
import { WayPoint } from '../MapContainer'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import AddLatLonWaypoint from './add-latlon-waypoint/add-latlon-waypoint'
import SelectedWaypoint from './selected-waypoint/selected-waypoint'

interface WaypointContainerProps{
  waypoints:WayPoint[]
  selectedWaypoint:WayPoint|null
  setWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
  setSelectedWaypoint:React.Dispatch<React.SetStateAction<WayPoint|null>>
}

const WaypointContainer = (props:WaypointContainerProps) => {
  //states
  const [waypoint, setwaypoint] = useState<WayPoint>({
    id:props.waypoints.length,
    lat:0,
    lng:0,
    color:''
  })



  
  return (
    <div className='mt-[7vh] grid grid-rows-3 fixed top-0 right-0 w-[15%] h-[100vh] gap-3 p-1'>
      <div>
      {props.selectedWaypoint&&<SelectedWaypoint selectedWaypoint={props.selectedWaypoint} setSelectedWaypoint={props.setSelectedWaypoint} setWaypoints={props.setWaypoints} waypoints={props.waypoints}/>}
      <AddLatLonWaypoint setWaypoints={props.setWaypoints} waypoints={props.waypoints} waypoint={waypoint} setWaypoint={setwaypoint}/>
      <Card className='p-2'>
        <p className='text-xs'>All Waypoint</p>
        {
          props.waypoints.map(waypoint=>(
            <div key={waypoint.id} className='flex items-center gap-2 mt-1'>
              <div className='h-[12px] w-[12px] bg-blue-500'></div>
              <p className='text-xs'>WA {waypoint.id}</p>
            </div>
          ))
        }
      </Card>
      </div>
    </div>
  )
}

export default WaypointContainer