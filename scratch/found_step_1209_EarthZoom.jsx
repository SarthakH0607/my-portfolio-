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
      }),
      new Promise((resolve) => {
        loader.load(
          'https://unpkg.com/three-globe/example/img/earth-clouds.png',
          (texture) => {
            resolve(texture);
          },
          undefined,
          () => resolve(null)
        );
      })
    ]).then(([diffuse, emissive, clouds]) => {
      if (!isMounted) return;
      if (diffuse && emissive) {
        setTextures({ diffuse, emissive, clouds });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Staged zoom timeline (only starts once textures load)
  useEffect(() => {
    if (!textures) return;

    const stages = [
      { delay: 1200, stage: 1 },  // Start rotating to India
      { delay: 3000, stage: 2 },  // Approach India
      { delay: 5000, stage: 3 },  // Close to Mumbai
      { delay: 7000, stage: 4 },  // Arrived
    ];

    const timers = stages.map(({ delay, stage }) =>
      setTimeout(() => setZoomStage(stage), delay)
    );

    return () => timers.forEach(clearTimeout);
  }, [textures]);

  const handleArrived = useCallback(() => {
    if (!arrived) setArrived(true);
  }, [arrived]);

  useEffect(() => {
    if (arrived) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);