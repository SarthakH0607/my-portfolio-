import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiActivity, FiCode, FiAward, FiDownload, FiGithub, FiMail } from 'react-icons/fi';
import { skills } from '../../data/skills';
import { projects } from '../../data/projects';
import { certificates } from '../../data/certificates';

export default function ControlCenter() {
  const [isOpen, setIsOpen] = useState(false);
  
  const completedProjects = projects.filter(e => e.status === 'completed' || e.status === 'Completed').length;
  const avgSkillLevel = skills.length > 0 ? Math.round(skills.reduce((sum, sk) => sum + sk.level, 0) / skills.length) : 0;

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-[800] interactive w-12 h-12 rounded-xl flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
          color: '#00f0ff'
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <FiActivity size={22} />
      </motion.button>

      <AnimatePresence>
     
                    { label: 'GitHub', icon: <FiGithub />, href: 'https://github.com/sarthakhundare', color: '#e8c47c' },
                    { label: 'Contact', icon: <FiMail />, action: () => { setIsOpen(false); document.getElementById('contact-district')?.scrollIntoView({ behavior: 'smooth' }) }, color: '#a855f7' },
                    { label: 'Source', icon: <FiCode />, href: 'https://github.com/sarthakhundare/Portfolio', color: '#10b981' }
                  ].map(e => (
                    <button
                      key={e.label}
                      className="interactive flex items-center gap-2.5 p-3 rounded-xl text-left bg-white/[0.02] border border-white/[0.04] text-white/70 hover:bg-white/[0.04] hover:border-white/[0.07] hover:text-white transition-all cursor-pointer"
                      onClick={() => { e.action ? e.action() : (e.href !== '#' && window.open(e.href, '_blank')) }}
                    >
                      <span style={{ color: e.color }}>{e.icon}</span>
                      <span className="text-xs font-medium" style={{ fontFamily: 'var(--font-heading)' }}>{e.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-cyan-500/20 rounded-tl" />
              <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-cyan-500/20 rounded-tr" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-cyan-500/20 rounded-bl" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-cyan-500/20 rounded-br" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}