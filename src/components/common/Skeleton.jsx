import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'rect' | 'circle' | 'card'
  width = '100%',
  height,
  borderRadius,
  className = '',
  style = {}
}) {
  const getDefaultHeight = () => {
    switch (variant) {
      case 'circle': return width;
      case 'text': return '14px';
      case 'card': return '120px';
      case 'rect':
      default: return height || '40px';
    }
  };

  const finalHeight = height || getDefaultHeight();
  const finalRadius = borderRadius || (variant === 'circle' ? '50%' : variant === 'card' ? 'var(--radius-lg)' : 'var(--radius-sm)');

  return (
    <div
      style={{
        width,
        height: finalHeight,
        borderRadius: finalRadius,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      className={`skeleton-shimmer ${className}`.trim()}
    >
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.07), transparent);
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
