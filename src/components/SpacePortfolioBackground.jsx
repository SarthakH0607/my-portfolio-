import { memo, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { SpiralGalaxy, NebulaClouds, RealisticSun, GlowingStars } from './CosmicBackgroundComponents';



/* ===== Dense Starfield Layer ===== */
function Stars({ count = 12000, color = '#ffffff', size = 0.04, spread = 200, opacity = 0.5, speed = 0.002 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * spread;
      p[i * 3 + 1] = (Math.random() - 0.5) * spread;
      p[i * 3 + 2] = (Math.random() - 0.5) * spread;
    }
    return p;
  }, [count, spread]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * speed;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={color} size={size} sizeAttenuation depthWrite={false} opacity={opacity} />
    </Points>
  );
}


/* ===== Orbiting Planet ===== */
function OrbitPlanet({ size, speed, dist, color, hasRings, tilt = 0 }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed * 0.15;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * dist;
      ref.current.pos
<truncated 3024 bytes>
}
        coreColor="#fff"
        armColor="#a7f3d0"
        outerColor="#2563eb"
        size={0.045}
      />

      <NebulaClouds 
        count={9} 
        range={75} 
        colors={['#ec4899', '#a855f7', '#6366f1', '#db2777', '#4f46e5']}
      />

      {/* Multi-layer starfield for depth with glowing twinkling stars */}
      <Stars count={10000} color="#ffffff" size={0.035} spread={200} opacity={0.5} speed={0.001} />
      <Stars count={5000} color="#ffdca8" size={0.03} spread={250} opacity={0.3} speed={-0.0008} />
      <Stars count={3000} color="#c2d9ff" size={0.025} spread={180} opacity={0.35} speed={0.0005} />
      <GlowingStars />
      
      <RealisticSun size={0.8} />
      
      {planets.map((p, i) => (
        <OrbitPlanet key={i} {...p} />
      ))}

      <SlowCamera />
    </>
  );
}

/* ===== Exported Component ===== */
function SpacePortfolioBackground() {
  return (
    <div
      className="fixed inset-0 z-0"
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 8, 18], fov: 50 }}
        dpr={[1, 1.2]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SolarSystemScene />
      </Canvas>
      
      {/* Subtle overlay to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(1,1,3,0.3) 0%, rgba(1,1,3,0.6) 60%, rgba(1,1,3,0.75) 100%)',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default memo(SpacePortfolioBackground);
