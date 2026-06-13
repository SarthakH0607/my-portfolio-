                <h3
                  className="text-sm font-bold mb-1"
                  style={{ fontFamily: 'var(--font-heading)', color: 'rgba(232,234,237,0.9)' }}
                >
                  {cert.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs" style={{ color: cert.color, fontFamily: 'var(--font-heading)' }}>
                    {cert.issuer}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: 'rgba(232,234,237,0.4)', fontFamily: 'var(--font-mono)' }}
                  >
                    {cert.date}
                </div>
                
                {cert.description && (
                  <p className="text-xs text-white/50 mb-3 leading-relaxed">
                    {cert.description}
                  </p>
                )}

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {cert.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-xs rounded"
                      style={{
                        background: `${cert.color}08`,