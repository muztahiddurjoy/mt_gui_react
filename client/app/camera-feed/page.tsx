"use client"
import CameraContainer from '@/components/camera-feed/camera-container'
import CameraTopbar from '@/components/camera-feed/camera-topbar'
import React, { useState } from 'react'

const CameraFeedPage = () => {
  const [grid, setgrid] = useState<number>(4)
  const [urls, seturls] = useState<string[]>([])
  return (
    <div className="pt-14 px-5">
    <CameraTopbar urls={urls} seturls={seturls} grid={grid} setgrid={setgrid}/>
    <CameraContainer urls={urls} grid={grid}/>
    </div>
  )
}

export default CameraFeedPage