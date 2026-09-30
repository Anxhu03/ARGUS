import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  HelpCircle,
  FolderGit2,
  GitBranch,
  BrainCircuit,
  Network,
  Settings,
  LayoutDashboard
} from 'lucide-react';

export default function TopBar({ onToggleMobile }) {
  const { currentView, setCurrentView, navigateToCase, navigateToSupport, kpis, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FolderGit2, badge: kpis?.activeCases || '18' },
    { id: 'case-detail', label: 'Investigations', icon: GitBranch, badge: 'Live' },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'intelligence', label: 'Intelligence', icon: BrainCircuit },
    { id: 'patterns', label: 'Patterns', icon: Network, badge: kpis?.patternsDetected || '4' },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleNavClick = (id) => {
    setCurrentView(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('ARG-') || q.startsWith('ORD-') || q === '1042' || q === '1043') {
      const targetId = q.includes('1043') ? 'ARG-1043' : 'ARG-1042';
      navigateToCase(targetId);
      addToast({
        type: 'info',
        title: 'Investigation Loaded',
        message: `Navigated to case ${targetId}.`
      });
    } else {
      setCurrentView('cases');
      addToast({
        type: 'info',
        title: 'Cases Filtered',
        message: `Searching records matching "${searchQuery}".`
      });
    }
  };

  return (
    <header className="ref-header">
      {/* Brand Logo (Left) */}
      <div className="ref-header-left">
        <button
          className="ref-mobile-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div
          className="ref-brand"
          onClick={() => handleNavClick('dashboard')}
          role="button"
          tabIndex={0}
        >
          <div className="ref-logo-icon">
            <div className="logo-bar bar-1"></div>
            <div className="logo-bar bar-2"></div>
            <div className="logo-bar bar-3"></div>
          </div>
          <div className="ref-brand-text">
            <span className="brand-name">ARGUS</span>
            <span className="brand-badge">AI Platform</span>
          </div>
        </div>
      </div>

      {/* Pill Navigation (Center - Reference signature style) */}
      <nav className="ref-nav-pill-wrapper">
        <div className="ref-nav-pill-container">
          {navLinks.map((link) => {
            const isActive = currentView === link.id || (link.id === 'case-detail' && currentView === 'investigations');
            return (
              <button
                key={link.id}
                className={`ref-pill-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(link.id)}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className={`ref-pill-badge ${isActive ? 'badge-active' : ''}`}>
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Right Controls: Status Pill, Search, Notification & Operator Avatar */}
      <div className="ref-header-right">
        {/* Live Multi-Agent Telemetry Status */}
        <div className="ref-agent-pulse-pill" title="Billing, Order, Technical & Coordinator Agents Synced">
          <span className="pulse-indicator-dot"></span>
          <span className="pulse-text">4 Agents Active</span>
        </div>

        {/* Quick Search */}
        <form onSubmit={handleQuickSearch} className="ref-search-form">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="ref-search-input"
            placeholder="Search Case, Order, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Notification Bell */}
        <div className="relative-container">
          <button
            className="ref-icon-button"
            onClick={() => {
              setNotifOpen(!notifOpen);
              addToast({
                type: 'info',
                title: 'Live Event Stream',
                message: 'Stripe Gateway & Kafka DLQ monitors synchronized. Latency 14ms.'
              });
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="ref-notif-dot"></span>
          </button>
        </div>

        {/* Operator Profile */}
        <div className="ref-profile-trigger" onClick={() => setProfileOpen(!profileOpen)}>
          <div className="ref-avatar">
            <span>AV</span>
          </div>
          <div className="ref-user-info">
            <p className="user-name">Alex Vance</p>
            <p className="user-role">Lead Investigator</p>
          </div>
          <ChevronDown size={14} className="chevron-icon" />
        </div>
      </div>
    </header>
  );
}
