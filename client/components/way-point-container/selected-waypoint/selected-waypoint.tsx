import { WayPoint } from '@/components/MapContainer'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Edit, Edit2, Trash2, X } from 'lucide-react'
import React from 'react'

interface SelectedWaypointProps{
    selectedWaypoint:WayPoint
    setSelectedWaypoint:React.Dispatch<React.SetStateAction<WayPoint|null>>
    setWaypoints:React.Dispatch<React.SetStateAction<WayPoint[]>>
    waypoints:WayPoint[]
}

const SelectedWaypoint = (props:SelectedWaypointProps) => {

    const deleteWaypoint = (waypoint:WayPoint) => {
        props.setWaypoints(props.waypoints.filter(wp=>wp.id!==waypoint.id))
        props.setSelectedWaypoint(null)
    }

    const editWaypoint = () => {
        props.setWaypoints(props.waypoints.map(wp=>wp.id===props.selectedWaypoint.id?props.selectedWaypoint:wp))
        props.setSelectedWaypoint(null)
    }

  return (
    <Card className='p-2'>
        <div className="flex items-center gap-2">
        <button onClick={()=>props.setSelectedWaypoint(null)} className='text-red-500'><X  size={15}/></button>
            <p className='text-xs font-semibold'>Selected Waypoint</p>
        </div>
        <div className="flex items-center gap-2 mt-1 justify-between">
          <div className='flex items-center gap-2'>
            <div className='h-[12px] w-[12px] bg-blue-500'></div>
            <p className='text-xs'>WA {props.selectedWaypoint.id}</p>
          </div>
          <div className="flex justify-end gap-1">
          <Dialog>
            <DialogTrigger className={buttonVariants({variant:'outline',size:'sm'})}><Edit2 size={10}/></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-primary'>Edit Waypoint</DialogTitle>
                <DialogDescription>
                    <div className="flex items-center gap-2">
                        <div>
                            <label className='text-xs font-semibold'>Latitude</label>
                            <Input type='text' className='w-full mt-1 p-1 border border-gray-300' value={props.selectedWaypoint.lat} onChange={e=>{
                                props.setSelectedWaypoint({...props.selectedWaypoint,lat:parseFloat(e.target.value)})
                            }}/>
                        </div>
                        <div>
                            <label className='text-xs mt-1 font-semibold'>Longitude</label>
                            <Input type='text' className='w-full mt-1 p-1 border border-gray-300' value={props.selectedWaypoint.lng} onChange={e=>{
                                props.setSelectedWaypoint({...props.selectedWaypoint,lng:parseFloat(e.target.value)})
                            }}/>
                        </div>
                    </div>
                    
                   
                    <Button onClick={editWaypoint} disabled={Number.isNaN(props.selectedWaypoint.lat) || Number.isNaN(props.selectedWaypoint.lng)} className='text-xs mt-1 w-full text-white' size='sm'>Save</Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger className={buttonVariants({variant:'destructive',size:'sm'})}>
                <Trash2 size={10}/>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className='text-primary'>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                    Are you sure that you want to delete this waypoint?
                    <div className="flex items-center justify-end mt-3">
                        <Button variant="destructive" className='text-xs text-white' size="sm" onClick={()=> deleteWaypoint(props.selectedWaypoint)}><Trash2 size={10}/> Delete</Button>
                    </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
            </div>
        </div>
    </Card>
  )
}

export default SelectedWaypoint