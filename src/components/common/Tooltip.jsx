import React, { useState } from 'react';

export default function Tooltip({
  children,
  content,
  position = 'top', // 'top' | 'bottom' | 'left' | 'right'
  delay = 200,
  className = '',
  style = {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionStyles = {
    top: { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    left: { right: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' },
    right: { left: 'calc(100% + 6px)', top: '50%', transform: 'translateY(-50%)' }
  }[position] || { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' };

  if (!content) return children;

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', ...style }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      className={className}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            ...positionStyles,
            padding: '4px 8px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--glass-border-light)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--glass-shadow)',
            color: 'var(--text-primary)',
            fontSize: '11px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            zIndex: 'var(--z-tooltip)',
            pointerEvents: 'none',
            animation: 'fadeIn 0.12s ease'
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
