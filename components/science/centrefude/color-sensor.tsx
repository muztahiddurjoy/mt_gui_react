import React from 'react'


interface ColorSensorProps {
    data:string
    name:string
}

const ColorSensor = (props:ColorSensorProps) => {
  const [red, green, blue] = props.data.split(',').map(Number);
  return (
    <div className='p-2 bg-primary/10'>
        <p>{props.name}</p>
        <p className='text-xs mt-1 text-right'>r:{red} g:{green} b:{blue}</p>
        <div className='h-[50px] mt-2 w-full' style={{background:`rgba(${red},${green},${blue})`}}></div>
    </div>
  )
}

export default ColorSensor