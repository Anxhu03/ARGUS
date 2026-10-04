import React from 'react';

export default function StatusIndicator({
  status = 'active', // 'active' | 'busy' | 'warning' | 'error' | 'offline'
  pulse = true,
  label = null,
  size = 8,
  className = '',
  style = {}
}) {
  const colorMap = {
    active: 'var(--status-emerald)',
    busy: 'var(--accent-cyan)',
    warning: 'var(--status-amber)',
    error: 'var(--status-rose)',
    offline: 'var(--text-faint)'
  };

  const currentColor = colorMap[status] || colorMap.active;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        ...style
      }}
      className={className}
    >
      <span
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          backgroundColor: currentColor,
          position: 'relative',
          display: 'inline-block',
          flexShrink: 0
        }}
      >
        {pulse && (
          <span
            style={{
              position: 'absolute',
              inset: '-2px',
              borderRadius: '50%',
              border: `1.5px solid ${currentColor}`,
              animation: 'pulse-ring 2s cubic-bezier(0.24, 0, 0.38, 1) infinite'
            }}
          />
        )}
      </span>

      {label && (
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: currentColor
          }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
