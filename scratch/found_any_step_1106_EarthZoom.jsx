
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
        loader.load(
          'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
          (texture) => {
            texture.colorSpace = THREE.SRGBColorSpace;
            resolve(texture);
          },
          undefined,
          () => resolve(null)
        );
      }),
      new Promise((resolve) => {
        loader.load(
          'https://unpkg.com/three-globe/example/img/earth-night.jpg',
          (texture) => {
            resolve(texture);
          },
          undefined,
          () => resolve(null)
        );
      })
    ]).then(([diffuse, emissive]) => {
      if (!isMounted) return;
      if (diffuse && emissive) {
        se
        break;
      case 1: // Rotating to show India
        targetPos = new THREE.Vector3(0, 0.08, 4.5);
        lookTarget = new THREE.Vector3(0, 0.04, 0);
        break;
      case 2: // Approaching India
        targetPos = new THREE.Vector3(0, MUMBAI_OFFSET_Y * 0.7, 3.4);
        lookTarget = new THREE.Vector3(0, MUMBAI_OFFSET_Y * 0.6, 0);
        break;
      case 3: // Close to India — Mumbai region
        targetPos = new THREE.Vector3(0, MUMBAI_OFFSET_Y + 0.05, 2.85);
        lookTarget = new THREE.Vector3(0, MUMBAI_OFFSET_Y, 0);
        break;
      case 4: // Arrived at Mumbai
        targetPos = new THREE.Vector3(0, MUMBAI_OFFSET_Y + 0.08, 2.65);
        lookTarget = new THREE.Vector3(0, MUMBAI_OFFSET_Y + 0.04, 0);
        onArrived();
        break;
      default:
        targetPos = new THREE.Vector3(0, MUMBAI_OFFSET_Y + 0.08, 2.65);
        lookTarget = new THREE.Vector3(0, MUMBAI_OFFSET_Y + 0.04, 0);
    }

    cam.position.lerp(targetPos, 0.025);
    cameraTarget.current.lerp(lookTarget, 0.025);
    cam.lookAt(cameraTarget.current);
  });

  return (
    <group ref={groupRef}>
      {/* Earth body */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial
          map={activeTextures.diffuse}
          roughness={0.6}
          metalness={0.1}
          emissiveMap={activeTextures.emissive}
          emissive={new THREE.Color(isProcedural ? '#ffda73' : '#ffffff')}
          emissiveIntensity={isProcedural ? 0.6 : 1.2}
        />
      </mesh>

      {/* Cloud layer */}
      <CloudLayer />
