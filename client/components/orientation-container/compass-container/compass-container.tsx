import { Card } from '@/components/ui/card'
import React from 'react'

interface CompassContainerProps{
  angle:number
}

const CompassContainer = (props:CompassContainerProps) => {
  return (
    <Card className='flex items-center justify-center flex-col bg-blue-500/10 p-2 mt-5 h-[200px]'>
        <p className='text-sm w-full text-left'>Compass</p>
        <div className="h-[150px] relative w-[150px] flex items-center justify-center">
        <img src="/compass.png" className='w-[150px] absolute top-0 left-0 right-0 bottom-0 z-50'/>
        <img src="/rover.png" className='h-[70px] w-[70px]'/>
        </div>
    </Card>
  )
}

export default CompassContainer