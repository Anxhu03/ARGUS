import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'cyan' | 'purple'
  size = 'md', // 'sm' | 'md'
  dot = false,
  className = '',
  style = {},
  ...props
}) {
  const variantStyles = {
    neutral: {
      background: 'rgba(255, 255, 255, 0.08)',
      color: 'var(--text-secondary)',
      border: '1px solid rgba(255, 255, 255, 0.12)'
    },
    primary: {
      background: 'rgba(6, 182, 212, 0.15)',
      color: 'var(--accent-cyan)',
      border: '1px solid rgba(6, 182, 212, 0.3)'
    },
    success: {
      background: 'var(--status-emerald-bg)',
      color: 'var(--status-emerald)',
      border: '1px solid var(--status-emerald-border)'
    },
    warning: {
      background: 'var(--status-amber-bg)',
      color: 'var(--status-amber)',
      border: '1px solid var(--status-amber-border)'
    },
    danger: {
      background: 'var(--status-rose-bg)',
      color: 'var(--status-rose)',
      border: '1px solid var(--status-rose-border)'
    },
    cyan: {
      background: 'var(--status-cyan-bg)',
      color: 'var(--status-cyan)',
      border: '1px solid var(--status-cyan-border)'
    },
    purple: {
      background: 'var(--status-purple-bg)',
      color: 'var(--status-purple)',
      border: '1px solid var(--status-purple-border)'
    }
  }[variant] || {};

  const sizeStyles = size === 'sm' ? { padding: '2px 6px', fontSize: '10px' } : { padding: '3px 9px', fontSize: '11px' };

  return (
    <span
      className={`status-badge ${className}`.trim()}
      style={{
        ...variantStyles,
        ...sizeStyles,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontWeight: 600,
        borderRadius: 'var(--radius-full)',
        ...style
      }}
      {...props}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'currentColor'
          }}
        />
      )}
      {children}
    </span>
  );
}
