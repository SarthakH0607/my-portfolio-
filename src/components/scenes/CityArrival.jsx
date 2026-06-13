import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const BUILDINGS = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  width: 30 + Math.random() * 50,
  height: 100 + Math.random() * 250,
  left: i * 5 + Math.random() * 3,
  delay: Math.random() * 1.5,
  color: [
    'rgba(0, 180, 255, 0.15)',
    'rgba(168, 85, 247, 0.12)',
    'rgba(0, 240, 255, 0.1)',
    'rgba(13, 27, 62, 0.6)',
  ][Math.floor(Math.random() * 4)],
  windows: Math.floor(3 + Math.random() * 6),
}));

const DRONES = [
  { id: 1, startX: -5, endX: 105, y: 20, duration: 12 },
  { id: 2, startX: 105, endX: -5, y: 35, duration: 15 },
  { id: 3, startX: -5, endX: 105, y: 15, duration: 10 },
];

export default function CityArrival({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0: dark, 1: buildings rise, 2: lights on, 3: title

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3000),
      setTimeout(() => onComplete(), 5000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-end justify-center">
      {/* Sky gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: phase >= 2
            ? 'linear-gradient(180de
              fontFamily: 'var(--font-heading)',
              color: 'rgba(0, 240, 255, 0.6)',
            }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome To
          </motion.p>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-8xl font-black text-center mb-4"
            style={{
              fontFamily: 'var(--font-heading)',
              background: 'linear-gradient(135deg, #00f0ff, #fff, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.3))',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
          >
            SARTHAK CITY
          </motion.h1>

          <motion.p
            className="text-xs tracking-[0.3em] uppercase"
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'rgba(168, 85, 247, 0.6)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Powered by sarthakhundare.syntacsyndicate.co.in
          </motion.p>
        </motion.div>
      )}

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--color-space-deep))' }}
      />
    </section>
  );
}
