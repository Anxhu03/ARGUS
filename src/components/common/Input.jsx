import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  className = '',
  style = {},
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: error ? 'var(--status-rose)' : 'var(--text-secondary)'
          }}
        >
          {label} {required && <span style={{ color: 'var(--status-rose)' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '12px',
              color: error ? 'var(--status-rose)' : 'var(--text-faint)',
              pointerEvents: 'none',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Icon size={16} />
          </div>
        )}

        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${className}`.trim()}
          style={{
            paddingLeft: Icon ? '36px' : '14px',
            borderColor: error ? 'var(--status-rose)' : undefined,
            boxShadow: error ? '0 0 0 1px var(--status-rose)' : undefined
          }}
          {...props}
        />
      </div>

      {(error || helperText) && (
        <span
          style={{
            fontSize: '11px',
            color: error ? 'var(--status-rose)' : 'var(--text-faint)'
          }}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
}
