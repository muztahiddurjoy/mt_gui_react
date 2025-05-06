import React, { useEffect } from 'react'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Hammer, MapPin, Milk, QrCode, Target } from 'lucide-react'
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
import { getColor, WayPoint, WayPointType } from '../MapContainer'
import RoverFollower from '../rover-follower'


interface MapMenubarProps{
    wpType:WayPointType
    setwpType:React.Dispatch<React.SetStateAction<WayPointType>>
    mapActive:boolean
    setMapActive:React.Dispatch<React.SetStateAction<boolean>>
    wayPoints:WayPoint[]
    setWaypoint:React.Dispatch<React.SetStateAction<WayPoint[]>>
}


const MapMenubar = (props:MapMenubarProps) => {

  const changeMode = (wp:WayPointType)=>{
    props.setMapActive(p=> !p)
    props.setwpType(wp)
  }
  useEffect(() => {
     const handleKeyPress = (event: KeyboardEvent) => {
          if (event.key === 'G' || event.key === 'g') {
            changeMode(WayPointType.GNSS);
          }
          else if(event.key === 'A' || event.key === 'a'){
            changeMode(WayPointType.ARUCO);
          }
          else if(event.key === 'B' || event.key === 'b'){
            changeMode(WayPointType.BOTTLE);
          }
          else if(event.key === 'M' || event.key === 'm'){
            changeMode(WayPointType.MALLETE);
          }
          
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => {
          window.removeEventListener('keydown', handleKeyPress);
          
        };
  }, [])
  

  return (
    <Card className={`w-[65%] bg-primary/20 h-[7vh] flex items-center justify-between px-3`}>
       
        <div className='flex items-center gap-2'>
            <p className="text-sm">Options</p>
            <Button size="icon" onClick={()=> changeMode(WayPointType.ARUCO)} variant={props.wpType==WayPointType.ARUCO&&props.mapActive?"default":"outline"}><img src="/marker/aruco.png" className='h-[20px] w-[20px]'/></Button>
            <Button size="icon" onClick={()=> changeMode(WayPointType.BOTTLE)} variant={props.wpType==WayPointType.BOTTLE&&props.mapActive?"default":"outline"}><Milk/></Button>
            <Button size="icon" onClick={()=> changeMode(WayPointType.GNSS)} variant={props.wpType==WayPointType.GNSS&&props.mapActive?"default":"outline"}><MapPin/></Button>
            <Button size="icon" onClick={()=> changeMode(WayPointType.MALLETE)} variant={props.wpType==WayPointType.MALLETE&&props.mapActive?"default":"outline"}><Hammer/></Button>
        </div>
        <div>
            <Button>Execute</Button>
        </div>
    </Card>
  )
}

export default MapMenubar