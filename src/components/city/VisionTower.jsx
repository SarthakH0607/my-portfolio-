import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { timeline } from '../../data/timeline';

export default function VisionTower() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="section-container relative overflow-hidden" id="vision-tower">
      {/* Cloud gradient at top */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(168, 85, 247, 0.04), transparent)',
        }}
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(139, 92, 246, 0.5)' }}>
            Vision Tower
          </p>
          <h2
            className="section-title"
            style={{ color: '#8b5cf6', textShadow: '0 0 20px rgba(139, 92, 246, 0.3)' }}
          >
            Under Construction
          </h2>
          <p className="section-subtitle mx-auto">
            A tower reaching beyond the clouds — each milestone builds another floor toward the future.
          </p>
        </motion.div>

  
                        {milestone.status === 'current' ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="hidden md:block md:w-5/12" />
              </motion.div>
            ))}
          </div>

          {/* Construction crane at top */}
          <motion.div
            className="absolute -top-8 left-8 md:left-1/2 md:-translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2 }}
          >
            <div className="text-3xl" style={{ filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.4))' }}>
              🏗️
            </div>
          </motion.div>

          {/* "To the stars" extension at bottom */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            animate={hasBeenInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 }}
          >
            <div
              className="w-px h-20 mx-auto mb-4"
              style={{
                background: 'linear-gradient(to bottom, rgba(236, 72, 153, 0.3), transparent)',
              }}
            />
            <p
              className="text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: 'var(--font-heading)', color: 'rgba(236, 72, 153, 0.4)' }}
            >
              And Beyond...
            </p>
            <p className="text-xl mt-2">🚀</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
