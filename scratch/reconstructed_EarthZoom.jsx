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
/* ===== Earth Globe ===== */
function EarthGlobe({ scale = 3 }) {
  const ref = useRef();
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    // Ocean
    ctx.fillStyle = '#0b3d6e';
    ctx.fillRect(0, 0, 512, 256);
    // Rough landmasses
    ctx.fillStyle = '#1a7a3a';
    const landShapes = [


















































































































              {PHASES[phase].text}
            </h2>
            <p className="text-white/40 text-sm font-mono">{PHASES[phase].sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* HUD elements */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="text-[9px] text-[#00f0ff]/40 font-mono space-y-1">
          <div>ALT: {phase === 0 ? '400km' : phase === 1 ? '120km' : '0.5km'}</div>
          <div>SPD: {phase === 0 ? '7.8km/s' : phase === 1 ? '3.2km/s' : '0.0km/s'}</div>
          <div>LAT: 19.0760°N</div>
          <div>LNG: 72.8777°E</div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-10 pointer-events-none">
        <div className="text-[9px] text-[#00f0ff]/40 font-mono">
          STATUS: {phase === 2 ? 'LANDED' : 'DESCENDING'}
        </div>
      </div>

      {/* Arrive Button (phase 2) */}
      {phase === 2 && (
        <div className="absolute bottom-12 inset-x-0 z-20 flex justify-center">
          <motion.button
            onClick={onArrived}
            className="px-8 py-3 rounded-lg font-semibold text-sm tracking-wider uppercase cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(107,138,253,0.15))',
              border: '1px solid rgba(0,240,255,0.3)',
              color: '#00f0ff',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
          >
            Know About Me →
          </motion.button>
        </div>
      )}
    </section>
  );
}
