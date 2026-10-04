import React from 'react';

export default function IconButton({
  icon: Icon,
  label,
  variant = 'secondary', // 'secondary' | 'ghost' | 'primary'
  size = 'md', // 'sm' | 'md' | 'lg'
  badge = null,
  disabled = false,
  className = '',
  style = {},
  onClick,
  ...props
}) {
  const sizeStyles = {
    sm: { width: '30px', height: '30px', iconSize: 15 },
    md: { width: '36px', height: '36px', iconSize: 18 },
    lg: { width: '42px', height: '42px', iconSize: 20 }
  }[size] || { width: '36px', height: '36px', iconSize: 18 };

  return (
    <button
      type="button"
      className={`ref-icon-button ${className}`.trim()}
      style={{
        width: sizeStyles.width,
        height: sizeStyles.height,
        ...style
      }}
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      {...props}
    >
      {Icon && <Icon size={sizeStyles.iconSize} />}
      {badge && <span className="ref-notif-dot" />}
    </button>
  );
}
