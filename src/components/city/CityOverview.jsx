import { motion } from 'framer-motion';
import { useInView } from '../../hooks/useInView';

const DISTRICTS = [
  { id: 'central-plaza', name: 'Central Plaza', icon: '🏛️', desc: 'About Me', color: '#00f0ff' },
  { id: 'skills-tower', name: 'Skills Tower', icon: '🏗️', desc: 'My Skills', color: '#a855f7' },
  { id: 'project-district', name: 'Project District', icon: '🏭', desc: 'My Projects', color: '#00b4ff' },
  { id: 'certificate-museum', name: 'Certificate Museum', icon: '🏛️', desc: 'Certificates', color: '#ec4899' },
  { id: 'github-powerplant', name: 'GitHub Power Plant', icon: '⚡', desc: 'GitHub Stats', color: '#10b981' },
  { id: 'learning-hub', name: 'Learning Hub', icon: '📚', desc: 'Learning Journey', color: '#f59e0b' },
  { id: 'vision-tower', name: 'Vision Tower', icon: '🔭', desc: 'Future Goals', color: '#8b5cf6' },
  { id: 'contact-district', name: 'Contact District', icon: '📡', desc: 'Get In Touch', color: '#06b6d4' },
];

export default function CityOverview() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.2 });

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={ref}
      className="section-container flex flex-col items-center justify-center dots-bg"
      id="city-overview"
    >
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
 
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            whileHover={{ scale: 1.05, borderColor: district.color }}
          >
            <div className="text-3xl mb-3">{district.icon}</div>
            <p
              className="text-xs font-bold tracking-wider uppercase mb-1"
              style={{ fontFamily: 'var(--font-heading)', color: district.color }}
            >
              {district.name}
            </p>
            <p className="text-xs" style={{ color: 'rgba(232, 234, 237, 0.4)' }}>
              {district.desc}
            </p>
            {/* Bottom accent line */}
            <motion.div
              className="mt-3 mx-auto h-0.5 rounded-full"
              style={{ background: district.color }}
              initial={{ width: 0 }}
              whileHover={{ width: '60%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="mt-12"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs tracking-widest uppercase mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(0, 240, 255, 0.3)' }}>
          Scroll to Explore
        </p>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(0, 240, 255, 0.3)"
          strokeWidth="2"
          className="mx-auto"
        >
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
