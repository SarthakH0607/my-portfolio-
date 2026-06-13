export default function NeonText({
  children,
  as: Tag = 'span',
  color = 'cyan',
  className = '',
  animate = false,
}) {
  const colorMap = {
    cyan: 'neon-text',
    purple: 'neon-text-purple',
  };

  return (
    <Tag
      className={`
        ${colorMap[color] || colorMap.cyan}
        ${animate ? 'flicker' : ''}
        ${className}
      `}
    >
      {children}
    </Tag>
  );
}
