import { ModeToggle } from '@/components/mode-toggler'
import { Button } from '@/components/ui/button'
import React from 'react'

const TopBar = () => {
  return (
    <div className='fixed top-0 left-0 right-0 h-[7vh] bg-primary flex items-center justify-between z-50'>
        <div className="bg-white h-full px-3 flex items-center justify-center">
            <img src="/mt.avif" className='w-[50px] h-auto'/>
        </div>
        <div className="flex items-center">
            <Button className='bg-white/10 hover:bg-white/30 dark:text-white' size="sm">Autonomous</Button>
        </div>
        <div className="flex">
            <ModeToggle/>
        </div>
    </div>
  )
}

export default TopBar