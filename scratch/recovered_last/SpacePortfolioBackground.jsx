  ], []);

  return (
    <>
      <color attach="background" args={['#010103']} />
      <ambientLight intensity={0.15} />
      
      {/* Multi-layer starfield for depth */}
      <Stars count={15000} color="#ffffff" size={0.035} spread={200} opacity={0.5} speed={0.001} />
      <Stars count={8000} color="#ffdca8" size={0.03} spread={250} opacity={0.3} speed={-0.0008} />
      <Stars count={5000} color="#c2d9ff" size={0.025} spread={180} opacity={0.35} speed={0.0005} />
      
      <MiniSun />
      
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
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        style={{ background: '#010103' }}
      >
        <SolarSystemScene />
      </Canvas>
      
      {/* Subtle overlay to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(1,1,3,0.3) 0%, rgba(1,1,3,0.6) 60%, rgba(1,1,3,0.75) 100%)',
          pointerEvents: 'none'