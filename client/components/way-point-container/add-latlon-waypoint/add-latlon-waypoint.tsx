import { WayPoint } from '@/components/MapContainer'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { Colors } from '../data/colors'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export interface AddLatLonWaypointProps {
  waypoint: WayPoint,
  setWaypoint: React.Dispatch<React.SetStateAction<WayPoint>>
  setWaypoints: React.Dispatch<React.SetStateAction<WayPoint[]>>
  waypoints: WayPoint[]
}

const AddLatLonWaypoint = (props:AddLatLonWaypointProps) => {
     const [tempLat, settempLat] = useState<number|string>('')
      const [tempLon, settempLon] = useState<number|string>('')
      const [tempColor, settempColor] = useState(Colors.blue)

      const {toast} = useToast()
    
      const addLatLon = () => {
        if(!Number.isNaN(Number(tempLat))&&!Number.isNaN(Number(tempLon))){
          props.setWaypoints([...props.waypoints,{lat:parseFloat(tempLat as string),lng:parseFloat(tempLon as string),id:props.waypoints.length,color:tempColor}
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
            <DropdownMenuTrigger>
              <div className={`h-[30px] mt-1 w-[30px] rounded-sm ${tempColor}`}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent  onChange={(e)=>console.log(e)}>
              <DropdownMenuLabel className='text-xs font-semibold'>Waypoint Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={(e)=> props.setWaypoint(p=>({...p,color:e}))} className="grid grid-cols-4 gap-1">
              {
                Object.entries(Colors).map(([key,value])=>(
                  <DropdownMenuRadioItem value={value} key={key} className={`h-[20px] rounded-sm w-[20px] ${value}`} onClick={()=>settempColor(value)}></DropdownMenuRadioItem>
                ))
              }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
      
          <Button onClick={addLatLon} disabled={!tempLat || !tempLon} className='text-xs flex-1 mt-1 w-full text-white' size='sm'>Add</Button>
        </div>
    </Card>
  )
}

export default AddLatLonWaypoint