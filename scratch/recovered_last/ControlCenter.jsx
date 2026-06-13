import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCode, FiAward, FiGitBranch, FiBookOpen, FiDownload, FiMail } from 'react-icons/fi';
import { skills } from '../../data/skills';
import { projects } from '../../data/projects';
import { certificates } from '../../data/certificates';

export default function ControlCenter() {
  const [isOpen, setIsOpen] = useState(false);

  const completedProjects = projects.filter((p) => p.status === 'completed').length;
  const avgSkillLevel = Math.round(skills.reduce((s, sk) => s + sk.level, 0) / skills.length);

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        className="fixed bottom-6 right-6 z-[800] interactive w-12 h-12 rounded-xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(0,240,255,0.15), rgba(168,85,247,0.15))',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
          color: '#00f0ff',
        }}
        onClick={() => setIsOpen(true)}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 30px rgba(0, 240, 255, 0.2)',
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColo
                    { label: 'Contact', icon: <FiMail />, action: () => { setIsOpen(false); document.getElementById('contact-district')?.scrollIntoView({ behavior: 'smooth' }); }, color: '#a855f7' },
                  ].map((link) => (
                    <button
                      key={link.label}
                      className="interactive flex items-center gap-2 p-3 rounded-lg text-left"
                      style={{
                        background: `${link.color}08`,
                        border: `1px solid ${link.color}15`,
                        color: link.color,
                      }}
                      onClick={() => {
                        if (link.action) link.action();
                        else if (link.href !== '#') window.open(link.href, '_blank');
                      }}
                    >
                      {link.icon}
                      <span className="text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                        {link.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-[rgba(0,240,255,0.2)] rounded-tl" />
              <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-[rgba(0,240,255,0.2)] rounded-tr" />
              <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-[rgba(0,240,255,0.2)] rounded-bl" />
              <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-[rgba(0,240,255,0.2)] rounded-br" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
