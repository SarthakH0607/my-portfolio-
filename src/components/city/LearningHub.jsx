import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';
import { learning } from '../../data/timeline';
import GlassCard from '../ui/GlassCard';

export default function LearningHub() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="section-container grid-bg" id="learning-hub">
      <div className="content-wrapper">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3 text-white/40" style={{ fontFamily: 'var(--font-heading)' }}>
            Learning Hub
          </p>
          <h2 className="section-title">Digital Library</h2>
          <p className="section-subtitle mx-auto">
            A structured path of courses, current technical focuses, reading materials, and technology roadmaps.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 w-full">
          {/* Completed Courses */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 h-full cursor-none" hoverTilt={false}>
              <div className="flex items-cen
                  </motion.span>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Books */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="md:col-span-1"
          >
            <GlassCard className="p-6 h-full cursor-none" hoverTilt={false} style={{ borderColor: 'rgba(232, 196, 124, 0.15)' }}>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="text-lg">📚</span>
                <h3 className="text-xs font-semibold tracking-wider uppercase text-[#e8c47c]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Reading Shelf
                </h3>
              </div>
              <div className="space-y-3">
                {learning.books.map((book) => (
                  <div
                    key={book.title}
                    className="flex items-center gap-3.5 p-3 rounded-lg bg-white/[0.01] border border-white/[0.03]"
                  >
                    <span className="text-xl filter drop-shadow-[0_0_4px_rgba(255,255,255,0.1)]">{book.icon}</span>
                    <div>
                      <p className="text-xs font-semibold text-white/80">
                        {book.title}
                      </p>
                      <p className="text-[10px] text-white/45">
                        {book.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
