"use client"
import CameraContainer from '@/components/camera-feed/camera-container'
import CameraTopbar from '@/components/camera-feed/camera-topbar'
import React, { use, useEffect, useState } from 'react'

const CameraFeedPage = () => {
  const [grid, setgrid] = useState<number>(4)
  const [urls, seturls] = useState<string[]>([])
  useEffect(() => {
    if(urls){
      localStorage.setItem('cameraUrls', JSON.stringify(urls));
    }
  }, [urls])
  useEffect(() => {
    const storedUrls = localStorage.getItem('cameraUrls');
    if (storedUrls) {
      seturls(JSON.parse(storedUrls));
    }
  }
  , [])
  useEffect(() => {
    const storedGrid = localStorage.getItem('cameraGrid');
    if (storedGrid) {
      setgrid(parseInt(storedGrid));
    }
  }, [])
  useEffect(() => {
    if(grid){
      localStorage.setItem('cameraGrid', JSON.stringify(grid));
    }
  }, [grid])
  
  
  return (
    <div className="pt-14 px-5">
    <CameraTopbar urls={urls} seturls={seturls} grid={grid} setgrid={setgrid}/>
    <CameraContainer seturls={seturls} urls={urls} grid={grid}/>
    </div>
  )
}

export default CameraFeedPage