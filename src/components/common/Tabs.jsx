import React from 'react';

export default function Tabs({
  tabs = [], // [{ id, label, icon: Icon, badge: string|number, disabled: boolean }]
  activeTab,
  onChange,
  variant = 'pill', // 'pill' | 'line'
  className = '',
  style = {}
}) {
  if (variant === 'line') {
    return (
      <div
        style={{
          display: 'flex',
          gap: '16px',
          borderBottom: '1px solid var(--glass-border)',
          ...style
        }}
        className={className}
        role="tablist"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onChange(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 4px',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 500,
                cursor: tab.disabled ? 'not-allowed' : 'pointer',
                opacity: tab.disabled ? 0.4 : 1,
                borderBottom: isActive ? '2px solid var(--accent-cyan)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all var(--transition-fast)'
              }}
            >
              {Icon && <Icon size={16} />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: 'var(--radius-full)',
                    background: isActive ? 'var(--accent-cyan-muted)' : 'rgba(255, 255, 255, 0.08)',
                    color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Pill variant
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-tertiary)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--glass-border)',
        gap: '3px',
        ...style
      }}
      className={className}
      role="tablist"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && onChange(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: isActive ? 'var(--accent-cyan)' : 'transparent',
              color: isActive ? '#07090e' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: isActive ? 700 : 500,
              cursor: tab.disabled ? 'not-allowed' : 'pointer',
              opacity: tab.disabled ? 0.4 : 1,
              transition: 'all var(--transition-fast)'
            }}
          >
            {Icon && <Icon size={14} />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge !== null && (
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '9999px',
                  background: isActive ? 'rgba(7, 9, 14, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#07090e' : 'var(--text-muted)'
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
