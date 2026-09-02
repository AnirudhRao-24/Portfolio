import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Icosahedron = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const { mouse, viewport } = useThree();

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Base rotation
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;

      // Mouse interactive rotation (slight tilt based on mouse position)
      const targetRotationX = (mouse.y * viewport.height) / 50;
      const targetRotationY = (mouse.x * viewport.width) / 50;
      
      meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.05;
    }
    
    if (innerRef.current) {
      innerRef.current.rotation.x -= delta * 0.2;
      innerRef.current.rotation.y -= delta * 0.3;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#00ff41" wireframe={true} transparent opacity={0.15} />
      </mesh>
      {/* Inner glowing core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="#00ff41" wireframe={true} transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

export const Scene3D = () => {
  return (
    <div className="scene-3d-wrapper absolute inset-0 z-0 pointer-events-none flex items-center justify-center mix-blend-screen opacity-50">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Icosahedron />
      </Canvas>
    </div>
  );
};
