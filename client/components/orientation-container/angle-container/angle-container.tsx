"use client"
import { getROS } from '@/ros-functions/connect'
import React, { useEffect, useState } from 'react'
import ROSLIB from 'roslib'
import { toast } from 'sonner'

export interface Angle{
  roll:number
  pitch:number
  yaw:number
}

const radianToDegree = (radian: number): number => {
  return radian * (180 / Math.PI);
}

const degreeToRadian = (degree: number): number => {
  return degree * (Math.PI / 180);
}

const AngleContainer = () => {
  const [angle, setangle] = useState<Angle>({
    pitch:0.000,
    roll:0.000,
    yaw:0.000
  })
  

  useEffect(() => {
    getROS().then((ros)=>{
      if(ros.isConnected){
      const angleTopic = new ROSLIB.Topic({
        ros:ros,
        name:'/sbg/ekf_euler',
        messageType:'sbg_driver/SbgEkfEuler'
      })
      angleTopic.subscribe((msg:any)=>{
        console.log(msg)
        setangle({
          pitch: radianToDegree(msg.angle.x),
          roll:radianToDegree(msg.angle.y),
          yaw:radianToDegree(msg.angle.z)
        })
      })
      console.log('subscribed to',angleTopic.name)
    }
    else{
      toast.error('Cannot subscribe to angle topic. ROS not connected')
    }
    })
    
  }, [])
  
  return (
    <>
    <div className='flex items-center justify-center relative'>
        <div className="h-[90%] w-[1px] bg-red-500 absolute top-2 left-[50%]">y</div>
        <div className='w-[90%] h-[1px] bg-green-500 absolute top-[50%] left-4'>x</div>
        <div className='w-[90%] h-[10px] bg-purple-500 absolute top-[50%] left-4' 
        style={{
          transform: `rotateX(${angle.pitch}deg) rotateY(${angle.roll}deg)`
        }}
        ></div>
    </div>
    <p className='text-xs ml-2'>Roll:{angle.roll} Pitch:{angle.pitch} Yaw:{angle.yaw}</p>
    </>
  )
}

export default AngleContainer