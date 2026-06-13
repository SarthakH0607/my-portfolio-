import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { skills } from '../../data/skills';
import GlassCard from '../ui/GlassCard';

export default function SkillsTower() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });
  const [selectedFloor, setSelectedFloor] = useState(null);

  const sortedSkills = [...skills].sort((a, b) => a.floor - b.floor);

  // Remap colors for a premium aesthetic
  const premiumColorMap = {
    '#3776AB': '#e8c47c', // Python -> gold
    '#ED8B00': '#6b8afd', // Java -> indigo
    '#E34F26': '#e8c47c', // HTML -> gold
    '#1572B6': '#6b8afd', // CSS -> indigo
    '#F7DF1E': '#e8c47c', // JS -> gold
    '#F05032': '#6b8afd', // Git -> indigo
    '#181717': '#e8c47c', // GitHub -> gold
    '#007ACC': '#6b8afd', // VSCode -> indigo
    '#306998': '#e8c47c', // Python -> gold
  };

  return (
    <section ref={ref} className="section-container" id="skills-tower">
      <div className="content-wrapper">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3 text-white/40" style={{ fontFamily: 'var(--font-heading)' }}>
            Skills Tower
          </p>
          <h2
                              }}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.6 }}
                            />
                          </div>
                          <div className="flex justify-between mt-2 text-[10px]" style={{ fontFamily: 'var(--font-mono)' }}>
                            <span className="text-white/30">Beginner</span>
                            <span style={{ color: activeColor }}>{skill.level}%</span>
                            <span className="text-white/30">Expert</span>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  className="glass-card p-10 text-center cursor-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-4xl mb-4 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.05)]">🏗️</p>
                  <p className="text-xs tracking-wide uppercase font-semibold text-white/35 mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    Overview Panel
                  </p>
                  <p className="text-[11px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Click a tower floor to inspect skill metadata
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
