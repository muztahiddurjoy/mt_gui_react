"use client"
import React from 'react'
import FeedContainer from './feed-container'

interface CameraContainerProps{
    grid:number
    urls:string[]
    seturls:React.Dispatch<React.SetStateAction<string[]>>
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
            return 'grid-cols-5'
        case 5:
            return 'grid-cols-6'
        case 6:
            return 'grid-cols-7'
        case 7:
            return 'grid-cols-8'
        case 8:
            return 'grid-cols-9'
        case 9:
            return 'grid-cols-10'
        case 10:
            return 'grid-cols-11'
        default:
            return 'grid-cols-6'
}
}

const CameraContainer = ({
    grid,
    urls=[],
    seturls
}:CameraContainerProps) => {
    
  return (
    <div className={`grid ${generateGrid(grid)} gap-2 mt-5`}>
      {urls.map((v,i)=>(
        <FeedContainer setUrl={seturls} url={v} key={i}/>
      ))}
    </div>
  )
}

export default CameraContainer