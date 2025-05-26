import { getUVColor } from '@/functions/getUVColor'
import React from 'react'


interface UVSensorProps {
    data:number
    name:string
}

const UVSensor = (props:UVSensorProps) => {
  return (
    <div className='p-2 bg-primary/10'>
        <p>{props.name}</p>
        <p className='text-center text-4xl font-semibold' style={{color:getUVColor(Number(props.data))}}>{props.data}</p>
    </div>
  )
}

export default UVSensor