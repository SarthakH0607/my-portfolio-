import { motion } from 'framer-motion';

export default function HolographicPanel({
  children,
  className = '',
  variant = 'default',
  animated = true,
}) {
  const variants = {
    default: 'border-[rgba(0,240,255,0.2)]',
    purple: 'border-[rgba(168,85,247,0.2)]',
    success: 'border-[rgba(16,185,129,0.2)]',
  };

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl border p-6
        ${variants[variant] || variants.default}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(0,240,255,0.04) 0%, rgba(168,85,247,0.04) 100%)',
        backdropFilter: 'blur(12px)',
      }}
      initial={animated ? { opacity: 0, y: 20 } : undefined}
      whileInView={animated ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Scan lines */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 240, 255, 0.012) 2px,
            rgba(0, 240, 255, 0.012) 4px
          )`,
        }}
      />

      {/* Top edge glow */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(0,240,255,0.4), transparent)',
        }}
      />

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
