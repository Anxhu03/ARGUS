import React, { useState, useRef, useEffect } from 'react';
import { User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function UserMenu({ compact = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { setCurrentView } = useApp();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`user-menu-btn ${compact ? 'user-menu-btn-compact' : ''}`}
      >
        <div className="user-avatar-circle">
          <span className="text-xs font-bold text-white">MC</span>
        </div>
        {!compact && (
          <>
            <div className="user-menu-text text-left">
              <p className="text-xs font-semibold text-white leading-tight">Marcus Chen</p>
              <p className="text-[11px] text-slate-400 leading-tight">marcus@argus.io</p>
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {isOpen && (
        <div className="user-dropdown-popover">
          <div className="px-3 py-2.5 border-b border-slate-800">
            <p className="text-xs font-semibold text-white">Marcus Chen</p>
            <p className="text-[11px] text-slate-400">Principal Store Administrator</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">Store Live • Production</span>
            </div>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setCurrentView('settings');
              }}
              className="user-dropdown-item"
            >
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Store Profile</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setCurrentView('settings');
              }}
              className="user-dropdown-item"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Settings & Preferences</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setCurrentView('intelligence');
              }}
              className="user-dropdown-item"
            >
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>ARGUS Security Guard</span>
            </button>
          </div>

          <div className="py-1 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="user-dropdown-item text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
