import { useRef, useEffect } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const glowRef = useRef(null);
  const trailRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const smoothPos = useRef({ x: -100, y: -100 });
  const trailPoints = useRef([]);

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return;

    const dot = dotRef.current;
    const glow = glowRef.current;
    const canvas = trailRef.current;
    if (!dot || !glow || !canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      trailPoints.current.push({ x: e.clientX, y: e.clientY, alpha: 0.4 });
      if (trailPoints.current.length > 20) trailPoints.current.shift();
    };

    let raf;
    const animate = () => {
      // Smooth follow
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.15;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.15;

      dot.style.transform = `translate(${pos.current.x - 4}px, ${pos.current.y - 4}px)`;
      glow.style.transform = `translate(${smoothPos.current.x - 16}px, ${smoothPos.current.y - 16}px)

      // Draw trail
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < trailPoints.current.length; i++) {
        const p = trailPoints.current[i];
        p.alpha -= 0.015;
        if (p.alpha <= 0) { trailPoints.current.splice(i, 1); i--; continue; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(107, 138, 253, ${p.alpha * 0.5})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (typeof window !== 'undefined' && 'ontouchstart' in window) return null;

  return (
    <>
      <canvas
        ref={trailRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
      />
      {/* Soft glow */}
      <div
        ref={glowRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        style={{
          width: 32,
          height: 32,
          background: 'radial-gradient(circle, rgba(107, 138, 253, 0.15), transparent 70%)',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full"
        style={{
          width: 8,
          height: 8,
          background: 'rgba(107, 138, 253, 0.7)',
          boxShadow: '0 0 12px rgba(107, 138, 253, 0.4)',
        }}
      />
    </>
  );
}
