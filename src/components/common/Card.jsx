import React from 'react';

export default function Card({
  children,
  variant = 'default', // 'default' | 'elevated' | 'glass' | 'glow' | 'subtle'
  interactive = false,
  padding = '20px',
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const variantStyles = {
    default: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)'
    },
    elevated: {
      background: 'var(--bg-elevated)',
      border: '1px solid var(--glass-border-light)',
      boxShadow: 'var(--glass-shadow-lg)'
    },
    glass: {
      background: 'var(--glass-surface)',
      backdropFilter: 'var(--glass-blur)',
      WebkitBackdropFilter: 'var(--glass-blur)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)'
    },
    glow: {
      background: 'var(--bg-surface)',
      border: '1px solid var(--glass-border-cyan)',
      boxShadow: 'var(--glass-shadow), var(--accent-glow-subtle)'
    },
    subtle: {
      background: 'var(--bg-secondary)',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      boxShadow: 'none'
    }
  }[variant] || {};

  return (
    <div
      className={`ref-card ${className}`.trim()}
      style={{
        ...variantStyles,
        padding,
        cursor: interactive || onClick ? 'pointer' : 'default',
        borderRadius: 'var(--radius-lg)',
        transition: 'all var(--transition-base)',
        ...style
      }}
      onClick={onClick}
      role={interactive || onClick ? 'button' : undefined}
      tabIndex={interactive || onClick ? 0 : undefined}
      onKeyDown={
        interactive || onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick && onClick(e);
              }
            }
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
}
