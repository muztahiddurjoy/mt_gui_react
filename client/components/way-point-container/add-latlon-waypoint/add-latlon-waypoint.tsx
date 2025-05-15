
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Colors } from '../data/colors'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { WayPointType } from '@/types/WaypointType'
import { WayPoint } from '@/types/Waypoint'
import { getInitial } from '@/functions/getInitials'
import { getColor } from '@/functions/getColor'

export interface AddLatLonWaypointProps {
  waypoint: WayPoint,
  setWaypoint: React.Dispatch<React.SetStateAction<WayPoint>>
  setWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>
  waypoints: WayPoint[]
}

const AddLatLonWaypoint = (props:AddLatLonWaypointProps) => {
     const [tempLat, settempLat] = useState<number|string>('')
      const [tempLon, settempLon] = useState<number|string>('')
      const [tempType, settempType] = useState<WayPointType>(WayPointType.GNSS)

      const {toast} = useToast()
    
      const addLatLon = () => {
        if(!Number.isNaN(Number(tempLat))&&!Number.isNaN(Number(tempLon))){
          props.setWaypoints([...props.waypoints,{lat:parseFloat(tempLat as string),lng:parseFloat(tempLon as string),id:props.waypoints.length,type:tempType,name:`${getInitial(tempType)}${props.waypoints.filter((v)=>v.type==tempType).length+1}`}
          ])
          settempLat('')
          settempLon('')
        }
        else{
          toast({
            title:'Invalid Coordinates',
            description:'Please provide a valid latitude and longitude',
            variant:'destructive'
          })
        }
      }

    
  return (
    <Card className='p-2'>
        <p className='text-xs font-semibold'>Add Waypoint</p>
        <label className='text-xs'>Latitude</label>
        <Input
            type='text'
            size={10}
            value={tempLat}
            onChange={(e)=> settempLat(e.target.value)}/>
        <label className='text-xs mt-1'>Longitude</label>
        <Input
            type='text'
            size={10}
            value={tempLon}
            onChange={(e)=> settempLon(e.target.value)}/>

        <div className="flex items-items gap-1">
          <DropdownMenu >
            <DropdownMenuTrigger className={`text-xs ${getColor(tempType)} w-[40px] mt-1`}>
              {getInitial(tempType)}
            </DropdownMenuTrigger>
            <DropdownMenuContent  onChange={(e)=>console.log(e)}>
              <DropdownMenuLabel className='text-xs font-semibold'>Waypoint Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup>
              <DropdownMenuRadioItem value={WayPointType.GNSS.toString()} onClick={()=> settempType(WayPointType.GNSS)}>GNSS</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={WayPointType.ARUCO.toString()} onClick={()=> settempType(WayPointType.ARUCO)}>Aruco</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={WayPointType.MALLETE.toString()} onClick={()=> settempType(WayPointType.MALLETE)}>Mallete</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={WayPointType.BOTTLE.toString()} onClick={()=> settempType(WayPointType.BOTTLE)}>Bottle</DropdownMenuRadioItem>

              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      
          <Button onClick={addLatLon} disabled={!tempLat || !tempLon} className='text-xs flex-1 mt-1 w-full text-white' size='sm'>Add</Button>
        </div>
    </Card>
  )
}

export default AddLatLonWaypoint