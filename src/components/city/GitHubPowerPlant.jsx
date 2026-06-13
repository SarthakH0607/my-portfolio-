import { motion } from 'framer-motion';
import { FiGitBranch, FiStar, FiGitCommit, FiCode, FiExternalLink } from 'react-icons/fi';
import { useGitHubStats } from '../../hooks/useGitHubStats';
import { useInView } from '../../hooks/useInView';
import HolographicPanel from '../ui/HolographicPanel';

const LANGUAGE_COLORS = {
  Python: '#3776AB',
  JavaScript: '#F7DF1E',
  HTML: '#E34F26',
  CSS: '#1572B6',
  Java: '#ED8B00',
  TypeScript: '#3178C6',
  'C++': '#00599C',
  Ruby: '#CC342D',
  Go: '#00ADD8',
  Rust: '#000000',
};

export default function GitHubPowerPlant() {
  const { ref, hasBeenInView } = useInView({ threshold: 0.1 });
  const { stats, loading } = useGitHubStats('sarthakhundare');

  const energyLevel = stats
    ? Math.min(100, (stats.publicRepos * 5 + stats.totalStars * 10 + stats.followers * 3))
    : 0;

  return (
    <section ref={ref} className="section-container dots-bg" id="github-powerplant">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ fontFamily: 'var(--font-heading)', color: 'rgba(16, 185, 129, 0.5)' }}>
            GitHub Power Plant
          </p>
          <h2
            className="section-title"
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <FiCode size={12} style={{ color: '#10b981' }} />
                          <span className="text-sm font-semibold" style={{ color: '#10b981' }}>
                            {repo.name}
                          </span>
                        </div>
                        {repo.description && (
                          <p className="text-xs mt-1" style={{ color: 'rgba(232,234,237,0.4)' }}>
                            {repo.description.slice(0, 60)}
                          </p>
                        )}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm" style={{ color: 'rgba(232,234,237,0.4)' }}>
                    Repos will appear here from your GitHub profile.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        ) : null}

        {/* View on GitHub */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
        >
          <a
            href="https://github.com/sarthakhundare"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-futuristic interactive"
            style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }}
          >
            <FiExternalLink /> View Full Profile on GitHub
          </a>
        </motion.div>
      </div>
    </section>
  );
}
