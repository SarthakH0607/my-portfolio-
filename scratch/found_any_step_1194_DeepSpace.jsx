    </div>
  );
}

export default function SpaceOpening({ onComplete }) {
  const [activePlanetIdx, setActivePlanetIdx] = useState(0);
  const { stats: githubStats, loading: githubLoading } = useGitHubStats('sarthakhundare');
  const [realEarthTexture, setRealEarthTexture] = useState(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    loader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        setRealEarthTexture(texture);
      }
    );
  }, []);

  // Procedural Textures Memo
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');