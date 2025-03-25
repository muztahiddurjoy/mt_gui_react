import React from 'react'

interface CameraContainerProps{
    grid:number
}

const CameraContainer = (props:CameraContainerProps) => {
  return (
    <div className={`grid grid-cols-${props.grid} gap-2 mt-5`}>
      {Array(10).fill(0).map((_,i)=>(
        <div key={i} className='bg-primary p-2'>CameraFeedPage</div>
      ))}
    </div>
  )
}

export default CameraContainer