import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { useInView } from '../../hooks/useInView';
import GlassCard from '../ui/GlassCard';

export default function ContactDistrict() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });

  return (
    <section ref={ref} className="section-container" id="contact-district">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-[0.4em] uppercase mb-3 text-cyan-400 block" style={{ fontFamily: 'var(--font-heading)' }}>
            Terminal Node
          </span>
          <h2 className="text-3xl font-extrabold uppercase tracking-widest text-cyan-400 drop-shadow-[0_0_15px_rgba(0,240,255,0.35)]" style={{ fontFamily: 'var(--font-heading)' }}>
            Establish Comm-Link
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <GlassCard variant="cyan">
            <div className="flex justify-between items-center bg-cyan-950/20 border-b border-cyan-500/10 px-4 py-3">
              <div className="flex gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs tracking-widest text-cyan-400 font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
                CONTACT_CONSOLE_LINK
              </span>
              <div className="w-6" />
            </div>

            <div className="p-6 font-mono text-sm text-slate-300 space-y-4">
              <div className="text-pink-500">visitor@sarthak.dev:~$ initialize-gateway --secure</div>
              <div className="text-emerald-400">Establishing secure remote shell connection... SUCCESS</div>
              <div className="text-slate-400">Welcome to the Connection Portal. Select a node to establish a direct link:</div>

              <div className="cyber-links-container pt-4">
                {/* Email Protocol */}
                <a href="mailto:hundaresarthak@gmail.com" className="cyber-link-card mail-node">
                  <div className="cyber-card-glow"></div>
                  <div className="cyber-card-header">
                    <span className="protocol-status">ONLINE</span>
                    <span className="protocol-title">EMAIL PROTOCOL</span>
                  </div>
                  <div className="cyber-card-body">
                    <FiMail size={24} className="cyber-card-icon" />
                    <div className="cyber-card-info">
                      <span className="cyber-card-value">hundaresarthak@gmail.com</span>
                      <span className="cyber-card-desc">Click to transmit direct email message</span>
                    </div>
                  </div>
                </a>

                {/* LinkedIn Gateway */}
                <a href="https://www.linkedin.com/in/sarthak-hundare-0607" target="_blank" rel="noopener noreferrer" className="cyber-link-card linkedin-node">
                  <div className="cyber-card-glow"></div>
                  <div className="cyber-card-header">
                    <span className="protocol-status">ONLINE</span>
                    <span className="protocol-title">LINKEDIN GATEWAY</span>
                  </div>
                  <div className="cyber-card-body">
                    <FiLinkedin size={24} className="cyber-card-icon" />
                    <div className="cyber-card-info">
                      <span className="cyber-card-value">linkedin.com/in/sarthak-hundare</span>
                      <span className="cyber-card-desc">Click to direct message on LinkedIn</span>
                    </div>
                  </div>
                </a>

                {/* GitHub Reactor */}
                <a href="https://github.com/SarthakH0607" target="_blank" rel="noopener noreferrer" className="cyber-link-card github-node">
                  <div className="cyber-card-glow"></div>
                  <div className="cyber-card-header">
                    <span className="protocol-status">ONLINE</span>
                    <span className="protocol-title">GITHUB REACTOR</span>
                  </div>
                  <div className="cyber-card-body">
                    <FiGithub size={24} className="cyber-card-icon" />
                    <div className="cyber-card-info">
                      <span className="cyber-card-value">github.com/SarthakH0607</span>
                      <span className="cyber-card-desc">Click to view source code repositories</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <motion.div
          className="mt-20 pt-8 text-center border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        >
          <p className="text-xs mb-2 text-white/30 font-mono">
            Designed & Built by Sarthak Hundare
          </p>
          <p className="text-xs text-white/20 font-mono">
            © {new Date().getFullYear()} Sarthak.dev • sarthakhundare.syntacsyndicate.co.in
          </p>
        </motion.div>
      </div>
    </section>
  );
}
