"use client";
import STLViewer from "@/components/rover-model/model-viewer";
import React from "react";

const Page = () => {
  // Example of programmatic rotation control
  const handleRotationChange = (rotation: ModelRotation) => {
    console.log("Current rotation:", {
      pitch: THREE.MathUtils.radToDeg(rotation.x),
      yaw: THREE.MathUtils.radToDeg(rotation.y),
      roll: THREE.MathUtils.radToDeg(rotation.z),
    });
  };

  return (
    <main style={{ height: "100vh" }}>
      <h1 style={{ textAlign: "center", padding: "20px" }}>STL Model Viewer</h1>
      <STLViewer
        stlPath="/models/mt10.stl"
        initialRotation={{ x: 0.2, y: 0.5, z: 0 }} // Slight initial rotation
        scale={0.5}
        color="#4287f5"
        onRotationChange={handleRotationChange}
      />
    </main>
  );
};

export default Page;
