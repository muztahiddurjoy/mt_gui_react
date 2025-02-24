import { Card } from '@/components/ui/card'
import React from 'react'

interface CompassContainerProps{
  angle:number
}

const CompassContainer = (props:CompassContainerProps) => {
  return (
    <Card className='flex items-center justify-center flex-col  p-2'>
        <p className='text-sm w-full text-left'>Compass</p>
        <div className="h-[200px] relative w-[200px] flex items-center justify-center">
        <img src="/compass.png" className='w-[200px] absolute top-0 left-0 right-0 bottom-0 z-50'/>
        <img src="/rover.png" className='h-[130px] w-[130px]'/>
        </div>
    </Card>
  )
}

export default CompassContainer