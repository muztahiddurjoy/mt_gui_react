"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import TopBar from './top-bar/top-bar'

const MainDashboard = ({children}:React.PropsWithChildren) => {
  return (
    <div className='h-[100vh]'>
     <TopBar/>
        {children}
      <div className=""></div>
    </div>
  )
}

export default MainDashboard