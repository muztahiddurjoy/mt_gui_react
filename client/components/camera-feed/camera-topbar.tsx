"use client"
import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Minus, Plus } from 'lucide-react'

interface CameraTopbarProps {
    grid:number
    setgrid:React.Dispatch<React.SetStateAction<number>>
}


const CameraTopbar = (props:CameraTopbarProps) => {
    const [address, setaddress] = useState<string>('')
  return (
    <div className='bg-primary/20 p-2 flex items-center justify-between'>
        <form className="flex items-center gap-2">
            <Input value={address} name='address' onChange={e=> setaddress(e.target.value)} placeholder='Address' className='border-primary' />
            <Button disabled={!address} size="sm" type='submit'>Add</Button>
        </form>
        <div className="flex items-center gap-2">
            <Button size="sm" onClick={()=>props.setgrid((prev)=> prev!=0?prev-1:prev)}>
                <Minus/>
            </Button>
            {props.grid}
            <Button size="sm" onClick={()=>props.setgrid((prev)=> prev+1)}>
                <Plus/>
            </Button>
        </div>
    </div>
  )
}

export default CameraTopbar