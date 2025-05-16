"use client";

import { useRef, useEffect, Suspense, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three-stl-loader";
import { ModelRotation, STLViewerProps } from "@/types/model-viewer";
import { Canvas } from "@react-three/fiber";

// Extend Three.js with the STLLoader
THREE.STLLoader = STLLoader;

interface STLModelProps {
  stlPath: string;
  rotation: ModelRotation;
  scale: number;
  color: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

function STLModel({
  stlPath,
  rotation,
  scale,
  color,
  onLoad,
  onError,
}: STLModelProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  try {
    const geometry = useLoader(
      THREE.STLLoader,
      stlPath,
    ) as THREE.BufferGeometry;

    useEffect(() => {
      try {
        geometry.computeVertexNormals();
        geometry.center();
        geometry.scale(scale, scale, scale);
        onLoad?.();
      } catch (err) {
        onError?.(err as Error);
      }
    }, [geometry, scale, onLoad, onError]);

    useFrame(() => {
      if (meshRef.current) {
        meshRef.current.rotation.set(rotation.x, rotation.y, rotation.z);
      }
    });

    return (
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color={color} />
      </mesh>
    );
  } catch (error) {
    useEffect(() => {
      onError?.(error as Error);
    }, []);
    return null;
  }
}

export default function STLViewer({
  stlPath = "/models/mt10.stl",
  initialRotation = { x: 0, y: 0, z: 0 },
  scale = 1,
  color = "lightgray",
  onRotationChange,
}: STLViewerProps) {
  const [rotation, setRotation] = useState<ModelRotation>(initialRotation);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleRotationChange = (axis: keyof ModelRotation, value: number) => {
    const newRotation = {
      ...rotation,
      [axis]: THREE.MathUtils.degToRad(value),
    };
    setRotation(newRotation);
    onRotationChange?.(newRotation);
  };

  if (error) {
    return (
      <div className="error-message">Error loading model: {error.message}</div>
    );
  }

  return (
    <div className="model-viewer-container">
      <div className="canvas-container">
        {isLoading && <div className="loading-indicator">Loading model...</div>}
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <STLModel
              stlPath={stlPath}
              rotation={rotation}
              scale={scale}
              color={color}
              onLoad={() => setIsLoading(false)}
              onError={setError}
            />
          </Suspense>
          <OrbitControls makeDefault />
        </Canvas>
      </div>

      <div className="controls-panel">
        <h3>Orientation Controls</h3>
        <OrientationControl
          label="Pitch (X-axis)"
          axis="x"
          value={THREE.MathUtils.radToDeg(rotation.x)}
          onChange={handleRotationChange}
        />
        <OrientationControl
          label="Yaw (Y-axis)"
          axis="y"
          value={THREE.MathUtils.radToDeg(rotation.y)}
          onChange={handleRotationChange}
        />
        <OrientationControl
          label="Roll (Z-axis)"
          axis="z"
          value={THREE.MathUtils.radToDeg(rotation.z)}
          onChange={handleRotationChange}
        />
      </div>
    </div>
  );
}

interface OrientationControlProps {
  label: string;
  axis: keyof ModelRotation;
  value: number;
  onChange: (axis: keyof ModelRotation, value: number) => void;
}

function OrientationControl({
  label,
  axis,
  value,
  onChange,
}: OrientationControlProps) {
  return (
    <div className="control-group">
      <label>
        {label}
        <input
          type="range"
          min="-180"
          max="180"
          value={value}
          onChange={(e) => onChange(axis, parseFloat(e.target.value))}
          className="rotation-slider"
        />
        {value.toFixed(1)}°
      </label>
    </div>
  );
}
