import { Button } from '@/components/ui/button'
import React from 'react'

const TopBar = () => {
  return (
    <div className='fixed top-0 left-0 right-0 h-[7vh] bg-primary flex items-center justify-between z-50'>
        <div className="bg-white h-full px-3 flex items-center justify-center">Hypersonic</div>
        <div className="flex items-center">
            <Button className='bg-white/10 hover:bg-white/30' size="sm">Autonomous</Button>
        </div>
        <div className="flex"></div>
    </div>
  )
}

export default TopBar