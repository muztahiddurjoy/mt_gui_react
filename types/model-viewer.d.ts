import * as THREE from "three";

declare module "three" {
  interface STLLoader extends THREE.Loader {
    load(
      url: string,
      onLoad: (geometry: THREE.BufferGeometry) => void,
      onProgress?: (event: ProgressEvent) => void,
      onError?: (event: ErrorEvent) => void,
    ): void;
    parse(data: ArrayBuffer | string): THREE.BufferGeometry;
  }
  const STLLoader: {
    new (manager?: THREE.LoadingManager): STLLoader;
  };
}

export interface ModelRotation {
  x: number; // Pitch (rotation around X-axis in radians)
  y: number; // Yaw (rotation around Y-axis in radians)
  z: number; // Roll (rotation around Z-axis in radians)
}

export interface STLViewerProps {
  stlPath?: string;
  initialRotation?: ModelRotation;
  scale?: number;
  color?: string;
  onRotationChange?: (rotation: ModelRotation) => void;
}
