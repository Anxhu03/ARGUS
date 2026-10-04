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
    addToast
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

    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('ARG-') || q.startsWith('ORD-') || q === '1042' || q === '1043') {
      const targetId = q.includes('1043') ? 'ARG-1043' : 'ARG-1042';
      navigateToCase(targetId);
      addToast({
        type: 'info',
        title: 'Case Loaded',
        message: `Navigated directly to investigation file ${targetId}.`
      });
    } else {
      setCurrentView('cases');
      addToast({
        type: 'info',
        title: 'Querying Repository',
        message: `Filtering cases matching "${searchQuery}".`
      });
    }
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
      <div style={{ flex: 1, maxWidth: '420px', margin: '0 20px' }}>
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
        {/* Multi-Agent Swarm Telemetry Pill */}
        <div
          className="ref-agent-pulse-pill"
          title="Parallel DAG Workers (Billing, Order, Tech, Coordinator) Active"
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Multi-Agent Telemetry Status',
              message: '4 parallel agents online. Median consensus latency 340ms.'
            });
          }}
          style={{ cursor: 'pointer' }}
        >
          <StatusIndicator status="active" size={7} pulse />
          <span className="pulse-text">4 Agents Active</span>
        </div>

        {/* Notifications Dropdown */}
        <Dropdown
          align="right"
          width="320px"
          trigger={(isOpen) => (
            <button
              className="ref-icon-button"
              aria-label="Notifications"
              onClick={() => setUnreadNotifications(0)}
            >
              <Bell size={17} />
              {unreadNotifications > 0 && <span className="ref-notif-dot" />}
            </button>
          )}
        >
          <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Investigation Alerts
              </span>
              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                Live Stream
              </span>
            </div>
          </div>

          <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '4px' }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.caseId) navigateToCase(n.caseId);
                }}
                style={{
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                  transition: 'background var(--transition-fast)'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{n.time}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{n.desc}</p>
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
                addToast({ type: 'info', title: 'Specialist Preferences', message: 'Operator credentials loaded.' });
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <User size={15} color="var(--accent-cyan)" />
              <span>Investigator Profile</span>
            </div>

            <div
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
                addToast({ type: 'info', title: 'Gateway Access', message: 'Stripe, OMS, and Kafka API keys verified.' });
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Key size={15} color="var(--accent-cyan)" />
              <span>Gateway API Credentials</span>
            </div>

            <div style={{ height: '1px', background: 'var(--glass-border)', margin: '4px 0' }} />

            <div
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
                addToast({ type: 'info', title: 'Session Maintained', message: 'Operator session active.' });
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
