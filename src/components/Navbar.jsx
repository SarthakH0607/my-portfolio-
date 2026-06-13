import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiGithub, FiMail } from 'react-icons/fi';

const NAV_ITEMS = [
  { label: 'Home', href: '#city-overview' },
  { label: 'About', href: '#central-plaza' },
  { label: 'Skills', href: '#skills-tower' },
  { label: 'Projects', href: '#project-district' },
  { label: 'Certificates', href: '#certificate-museum' },
  { label: 'GitHub', href: '#github-powerplant' },
  { label: 'Contact', href: '#contact-district' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(2, 2, 12, 0.85)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,240,255,0.08)'
<truncated 965 bytes>
         {item.label}
            </a>
          ))}
          <a
            href="https://github.com/SarthakH0607"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-[#00f0ff] transition-colors"
          >
            <FiGithub size={16} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white/70 hover:text-[#00f0ff] transition-colors cursor-pointer"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden absolute top-16 left-0 right-0 border-t border-white/5"
            style={{
              background: 'rgba(2, 2, 12, 0.95)',
              backdropFilter: 'blur(24px)',
            }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-white/60 hover:text-[#00f0ff] text-sm font-mono uppercase tracking-wider transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
