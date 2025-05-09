import { Card } from '@/components/ui/card'
import { getROS } from '@/ros-functions/connect'
import { topics } from '@/topics'
import React, { useEffect, useState } from 'react'
import ROSLIB from 'roslib'

const CompassContainer = () => {
  const [angle, setangle] = useState<number>(0)

  useEffect(() => {
    getROS().then((ros) => {
      const sub = new ROSLIB.Topic({
        ros: ros,
        name: topics['yaw'].name,
        messageType: topics['yaw'].messageType,
      })
      sub.subscribe((message: any) => {
        setangle(message.data)
      })
    })
  }, [])

  return (
    <Card className='flex items-center justify-center flex-col bg-blue-500/10 p-2 mt-5 h-[200px]'>
      <p className='text-sm w-full text-left'>Angle: {angle}°</p>
      <div className="h-[170px] relative w-[170px] flex items-center justify-center">
        <img src="/compass.png" className='w-[170px] absolute top-0 left-0 right-0 bottom-0 z-50' />
        <img
          src="/rover/up_view.png"
          className='h-[100px] w-[100px]'
          style={{ transform: `rotate(${angle}deg)` }}
        />
      </div>
    </Card>
  )
}

export default CompassContainer
