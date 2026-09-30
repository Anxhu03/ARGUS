import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Menu,
  ChevronDown
} from 'lucide-react';

export default function TopBar({ onToggleMobile }) {
  const { currentView, setCurrentView } = useApp();

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'cases', label: 'Cases' },
    { id: 'case-detail', label: 'Investigations' },
    { id: 'support', label: 'Support' },
    { id: 'intelligence', label: 'Intelligence' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'settings', label: 'Settings' }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Brand Logo (Left) */}
      <div className="flex items-center gap-3">
        <button
          className="md:hidden ref-mobile-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <a
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => handleNavClick('dashboard')}
          href="#dashboard"
        >
          <div className="flex flex-col gap-1">
            <div className="w-5 h-0.5 bg-foreground"></div>
            <div className="w-5 h-0.5 bg-foreground"></div>
            <div className="w-3 h-0.5 bg-foreground"></div>
          </div>
          <span className="text-xl font-semibold tracking-tight text-foreground">ARGUS</span>
        </a>
      </div>

      {/* Pill Navigation (Center - Matching exact reference style) */}
      <nav className="hidden md:flex items-center bg-card rounded-full px-2 py-1.5 border border-border shadow-xs">
        {navLinks.map((link) => {
          const isActive = currentView === link.id || (link.id === 'case-detail' && currentView === 'investigations');
          return (
            <button
              key={link.id}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors cursor-pointer border-none ${
                isActive
                  ? 'bg-[var(--color-accent)] text-foreground font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground bg-transparent'
              }`}
              onClick={() => handleNavClick(link.id)}
            >
              {link.label}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Bell and User Profile matching reference */}
      <div className="flex items-center gap-4">
        <button
          className="inline-flex items-center justify-center size-9 rounded-full hover:bg-accent text-sm font-medium transition-colors cursor-pointer border border-transparent hover:border-border text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
          onClick={() => {}}
        >
          <Bell className="w-5 h-5" />
        </button>

        <button
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          type="button"
          onClick={() => {}}
        >
          <span className="relative flex size-9 shrink-0 overflow-hidden rounded-full bg-muted items-center justify-center border border-border">
            <span className="text-xs font-semibold text-foreground">OS</span>
          </span>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium leading-none mb-1 text-foreground">Oripio Sajib</p>
            <p className="text-xs text-muted-foreground leading-none">Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
