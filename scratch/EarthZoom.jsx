import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { label: 'Earth', sub: 'Planet Earth', scale: 1, duration: 800 },
  { label: 'Asia', sub: 'Approaching continent', scale: 1.8, duration: 800 },
  { label: 'India', sub: 'South Asia', scale: 3.5, duration: 800 },
  { label: 'Maharashtra', sub: '19.7°N  75.7°E', scale: 7, duration: 700 },
  { label: 'Mumbai', sub: 'City of Dreams', scale: 14, duration: 700 },
];

export default function EarthZoom({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (stage >= STAGES.length) {
      const t = setTimeout(() => onComplete(), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStage((s) => s + 1), STAGES[stage].duration);
    return () => clearTimeout(t);
  }, [stage, onComplete]);

  const current = STAGES[Math.min(stage, STAGES.length - 1)];
  const progress = (stage / STAGES.length) * 100;

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-black">
      {/* Zooming Earth sphere */}
      <motion.div
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
