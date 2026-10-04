import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  width = '200px',
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      className={className}
    >
      <div onClick={() => setIsOpen(!isOpen)} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            [align]: 0,
            width,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--glass-border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--glass-shadow-lg)',
            padding: '6px',
            zIndex: 'var(--z-dropdown)',
            animation: 'fadeInScale 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}
