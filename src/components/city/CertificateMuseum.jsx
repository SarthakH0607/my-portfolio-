import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { useInView } from '../../hooks/useInView';
import { certificates } from '../../data/certificates';

export default function CertificateMuseum() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <section ref={ref} className="section-container" id="certificate-museum">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(236, 72, 153, 0.5)' }}>
            Certificate Museum
          </p>
          <h2
            className="section-title"
            style={{
              color: '#ec4899',
              textShadow: '0 0 20px rgba(236, 72, 153, 0.4)',
            }}
                    className="text-xs"
                    style={{ color: 'rgba(232,234,237,0.4)', fontFamily: 'var(--font-mono)' }}
                  >
                    {cert.date}
                  </span>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        background: `${cert.color}08`,
                        border: `1px solid ${cert.color}15`,
                        color: 'rgba(232,234,237,0.5)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Verify link */}
                <a
                  href={cert.verifyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive inline-flex items-center gap-1 text-xs"
                  style={{ color: `${cert.color}88` }}
                >
                  <FiExternalLink size={12} /> Verify
                </a>

                {/* Top edge glow */}
                <div
                  className="absolute top-0 left-4 right-4 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${cert.color}33, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
