import React from 'react'


interface HeaterIndicatorProps {
    data:boolean
    name:string
}

const HeaterIndicator = (props:HeaterIndicatorProps) => {
  
  return (
    <div className='p-2 bg-primary/10'>
        <p>{props.name}</p>
        <div className="w-full p-3 flex items-center justify-center" style={{backgroundColor:props.data?"green":"red"}}>{props.data?"ON":"OFF"}</div>
    </div>
  )
}

export default HeaterIndicator