import { motion } from 'framer-motion';
import { FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useInView } from '../../hooks/useInView';
import HolographicPanel from '../ui/HolographicPanel';

export default function CentralPlaza() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.15 });

  return (
    <section ref={ref} className="section-container grid-bg" id="central-plaza">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* Left: Avatar + Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            {/* Avatar */}
            <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto md:mx-0 mb-8">
              <div
                className="w-full h-full rounded-2xl flex items-center justify-center text-6xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,240,255,0.1), rgba(168,85,247,0.1))',
                  border: '2px solid rgba(0, 240, 255, 0.2)',
                  boxShadow: '0 0 40px rgba(0, 240, 255, 0.1)',
                }}
              >
                <div
                  className="w-full h-full rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135de
                  Mission
                </span>
              </div>
              <p style={{ color: 'rgba(232, 234, 237, 0.7)' }}>
                From Mumbai to the Future — Building Technology One Project at a Time.
              </p>
            </HolographicPanel>

            <HolographicPanel>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">🚀</span>
                <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)', color: '#00f0ff' }}>
                  Current Focus
                </span>
              </div>
              <ul className="space-y-1" style={{ color: 'rgba(232, 234, 237, 0.6)', fontSize: '0.9rem' }}>
                <li>• Learning React & Modern Frontend</li>
                <li>• Exploring AI/ML with Python</li>
                <li>• Building Real-World Projects</li>
                <li>• Contributing to Open Source</li>
              </ul>
            </HolographicPanel>

            <HolographicPanel variant="purple">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">💡</span>
                <span className="text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-heading)', color: '#a855f7' }}>
                  Fun Fact
                </span>
              </div>
              <p style={{ color: 'rgba(232, 234, 237, 0.7)' }}>
                This portfolio is a futuristic city — every section is a district you can explore!
              </p>
            </HolographicPanel>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
