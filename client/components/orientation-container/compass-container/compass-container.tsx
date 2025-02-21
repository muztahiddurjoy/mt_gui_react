import { Card } from '@/components/ui/card'
import React from 'react'

const CompassContainer = () => {
  return (
    <Card className='flex items-center justify-center flex-col p-2'>
        <p className='text-sm w-full text-left'>Compass</p>
        <img src="/compass.png" className='h-full'/>
    </Card>
  )
}

export default CompassContainer