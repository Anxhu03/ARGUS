import React from 'react';
import Tooltip from './Tooltip';

export default function SidebarNavItem({
  icon: Icon,
  label,
  badge = null,
  isActive = false,
  isCollapsed = false,
  disabled = false,
  onClick,
  className = '',
  style = {}
}) {
  const content = (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
        gap: isCollapsed ? 0 : '12px',
        padding: isCollapsed ? '10px 0' : '9px 12px',
        borderRadius: 'var(--radius-md)',
        border: 'none',
        background: isActive
          ? 'var(--accent-cyan-muted)'
          : 'transparent',
        color: isActive
          ? 'var(--accent-cyan)'
          : disabled
            ? 'var(--text-faint)'
            : 'var(--text-secondary)',
        fontSize: '13px',
        fontWeight: isActive ? 600 : 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        position: 'relative',
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        opacity: disabled ? 0.45 : 1,
        borderLeft: isActive && !isCollapsed ? '3px solid var(--accent-cyan)' : '3px solid transparent',
        ...style
      }}
      className={`sidebar-nav-item ${isActive ? 'active' : ''} ${className}`.trim()}
      onMouseEnter={(e) => {
        if (!isActive && !disabled) {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.color = 'var(--text-primary)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive && !disabled) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--text-secondary)';
        }
      }}
    >
      {Icon && (
        <Icon
          size={18}
          color={isActive ? 'var(--accent-cyan)' : 'currentColor'}
          style={{ flexShrink: 0 }}
        />
      )}

      {!isCollapsed && (
        <>
          <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {label}
          </span>
          {badge !== undefined && badge !== null && (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '9999px',
                background: isActive
                  ? 'rgba(6, 182, 212, 0.25)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                lineHeight: 1.4
              }}
            >
              {badge}
            </span>
          )}
        </>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip content={label} position="right" delay={150}>
        {content}
      </Tooltip>
    );
  }

  return content;
}
