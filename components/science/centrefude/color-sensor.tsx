import React from 'react'


interface ColorSensorProps {
    red: number;
    green: number;
    blue: number;
    name:string
}

const ColorSensor = (props:ColorSensorProps) => {
  return (
    <div className='p-2 bg-primary/10'>
        <p>{props.name}</p>
        <p className='text-xs mt-1 text-right'>r:{props.red} g:{props.green} b:{props.blue}</p>
        <div className='h-[50px] mt-2 w-full' style={{background:`rgba(${props.red},${props.green},${props.blue})`}}></div>
    </div>
  )
}

export default ColorSensor