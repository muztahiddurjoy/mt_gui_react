import { WayPoint } from '@/components/MapContainer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowDown, ArrowUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface WaypointAdapterProps{
    index:number
    waypoint:WayPoint
    selectedWaypoint:WayPoint|null
    setSelectedWaypoint:React.Dispatch<React.SetStateAction<WayPoint|null>>
    setWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
    selectedWaypoints:WayPoint[]
    setSelectedWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
    waypoints:WayPoint[]
}

const WaypointAdapter = (props:WaypointAdapterProps) => {
  const [pointSelected, setpointSelected] = useState<boolean>(false)
  const addWaypointToSelected = () => {
    if(props.selectedWaypoints.find(wp=>wp.id===props.waypoint.id)){
      props.setSelectedWaypoints(props.selectedWaypoints.filter(wp=>wp.id!==props.waypoint.id))
    }
    else{
      props.setSelectedWaypoints([...props.selectedWaypoints,props.waypoint])
    }
  }

  const bringUp = () => {
    const index = props.waypoints.findIndex(wp=>wp.id===props.waypoint.id)
    console.log(index)
    if(index>0){
      const temp = [...props.waypoints]
      const tempIndex = temp[index].id
      temp[index].id = tempIndex-1
      temp[index-1].id = tempIndex
      props.setWaypoints(temp)
    }
  }

  const bringDown = () => {
    const index = props.waypoints.findIndex(wp=>wp.id===props.waypoint.id)
    if(index<props.waypoints.length-1){
      const temp = [...props.waypoints]
      const tempIndex = temp[index].id
      temp[index].id = tempIndex+1
      temp[index+1].id = tempIndex
      props.setWaypoints(temp)
    }
  }



  useEffect(() => {
    if(props.selectedWaypoints.find(wp=>wp.id===props.waypoint.id)){
      setpointSelected(true)
    }
    else{
      setpointSelected(false)
    }
  }, [props.selectedWaypoints])
  
  return (
    <Card key={props.waypoint.id} className='flex items-center gap-2 mt-1 justify-between p-2'>
      <div className="flex items-center gap-2">
              <Checkbox id={`wp-${props.waypoint.id}`} onCheckedChange={addWaypointToSelected} checked={pointSelected}/>
              <div className={`h-[12px] w-[12px] ${props.waypoint.color}`}></div>
              <label className='text-xs' htmlFor={`wp-${props.waypoint.id}`}>{props.waypoint.name}</label>
      </div>
      <div className='flex items-center gap-1'>
        <Button variant="outline" className='w-[10px] h-[20px]' onClick={bringDown} size="sm"><ArrowDown size={10}/></Button>
        <Button variant="outline" className='w-[10px] h-[20px]' onClick={bringUp} size="sm"><ArrowUp size={10}/></Button>
      </div>
    </Card>
  )
}

export default WaypointAdapter