import React from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Colors } from '../way-point-container/data/colors'
import { WayPoint } from '../MapContainer'


interface MapMenubarProps{
    tempColor:string
    settempColor:React.Dispatch<React.SetStateAction<string>>
    mapActive:boolean
    setMapActive:React.Dispatch<React.SetStateAction<boolean>>
    wayPoints:WayPoint[]
    setWaypoint:React.Dispatch<React.SetStateAction<WayPoint[]>>
}


const MapMenubar = (props:MapMenubarProps) => {
  return (
    <Card className='w-[65%] bg-primary/20 h-[7vh] flex items-center justify-between px-3'>
        <div className='flex items-center gap-2'>
            <p className="text-sm">Status</p>
            <div className='h-[20px] w-[20px] rounded-full bg-green-500'></div>
            <div className='h-[20px] w-[20px] rounded-full bg-red-500'></div>
            <div className='h-[20px] w-[20px] rounded-full bg-blue-500'></div>
        </div>
        <div className='flex items-center gap-2'>
            <p className="text-sm">Options</p>
            <Button size="icon" onClick={()=> props.setMapActive(p=> !p)} variant={props.mapActive?"default":"outline"}><MapPin/></Button>
            <DropdownMenu>
            <DropdownMenuTrigger className='border border-primary'>
              <div className={`h-[30px] mt-1 w-[30px] rounded-sm ${props.tempColor}`}></div>
            </DropdownMenuTrigger>
            <DropdownMenuContent  onChange={(e)=>console.log(e)}>
              <DropdownMenuLabel className='text-xs font-semibold'>Waypoint Tag</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup onValueChange={(e)=> props.settempColor(e)} className="grid grid-cols-4 gap-1">
              <DropdownMenuRadioItem value="auto"  className={`h-[20px] rounded-xs w-[30px]`}>Auto</DropdownMenuRadioItem>
              {
                Object.entries(Colors).map(([key,value])=>(
                  <DropdownMenuRadioItem value={value} key={key} className={`h-[20px] rounded-sm w-[20px] ${value}`} onClick={()=>props.settempColor(value)}></DropdownMenuRadioItem>
                ))
              }
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
            <Button>Execute</Button>
        </div>
    </Card>
  )
}

export default MapMenubar