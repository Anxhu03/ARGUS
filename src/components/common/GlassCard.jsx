import React from 'react';

export default function GlassCard({
  children,
  className = '',
  glow = false,
  interactive = false,
  style = {},
  onClick
}) {
  const classes = [
    'glass-panel',
    glow ? 'glass-panel-glow' : '',
    interactive ? 'glow-on-hover' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        padding: '20px',
        cursor: interactive || onClick ? 'pointer' : 'default',
        ...style
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
