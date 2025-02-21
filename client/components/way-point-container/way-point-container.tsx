import React, { useState } from 'react'
import { Card } from '../ui/card'
import { WayPoint } from '../MapContainer'
import { Button } from '../ui/button'
import { Trash2 } from 'lucide-react'
import AddLatLonWaypoint from './add-latlon-waypoint/add-latlon-waypoint'
import SelectedWaypoint from './selected-waypoint/selected-waypoint'
import { Colors } from './data/colors'
import WaypointAdapter from './way-point-adapter/way-point-adapter'

interface WaypointContainerProps{
  waypoints:WayPoint[]
  selectedWaypoint:WayPoint|null
  selectedWaypoints:WayPoint[]
  setWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
  setSelectedWaypoint:React.Dispatch<React.SetStateAction<WayPoint|null>>
  setSelectedWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
}

const WaypointContainer = (props:WaypointContainerProps) => {
  //states
  const [waypoint, setwaypoint] = useState<WayPoint>({
    id:props.waypoints.length,
    lat:0,
    lng:0,
    color:Colors.blue,
    name:`WP${props.waypoints.length+1}`
  })



  
  return (
    <div className='mt-[7vh] grid grid-rows-3 fixed top-0 right-0 w-[15%] h-[100vh] gap-3 p-1'>
      <div>
      {props.selectedWaypoint&&<SelectedWaypoint selectedWaypoint={props.selectedWaypoint} setSelectedWaypoint={props.setSelectedWaypoint} setWaypoints={props.setWaypoints} waypoints={props.waypoints}/>}
      <AddLatLonWaypoint setWaypoints={props.setWaypoints} waypoints={props.waypoints} waypoint={waypoint} setWaypoint={setwaypoint}/>
      <Card className='p-2'>
        <p className='text-xs'>All Waypoint</p>
        {
          props.waypoints.sort((a,b)=>a.id-b.id).map(waypoint=>(
            <WaypointAdapter index={props.waypoints.findIndex((v)=>v.lat==waypoint.lat&&v.lng==waypoint.lng)} waypoint={waypoint} key={waypoint.id} {...props}/>
          ))
        }
      </Card>
      </div>
    </div>
  )
}

export default WaypointContainer