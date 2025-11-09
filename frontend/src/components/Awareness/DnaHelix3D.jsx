import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

const DnaHelixMesh = () => {
  const groupRef = useRef(null);
  const primaryColor = "#1e429f";
  const accentColor = "#10b981";

  // Auto-rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  // Create helix points
  const createHelixPoints = (offset, radius) => {
    const points = [];
    const segments = 80;
    for (let i = 0; i <= segments; i++) {
      const t = (i / segments) * Math.PI * 4;
      const x = Math.cos(t + offset) * radius;
      const z = Math.sin(t + offset) * radius;
      const y = (i / segments) * 8 - 4;
      points.push(new THREE.Vector3(x, y, z));
    }
    return points;
  };

  const leftPoints = createHelixPoints(0, 1.2);
  const rightPoints = createHelixPoints(Math.PI, 1.2);

  // Create base pairs
  const basePairs = [];
  const pairCount = 10;
  for (let i = 0; i < pairCount; i++) {
    const index = Math.floor((i / pairCount) * leftPoints.length);
    basePairs.push({
      start: leftPoints[index],
      end: rightPoints[index],
      color: i % 2 === 0 ? accentColor : primaryColor,
    });
  }

  return (
    <group ref={groupRef}>
      {/* Left helix strand */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(leftPoints), 80, 0.12, 8, false]} />
        <meshStandardMaterial color={primaryColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Right helix strand */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(rightPoints), 80, 0.12, 8, false]} />
        <meshStandardMaterial color={primaryColor} metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Base pairs */}
      {basePairs.map((pair, i) => (
        <group key={i}>
          {/* Connecting bar */}
          <mesh position={[(pair.start.x + pair.end.x) / 2, pair.start.y, (pair.start.z + pair.end.z) / 2]}>
            <cylinderGeometry args={[0.08, 0.08, pair.start.distanceTo(pair.end), 8]} />
            <meshStandardMaterial color={pair.color} metalness={0.2} roughness={0.5} />
          </mesh>
          
          {/* Connection spheres */}
          <mesh position={[pair.start.x, pair.start.y, pair.start.z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={pair.color} metalness={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[pair.end.x, pair.end.y, pair.end.z]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={pair.color} metalness={0.2} roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
      
      {/* Directional lights */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color={accentColor} />
    </group>
  );
};

const DnaHelix3D = ({ className = "", prefersReducedMotion = false }) => {
  return (
    <div className={className} style={{ width: "100%", height: "100%", background: "transparent" }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          enableRotate={!prefersReducedMotion}
          autoRotate={!prefersReducedMotion}
          autoRotateSpeed={0.5}
        />
        <color attach="background" args={["transparent"]} />
        <DnaHelixMesh />
      </Canvas>
    </div>
  );
};

export default DnaHelix3D;

