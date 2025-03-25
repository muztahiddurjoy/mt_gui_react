import React from 'react'
import FeedContainer from './feed-container'

interface CameraContainerProps{
    grid:number
}

const generateGrid = (grid:number) => {
    const temp = grid-1
    switch(temp){
        case 0:
            return 'grid-cols-1'
        case 1:
            return 'grid-cols-2'
        case 2:
            return 'grid-cols-3'
        case 3:
            return 'grid-cols-4'
        case 4:
            return 'grid-cols-6'
        case 5:
            return 'grid-cols-12'
        case 6:
            return 'grid-cols-24'
        case 7:
            return 'grid-cols-48'
        case 8:
            return 'grid-cols-96'
        case 9:
            return 'grid-cols-192'
        case 10:
            return 'grid-cols-384'
        default:
            return 'grid-cols-6'
}
}

const CameraContainer = (props:CameraContainerProps) => {
    
  return (
    <div className={`grid ${generateGrid(props.grid)} gap-2 mt-5`}>
      {Array(10).fill(0).map((_,i)=>(
        <FeedContainer key={i}/>
      ))}
    </div>
  )
}

export default CameraContainer