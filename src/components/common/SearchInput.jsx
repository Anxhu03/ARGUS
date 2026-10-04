import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search records, cases, orders...',
  onClear,
  shortcut = '⌘K',
  width = '100%',
  autoFocus = false,
  className = '',
  style = {},
  ...props
}) {
  const inputRef = useRef(null);

  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange({ target: { value: '' } });
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width,
        ...style
      }}
      className={className}
    >
      <Search
        size={15}
        style={{
          position: 'absolute',
          left: '12px',
          color: 'var(--text-faint)',
          pointerEvents: 'none'
        }}
      />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input-field"
        style={{
          paddingLeft: '34px',
          paddingRight: value ? '58px' : shortcut ? '48px' : '14px',
          height: '36px',
          fontSize: '12px'
        }}
        {...props}
      />

      {value ? (
        <button
          type="button"
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '10px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-faint)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      ) : shortcut ? (
        <span
          style={{
            position: 'absolute',
            right: '8px',
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            padding: '2px 5px',
            borderRadius: '4px',
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'var(--text-faint)',
            pointerEvents: 'none'
          }}
        >
          {shortcut}
        </span>
      ) : null}
    </div>
  );
}
