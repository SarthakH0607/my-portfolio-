import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGithub, FiExternalLink, FiX } from 'react-icons/fi';
import { useInView } from '../../hooks/useInView';
import { projects } from '../../data/projects';
import GlassCard from '../ui/GlassCard';

export default function ProjectDistrict() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section ref={ref} className="section-container grid-bg" id="project-district">
      <div className="content-wrapper">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3 text-white/40" style={{ fontFamily: 'var(--font-heading)' }}>
            Project District
          </p>
          <h2 className="section-title">Featured Work</h2>
          <p className="section-subtitle mx-auto">
            A selection of engineering projects, showing full stack systems and interactive design.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
 
                        <span className="text-[#6b8afd]">•</span> {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedProject.lessons.length > 0 && (
                <div className="mb-6">
                  <h4
                    className="text-xs font-semibold tracking-wider uppercase mb-3 text-white/40"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Lessons Learned
                  </h4>
                  <ul className="space-y-2">
                    {selectedProject.lessons.map((l) => (
                      <li key={l} className="flex items-start gap-2 text-xs text-white/50">
                        <span>•</span> {l}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 mt-8">
                {selectedProject.github !== '#' && (
                  <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="btn interactive cursor-none">
                    <FiGithub size={14} /> View Code
                  </a>
                )}
                {selectedProject.live !== '#' && (
                  <a href={selectedProject.live} target="_blank" rel="noopener noreferrer" className="btn btn-accent interactive cursor-none">
                    <FiExternalLink size={14} /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
