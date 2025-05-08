'use client'

import { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function GLBModel({ glbPath, rotation }: { glbPath: string; rotation: { x: number; y: number; z: number } }) {
  const groupRef = useRef<any>(null)
  const gltf = useLoader(GLTFLoader, glbPath)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.set(rotation.x, rotation.y, rotation.z)
    }
  })

  return (
    <primitive 
      ref={groupRef} 
      object={gltf.scene}
      position={[-10, -10, -10]} // Center the model 
      scale={[0.01, 0.01, 0.01]} // Scale down the model
    />
  )
}

export default function GLBViewer({ glbPath = '/models/mt10.glb' }) {
  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
    z: 0
  })

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setRotation(prev => ({
      ...prev,
      [axis]: THREE.MathUtils.degToRad(value)
    }))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <Canvas camera={{ position: [0, 0, 0], fov: 75 }}> {/* Adjusted camera position */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <GLBModel glbPath={glbPath} rotation={rotation} />
          <OrbitControls makeDefault maxDistance={20} minDistance={1} /> {/* Adjusted minDistance */}
        </Canvas>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h3>Orientation Controls</h3>
        {['x', 'y', 'z'].map(axis => (
          <div key={axis}>
            <label>
              {axis.toUpperCase()}:
              <input
                type="range"
                min="-180"
                max="180"
                value={THREE.MathUtils.radToDeg(rotation[axis as 'x' | 'y' | 'z'])}
                onChange={e => handleRotationChange(axis as 'x' | 'y' | 'z', Number(e.target.value))}
              />
              {THREE.MathUtils.radToDeg(rotation[axis as 'x' | 'y' | 'z']).toFixed(1)}°
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}