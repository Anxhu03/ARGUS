import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Menu,
  Shield,
  Activity,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function TopBar({ onToggleMobile }) {
  const { currentView, setCurrentView, navigateToCase, navigateToSupport, kpis, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  // Page titles and contextual descriptions
  const titles = {
    dashboard: {
      title: 'Operational Intelligence Overview',
      subtitle: 'Real-time telemetry across multi-agent investigations, auto-resolutions, and platform anomalies'
    },
    cases: {
      title: 'Support Cases & Investigations',
      subtitle: 'Audit, triage, and inspect customer complaints under active diagnostic flows'
    },
    'case-detail': {
      title: 'Investigation Deep-Dive',
      subtitle: 'Multi-agent consensus, cryptographic evidence matrix, and automated root cause analysis'
    },
    support: {
      title: 'Support Intelligence Hub',
      subtitle: 'Dual Portal: Instant Knowledge-Base FAQ retrieval & Autonomous ARGUS Investigation launcher'
    },
    intelligence: {
      title: 'Customer Case Memory & Reliability',
      subtitle: 'Historic complaint patterns, evidence consistency metrics, and longitudinal reliability indexing'
    },
    patterns: {
      title: 'Pattern Detection & Systemic Prevention',
      subtitle: 'Cross-dimensional anomalies across merchants, logistics partners, and software components'
    },
    settings: {
      title: 'System Settings & Agent Tuning',
      subtitle: 'Threshold configuration, consensus weights, and gateway mock orchestration'
    }
  };

  const currentMeta = titles[currentView] || titles.dashboard;

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('ARG-') || q.startsWith('ORD-')) {
      navigateToCase('ARG-1042');
      addToast({
        type: 'info',
        title: 'Quick Navigate',
        message: `Navigated to target investigation matching "${searchQuery}".`
      });
    } else {
      setCurrentView('cases');
      addToast({
        type: 'info',
        title: 'Filter Applied',
        message: `Searching cases matching "${searchQuery}".`
      });
    }
  };

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        position: 'sticky',
        top: 0,
        zIndex: 800,
        background: 'rgba(7, 10, 18, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--glass-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        gap: '20px'
      }}
    >
      {/* Mobile Toggle & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          className="btn btn-ghost"
          style={{ display: 'none', padding: '8px' }}
          id="mobile-nav-toggle"
          onClick={onToggleMobile}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.2
            }}
          >
            {currentMeta.title}
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              marginTop: '2px',
              maxWidth: '650px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls: Search, System Badge, Notifications */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Quick Search */}
        <form onSubmit={handleQuickSearch} style={{ position: 'relative', width: '240px' }}>
          <Search
            size={15}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search Case, Order, or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '34px',
              paddingRight: '12px',
              height: '36px',
              fontSize: '12px',
              borderRadius: 'var(--radius-full)'
            }}
          />
        </form>

        {/* Live Multi-Agent Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 242, 254, 0.06)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--accent-cyan)'
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 8px var(--accent-cyan)',
              animation: 'pulse-ring 2s infinite'
            }}
          />
          <span>4 AGENTS ACTIVE</span>
        </div>

        {/* Support Entry Button */}
        <button
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
          onClick={() => navigateToSupport('faq')}
          title="Open Support & FAQ Knowledge Base"
        >
          <HelpCircle size={15} color="var(--accent-cyan)" />
          <span>Support Portal</span>
        </button>

        {/* Notifications Alert */}
        <button
          className="btn btn-ghost"
          style={{
            padding: '8px',
            borderRadius: 'var(--radius-md)',
            position: 'relative'
          }}
          onClick={() => {
            addToast({
              type: 'info',
              title: 'System Event Stream',
              message: 'Kafka message bus operating at nominal latency (12ms). Zero packet drops detected.'
            });
          }}
          aria-label="View system notifications"
        >
          <Bell size={18} color="var(--text-secondary)" />
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 6px var(--accent-cyan)'
            }}
          />
        </button>
      </div>
    </header>
  );
}
