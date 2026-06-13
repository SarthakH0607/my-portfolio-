import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCompass, FiGitBranch } from 'react-icons/fi';
import { NebulaClouds, RealisticSun, GlowingStars } from '../CosmicBackgroundComponents';
import { projects } from '../../data/projects';
import { certificates } from '../../data/certificates';
import { useGitHubStats } from '../../hooks/useGitHubStats';

/* ===== 18,000 Twinkling Starfields ===== */
function Stars({ count = 8000 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 160;
      p[i * 3 + 1] = (Math.random() - 0.5) * 160;
      p[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    return p;
  }, [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.0015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial transparent color="#ffffff" size={0.05} sizeAttenuation depthWrite={false} opacity={0.65} />
    </Points>
  );
}

function WarmStars({ count = 4000 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(co
                <FiCpu className="text-[#6b8afd] mt-0.5 shrink-0" size={12} />
                <div className="flex flex-col">
                  <span className="text-[8px] text-[#e8c47c]/65 uppercase tracking-wider font-bold">LEARNING TELEMETRY</span>
                  <span className="text-white/80 text-[10px] leading-tight">Advanced AI/ML & Web Architectures</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <FiGitBranch className="text-[#6b8afd] mt-0.5 shrink-0" size={12} />
                <div className="flex flex-col">
                  <span className="text-[8px] text-[#e8c47c]/65 uppercase tracking-wider font-bold">CURRENT MISSION</span>
                  <span className="text-white/80 text-[10px] leading-tight">Online College Voting System & Cinematic Space Port</span>
                </div>
              </div>
            </div>

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-white/10 rounded-tl" />
            <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-white/10 rounded-tr" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-white/10 rounded-bl" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-white/10 rounded-br" />
          </motion.div>
        </div>
      </div>

      {/* Subtle light ray from right */}
      <div
        className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-5"
        style={{
          background: 'radial-gradient(ellipse at 100% 30%, rgba(240, 216, 154, 0.02), transparent 60%)'
        }}
      />
    </section>
  );
}