import React from 'react'

const AngleContainer = () => {
  return (
    <div className='flex items-center justify-center relative'>
        <div className="h-[90%] w-[1px] bg-red-500 absolute top-2 left-[50%]">y</div>
        <div className='w-[90%] h-[1px] bg-green-500 absolute top-[50%] left-4'>x</div>
        <div className='w-[90%] h-[1px] bg-purple-500 rotate-12 absolute top-[50%] left-4'></div>
    </div>
  )
}

export default AngleContainer