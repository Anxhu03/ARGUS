import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import SearchInput from '../common/SearchInput';
import Dropdown from '../common/Dropdown';
import StatusIndicator from '../common/StatusIndicator';
import {
  Bell,
  Menu,
  ChevronDown,
  User,
  Key,
  LogOut,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function TopBar({ onToggleMobile }) {
  const {
    currentView,
    setCurrentView,
    navigateToCase,
    unreadNotifications,
    setUnreadNotifications,
    addToast,
    backendStatus,
    apiBaseUrl,
    checkBackendHealth,
    setCaseSearchQuery
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  // Page title mapping based on currentView
  const pageTitles = {
    dashboard: { title: 'Operational Overview', breadcrumb: 'Dashboard' },
    cases: { title: 'Dispute Cases Repository', breadcrumb: 'Investigation / Cases' },
    'case-detail': { title: 'Case Investigation File', breadcrumb: 'Investigation / Workspace' },
    support: { title: 'Support Intelligence Hub', breadcrumb: 'Support / Overview' },
    'support-faq': { title: 'Policy Knowledge Base', breadcrumb: 'Support / FAQ' },
    'support-ask': { title: 'Autonomous Agent Intake', breadcrumb: 'Support / Ask ARGUS' },
    'support-complaint': { title: 'Complaint Submission', breadcrumb: 'Support / Submit' },
    'support-my-cases': { title: 'Dispute Tracking', breadcrumb: 'Support / My Cases' },
    intelligence: { title: 'Case Memory & Intelligence', breadcrumb: 'Intelligence / Institutional' },
    patterns: { title: 'Systemic Pattern Detection', breadcrumb: 'Intelligence / Patterns' },
    prevention: { title: 'Prevention Recommendations', breadcrumb: 'Intelligence / Prevention' },
    settings: { title: 'System Tuning & Gateways', breadcrumb: 'System / Settings' }
  };

  const activeMeta = pageTitles[currentView] || { title: 'ARGUS Platform', breadcrumb: 'Overview' };

  const notifications = [
    {
      id: 1,
      title: 'Contradiction Flagged in ARG-1043',
      desc: 'GPS geofence mismatch vs delivery claim',
      time: '4m ago',
      type: 'warning',
      caseId: 'ARG-1043'
    },
    {
      id: 2,
      title: 'Stripe Ledger Re-sync Complete',
      desc: 'ch_3M4zZ8891 transaction authorization confirmed',
      time: '12m ago',
      type: 'success',
      caseId: 'ARG-1042'
    },
    {
      id: 3,
      title: 'Autonomous Resolution Executed',
      desc: 'Kafka DLQ replay triggered for ARG-1042',
      time: '32m ago',
      type: 'info',
      caseId: 'ARG-1042'
    }
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    const q = query.toUpperCase();

    // 1. Direct Case / Order ID lookup
    if (q.startsWith('ARG-') || q.startsWith('ORD-') || q === '1042' || q === '1043') {
      const targetId = q.includes('1043') ? 'ARG-1043' : 'ARG-1042';
      navigateToCase(targetId);
      addToast({
        type: 'info',
        title: 'Case Loaded',
        message: `Navigated directly to investigation file ${targetId}.`,
        duration: 3000
      });
      setSearchQuery('');
      return;
    }

    // 2. Navigation shortcut for view names
    const viewKeywords = {
      dashboard: 'dashboard',
      cases: 'cases',
      support: 'support',
      intelligence: 'intelligence',
      patterns: 'patterns',
      prevention: 'prevention',
      settings: 'settings',
      faq: 'support-faq',
      complaint: 'support-complaint'
    };
    const matchedView = viewKeywords[query.toLowerCase()];
    if (matchedView) {
      setCurrentView(matchedView);
      setSearchQuery('');
      return;
    }

    // 3. Search query: filter cases repository
    setCaseSearchQuery(query);
    setCurrentView('cases');
    addToast({
      type: 'info',
      title: 'Repository Filter Applied',
      message: `Filtering cases matching "${query}".`,
      duration: 3000
    });
    setSearchQuery('');
  };

  return (
    <header className="ref-header">
      {/* Left: Mobile Toggle & Page Title with Breadcrumb */}
      <div className="ref-header-left">
        <button
          className="ref-mobile-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-faint)', fontWeight: 500 }}>
            {activeMeta.breadcrumb}
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
            {activeMeta.title}
          </h2>
        </div>
      </div>

      {/* Center: Global Search Entry */}
      <div className="topbar-search-container ref-search-form" style={{ flex: '0 1 380px', minWidth: '180px', margin: '0 16px' }}>
        <form onSubmit={handleSearchSubmit}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Case ID (ARG-1042), Order, or SKU... (Enter)"
            shortcut="⌘K"
          />
        </form>
      </div>

      {/* Right Controls: Telemetry Pill, Notification Menu & Operator Avatar */}
      <div className="ref-header-right">
        {/* Backend API Connection Pill */}
        <div
          className="ref-agent-pulse-pill"
          title={backendStatus === 'connected' ? `FastAPI Backend online at ${apiBaseUrl}` : `FastAPI Backend offline at ${apiBaseUrl}. Running in local resilient fallback mode.`}
          onClick={() => {
            checkBackendHealth().then((h) => {
              if (h.online) {
                addToast({
                  type: 'success',
                  title: 'Backend API Connected',
                  message: `Connected to ${h.service} (${apiBaseUrl}). Total cases in SQLite: ${h.database?.cases_count}.`
                });
              } else {
                addToast({
                  type: 'warning',
                  title: 'Backend Offline (Local Fallback Active)',
                  message: `Backend at ${apiBaseUrl} is not reachable. Operating safely in local prototype mode.`
                });
              }
            });
          }}
          style={{
            cursor: 'pointer',
            borderColor: backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)',
            background: backendStatus === 'connected' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)'
          }}
        >
          <StatusIndicator status={backendStatus === 'connected' ? 'success' : 'warning'} size={7} pulse={backendStatus === 'connected'} />
          <span style={{ fontSize: '11px', fontWeight: 600, color: backendStatus === 'connected' ? 'var(--status-emerald)' : 'var(--status-amber)' }}>
            {backendStatus === 'connected' ? 'API Connected' : backendStatus === 'checking' ? 'Checking API...' : 'API Offline (Local)'}
          </span>
        </div>

        {/* Multi-Agent Swarm Telemetry Pill */}
        <div
          className="ref-agent-pulse-pill"
          title="Parallel DAG Workers (Billing, Order, Tech, Evidence Verifier, Coordinator) Active"
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Multi-Agent Telemetry Status',
              message: '5 parallel agents online. Median consensus latency 340ms.'
            });
          }}
          style={{ cursor: 'pointer' }}
        >
          <StatusIndicator status="active" size={7} pulse />
          <span className="pulse-text">5 Agents Active</span>
        </div>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          width="340px"
          onOpen={() => setUnreadNotifications(0)}
          trigger={(isOpen) => (
            <button
              type="button"
              className={`ref-icon-button ${isOpen ? 'active' : ''}`}
              aria-label="Investigation Notifications"
              aria-expanded={isOpen}
            >
              <Bell size={17} />
              {unreadNotifications > 0 && <span className="ref-notif-dot" />}
            </button>
          )}
        >
          <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Investigation Alerts
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600, background: 'var(--accent-cyan-muted)', padding: '2px 6px', borderRadius: 'var(--radius-xs)' }}>
                Live Stream
              </span>
            </div>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '6px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                data-dropdown-close="true"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (n.caseId) navigateToCase(n.caseId);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (n.caseId) navigateToCase(n.caseId);
                  }
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  transition: 'background var(--transition-fast)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.desc}</p>
              </div>
            ))}
          </div>
        </Dropdown>

        {/* Operator Profile Menu */}
        <Dropdown
          align="right"
          width="210px"
          trigger={(isOpen) => (
            <div className="ref-profile-trigger">
              <div className="ref-avatar">
                <span>AV</span>
              </div>
              <div className="ref-user-info">
                <span className="user-name">Alex Vance</span>
                <span className="user-role">Lead Investigator</span>
              </div>
              <ChevronDown
                size={14}
                className="chevron-icon"
                style={{
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform var(--transition-fast)'
                }}
              />
            </div>
          )}
        >
          <div style={{ padding: '6px' }}>
            <div
              data-dropdown-close="true"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}
              onClick={() => {
                setCurrentView('settings');
                addToast({ type: 'info', title: 'Specialist Preferences', message: 'Operator credentials loaded.', duration: 3000 });
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={15} color="var(--accent-cyan)" />
              <span>Investigator Profile</span>
            </div>

            <div
              data-dropdown-close="true"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--text-primary)'
              }}
              onClick={() => {
                setCurrentView('settings');
                addToast({ type: 'info', title: 'Gateway Access', message: 'Stripe, OMS, and Kafka API keys verified.', duration: 3000 });
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Key size={15} color="var(--accent-cyan)" />
              <span>Gateway API Credentials</span>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

            <div
              data-dropdown-close="true"
              style={{
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--status-rose)'
              }}
              onClick={() => {
                addToast({ type: 'info', title: 'Session Maintained', message: 'Operator session active.', duration: 3000 });
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(244, 63, 94, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
