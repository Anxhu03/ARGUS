import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({
  trigger,
  children,
  align = 'right', // 'left' | 'right'
  width = '200px',
  className = '',
  style = {},
  onOpen
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

  const toggleDropdown = () => {
    setIsOpen(prev => {
      const next = !prev;
      if (next && onOpen) onOpen();
      return next;
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleDropdown();
    }
  };

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', display: 'inline-block', ...style }}
      className={className}
    >
      <div
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        style={{ cursor: 'pointer', display: 'inline-flex' }}
      >
        {trigger(isOpen)}
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
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
          onClick={(e) => {
            // Only auto-close if clicking an interactive item designed to close dropdown (e.g. action or link)
            if (e.target.closest('[data-dropdown-close="true"]') || e.target.closest('button')) {
              setIsOpen(false);
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
