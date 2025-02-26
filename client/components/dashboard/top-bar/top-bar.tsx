"use client"
import { ModeToggle } from '@/components/mode-toggler'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAppSelector } from '@/hooks/redux-hook';
import { getROS } from '@/ros-functions/connect';
import { Hammer, Keyboard, Loader2, Milk, QrCode } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ROSLIB from 'roslib';
import { toast } from 'sonner';




const TopBar = () => {
  const [isConnected, setisConnected] = useState(false)
  const [connectingRos, setconnectingRos] = useState<boolean>(false)
  const [malette, setmalette] = useState<boolean>(false)
  const [bottle, setbottle] = useState<boolean>(false)
  const [aruco, setaruco] = useState<boolean>(false)
  const [lightStatus, setlightStatus] = useState('red')

  const connectRos = ()=>{
    setconnectingRos(true)
    getROS().then((ros)=>{
      if(ros.isConnected){
        setisConnected(true)
        const lightTopic = new ROSLIB.Topic({
          ros:ros,
          name:'/light_status',
          messageType:'std_msgs/msg/String'
        })
        lightTopic.subscribe((msg:any)=>{
          console.log('light',msg)
          const status = String(msg.data)
          if(status.toLocaleLowerCase()==='red'){
            setlightStatus('red')
          }else if(status.toLocaleLowerCase()==='green'){
            setlightStatus('green')
          }else if(status.toLocaleLowerCase()==='blue'){
            setlightStatus('blue')
           // setmalette(true)
          }
        })
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
        <div className="h-full flex items-center justify-center">
        <div className="flex h-full bg-white">
            <img src="/mt.avif" className='w-[70px]'/>
        </div>
            <div className='flex items-center gap-2 ml-3'>
            <p className="text-sm">Status</p>
            
            <div className={`h-[20px] w-[20px] rounded-full ${lightStatus=="red"?'bg-red-500':'bg-gray-500'}`}></div>
            <div className={`h-[20px] w-[20px] rounded-full ${lightStatus=="blue"?'bg-blue-500':'bg-gray-500'}`}></div>
            <div className={`h-[20px] w-[20px] rounded-full ${lightStatus=="green"?'bg-green-500 blink':'bg-gray-500'}`}></div>
          </div>
          <div className='flex items-center gap-2 ml-10'>
            <Image src="/marker/aruco.png" height={20} width={20} alt='Aruco' className={aruco?"opacity-100":"opacity-25"} /> {aruco&&<span className='text-xs'>Reached</span>}
          </div>
          <div className='flex items-center gap-2 ml-3'>
            <Hammer className={malette?"fill-orange-500 stroke-orange-500":"fill-gray-500 stroke-gray-500"}/> {malette&&<span className='text-xs'>Reached</span>}
          </div>
          <div className='flex items-center gap-2 ml-3'>
            <Milk className={bottle?"fill-green-500 stroke-green-500":"fill-gray-500 stroke-gray-500"}/> {bottle&&<span className='text-xs'>Reached</span>}
          </div>
          
        </div>
     
        <div className="flex items-center">
            <Button className='bg-white/10 hover:bg-white/30 dark:text-white' size="sm">Autonomous</Button>
        </div>
        <div className="flex items-center gap-3">
        <p className='text-xs'>ROS {isConnected ? <span className='bg-green-500 text-green-800 p-1'>Connected</span>:<span className='bg-red-300 p-1 text-red-800'>Disconnected</span>}</p>
        {!isConnected&&<Button onClick={connectRos} className='bg-white/10 hover:bg-white/30 dark:text-white' disabled={connectingRos} size="sm">{connectingRos&&<Loader2 className="animate-spin" size={10}/>}Connect</Button>}
            <ModeToggle/>
            <Dialog>
              <DialogTrigger className={buttonVariants({size:'sm'})}>
                <Keyboard/>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Keyboard Shortcuts</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default TopBar