Created At: 2026-06-09T15:01:06Z
Completed At: 2026-06-09T15:01:06Z
File Path: `file:///c:/Users/User/Desktop/Portfolio/src/components/scenes/EarthZoom.jsx`
Total Lines: 93
Total Bytes: 2940
Showing lines 1 to 93
The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>. Please note that any changes targeting the original code should remove the line number, colon, and leading space.

/* ===== 3D Earth with Zoom Animation ===== */
function Earth({ zoomStage, onArrived }) {
  const earthRef = useRef();
  const groupRef = useRef();
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetRotYRef = useRef(0);

  // Fallback procedural textures
  const proceduralTextures = useMemo(() => createEarthTextures(), []);

  // State for high-res photorealistic textures
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    let isMounted = true;

    // Load photorealistic NASA textures from CDN
    Promise.all([
      new Promise((resolve) => {
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          left: '50%',
          top: '50%',
          marginLeft: -100,
          marginTop: -100,
          background: `
            radial-gradient(circle at 35% 35%, #5aad
            </p>
            <p className="text-xs mt-1" style={{ color: 'rgba(232,234,237,0.35)', fontFamily: 'var(--font-mono)' }}>
              {STAGES[stage].sub}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Arrived panel */}
      <AnimatePresence>
        {stage >= STAGES.length && (
          <motion.div
            className="absolute z-10 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-sm tracking-[0.2em] uppercase mb-3" style={{ color: 'rgba(107, 138, 253, 0.6)' }}>
              Destination
            </p>
            <p className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
              Mumbai, India
            </p>
            <p className="text-sm" style={{ color: 'rgba(232,234,237,0.35)' }}>
              19.0760° N, 72.8777° E
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="absolute bottom-8 left-8 right-8 z-10">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between mb-2 text-xs" style={{ color: 'rgba(232,234,237,0.25)', fontFamily: 'var(--font-mono)' }}>
            <span>Space</span>
            <span>Mumbai</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

              style={{













































































































export default function EarthZoom({ onComplete }) {
  const [zoomStage, setZoomStage] = useState(0);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setZoomStage(1), 1500),
      setTimeout(() => setZoomStage(2), 3500),
      setTimeout(() => setZoomStage(3), 5500),
      setTimeout(() => setArrived(true), 7000),
      setTimeout(() => onComplete(), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const stageLabels = ['Deep Space', 'Earth Approach', 'South Asia', 'Mumbai'];

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ background: '#020208' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} color="#ffffff" />
        <StarField />
        <Earth zoomStage={zoomStage} />
      </Canvas>

      {/* Stage indicator � bottom left */}
      {!arrived && (
        <motion.div
          className="absolute bottom-8 left-8 z-10 poi
























































                background: 'radial-gradient(ellipse at 55% 45%, rgba(1,1,8,0) 30%, rgba(1,1,8,0.7) 70%)'
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Location beacon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
                className="mb-10"
              >
                <LocationBeacon />
              </motion.div>

              {/* Text reveal */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="text-center px-8"
              >
                <p className="text-[10px] tracking-[0.4em] uppercase text-[#6b8afd] font-semibold mb-3">
                  Location Identified
                </p>
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-3"
                  style={{ textShadow: '0 4px 30px rgba(107,138,253,0.15)' }}
                >
                  Sarthak Hundare lives here
                </h2>
                <p className="text-sm font-light text-[#e8eaed]/40 tracking-wide">
                  Mumbai, India&nbsp;&nbsp;�&nbsp;&nbsp;19.0760� N, 72.8777� E
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
