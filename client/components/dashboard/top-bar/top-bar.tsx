"use client"
import { ModeToggle } from '@/components/mode-toggler'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/hooks/redux-hook';
import { getROS } from '@/ros-functions/connect';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ROSLIB from 'roslib';
import { toast } from 'sonner';




const TopBar = () => {
  const [isConnected, setisConnected] = useState(false)
  const [connectingRos, setconnectingRos] = useState<boolean>(false)

  const connectRos = ()=>{
    setconnectingRos(true)
    getROS().then((ros)=>{
      if(ros.isConnected){
        setisConnected(true)
      }
      
      ros.on('error',(error)=>{
        console.log('Error connecting to ROS:', error);
        toast.error('Error connecting to ROS. Check console')
        setisConnected(false)
      })
      ros.on('close',()=>{
        setisConnected(false)
      })
    }).finally(()=>{
      setconnectingRos(false)
    })
  }


  useEffect(() => {
    connectRos()
  }, [])
  
  
  return (
    <div className='fixed top-0 left-0 right-0 h-[7vh] bg-primary/50 flex items-center justify-between z-50'>
        <div className=" h-full px-3 flex items-center justify-center">
            <img src="/mt.avif" className='w-[50px] h-auto'/>
            <div className='flex items-center gap-2 ml-3'>
            <p className="text-sm">Status</p>
            
            <div className='h-[20px] w-[20px] rounded-full bg-green-500'></div>
            <div className='h-[20px] w-[20px] rounded-full bg-red-500'></div>
            <div className='h-[20px] w-[20px] rounded-full bg-blue-500'></div>
        </div>
        </div>
     
        <div className="flex items-center">
            <Button className='bg-white/10 hover:bg-white/30 dark:text-white' size="sm">Autonomous</Button>
        </div>
        <div className="flex items-center gap-3">
        <p className='text-xs'>ROS {isConnected ? <span className='bg-green-500 text-green-800 p-1'>Connected</span>:<span className='bg-red-300 p-1 text-red-800'>Disconnected</span>}</p>
        {!isConnected&&<Button onClick={connectRos} className='bg-white/10 hover:bg-white/30 dark:text-white' disabled={connectingRos} size="sm">{connectingRos&&<Loader2 className="animate-spin" size={10}/>}Connect</Button>}
            <ModeToggle/>
        </div>
    </div>
  )
}

export default TopBar