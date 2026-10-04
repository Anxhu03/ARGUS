import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../common/Card';
import Badge from '../common/Badge';
import SupportFaqSection from './SupportFaqSection';
import AskArgusSection from './AskArgusSection';
import SubmitComplaintSection from './SubmitComplaintSection';
import MyCasesSection from './MyCasesSection';
import {
  HelpCircle,
  BookOpen,
  Sparkles,
  FilePlus,
  Inbox,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Clock,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function SupportView() {
  const { supportMode, setSupportMode, navigateToCase } = useApp();

  // Normalized active tab: 'overview' | 'faq' | 'ask' | 'complaint' | 'my-cases'
  const activeTab = supportMode === 'agent'
    ? 'complaint'
    : (supportMode || 'overview');

  // Context prefill from Ask ARGUS to Complaint form
  const [complaintPrefill, setComplaintPrefill] = useState({
    category: null,
    description: ''
  });

  const handleStartComplaintWithContext = ({ category, description }) => {
    setComplaintPrefill({ category, description });
    setSupportMode('complaint');
  };

  const supportTabs = [
    { id: 'overview', label: 'Support Hub', icon: HelpCircle },
    { id: 'faq', label: 'FAQ Knowledge', icon: BookOpen },
    { id: 'ask', label: 'Ask ARGUS AI', icon: Sparkles, badge: 'Demo' },
    { id: 'complaint', label: 'Submit Complaint', icon: FilePlus },
    { id: 'my-cases', label: 'My Cases', icon: Inbox }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Informational Prototype Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.22)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>
          <strong style={{ color: 'var(--accent-cyan)' }}>Customer Support Demonstration Environment:</strong>{' '}
          All knowledge policies, conversational answers, and submitted complaints operate on structured operational demonstration data.
        </span>
        <Badge variant="cyan" size="sm">Phase 4 Active</Badge>
      </div>

      {/* Support Page Header */}
      <div className="ref-subheader">
        <div className="ref-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0 }}>Customer Support</h1>
            <Badge variant="neutral" size="sm">
              Resolution Hub
            </Badge>
          </div>
          <p style={{ margin: '4px 0 0 0' }}>
            Get answers, report an issue, or let ARGUS help investigate your concern.
          </p>
        </div>

        {/* Support Section Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'var(--bg-tertiary)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--glass-border)',
            flexWrap: 'wrap'
          }}
        >
          {supportTabs.map((tab) => {
            const IconComponent = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSupportMode(tab.id)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isSelected ? 'var(--accent-cyan)' : 'transparent',
                  color: isSelected ? '#07090e' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <IconComponent size={14} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '1px 4px',
                      borderRadius: '3px',
                      background: isSelected ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#07090e' : 'var(--text-faint)'
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: OVERVIEW / SUPPORT LANDING HUB
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
          {/* Welcome Hub Banner */}
          <Card variant="default" style={{ padding: '28px', textAlign: 'center' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(6, 182, 212, 0.12)',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--glass-border-cyan)',
                letterSpacing: '0.05em',
                display: 'inline-block',
                marginBottom: '12px'
              }}
            >
              ARGUS SUPPORT RESOLUTION PORTAL
            </span>

            <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              How can we assist you today?
            </h2>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
              Browse policy articles for instant answers, converse with our demonstration AI assistant,
              or file a formal dispute to mobilize autonomous investigation agents across billing and carrier ledgers.
            </p>
          </Card>

          {/* Three Primary Entry Points */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}
          >
            {/* Entry 1: FAQ */}
            <div
              onClick={() => setSupportMode('faq')}
              className="ref-card"
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--status-emerald)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--status-emerald-bg)',
                    border: '1px solid var(--status-emerald-border)',
                    color: 'var(--status-emerald)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <BookOpen size={20} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    FAQ & Policies
                  </h3>
                  <Badge variant="emerald" size="xs">Self-Service</Badge>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Find quick answers to common questions on return policies, delivery times, payment methods, and account security.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--status-emerald)' }}>
                <span>Browse Policy Articles</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Entry 2: Ask ARGUS */}
            <div
              onClick={() => setSupportMode('ask')}
              className="ref-card"
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid var(--glass-border-cyan)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <Sparkles size={20} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Ask ARGUS AI
                  </h3>
                  <Badge variant="cyan" size="xs">Conversational</Badge>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Describe a problem and explore conversational guidance before filing a formal investigation case.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                <span>Chat with ARGUS</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Entry 3: Submit Complaint */}
            <div
              onClick={() => setSupportMode('complaint')}
              className="ref-card"
              style={{
                padding: '24px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--status-purple)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.25)',
                    color: 'var(--status-purple)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}
                >
                  <FilePlus size={20} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Submit Complaint
                  </h3>
                  <Badge variant="purple" size="xs">Autonomous DAG</Badge>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  Report an order, payment, delivery, product, or technical discrepancy for multi-agent DAG investigation.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--status-purple)' }}>
                <span>Start Complaint Form</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Quick Entry: My Cases Banner */}
          <Card variant="elevated" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-cyan)'
                  }}
                >
                  <Inbox size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Track Active Disputes & Historical Cases
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    View real-time status of complaints submitted during this session and previous customer orders.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setSupportMode('my-cases')}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>View My Cases</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: FAQ KNOWLEDGE BASE
          ========================================================================= */}
      {activeTab === 'faq' && (
        <SupportFaqSection
          onNavigateToAsk={() => setSupportMode('ask')}
          onNavigateToComplaint={() => setSupportMode('complaint')}
        />
      )}

      {/* =========================================================================
          VIEW 3: ASK ARGUS CONVERSATIONAL AI
          ========================================================================= */}
      {activeTab === 'ask' && (
        <AskArgusSection
          onStartComplaintWithContext={handleStartComplaintWithContext}
        />
      )}

      {/* =========================================================================
          VIEW 4: SUBMIT COMPLAINT MULTI-STEP WIZARD
          ========================================================================= */}
      {activeTab === 'complaint' && (
        <SubmitComplaintSection
          initialCategory={complaintPrefill.category}
          initialDescription={complaintPrefill.description}
          onViewCase={(id) => navigateToCase(id)}
          onViewMyCases={() => setSupportMode('my-cases')}
        />
      )}

      {/* =========================================================================
          VIEW 5: MY CASES CUSTOMER LIST
          ========================================================================= */}
      {activeTab === 'my-cases' && (
        <MyCasesSection
          onNavigateToCase={(id) => navigateToCase(id)}
          onSubmitNewComplaint={() => setSupportMode('complaint')}
        />
      )}
    </div>
  );
}
