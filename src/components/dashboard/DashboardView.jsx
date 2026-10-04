import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import StatusBadge from '../common/StatusBadge';
import LoadingState from '../common/LoadingState';
import Badge from '../common/Badge';
import {
  FolderGit2,
  CheckCircle2,
  Cpu,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Calendar,
  Upload,
  Clock,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  Layers,
  Info
} from 'lucide-react';

export default function DashboardView() {
  const { kpis, navigateToCase, navigateToSupport, setCurrentView, addToast } = useApp();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getCases()
      .then(data => {
        if (isMounted) {
          setCases(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const activeInvestigations = cases.filter(c => c.status === 'Investigating' || c.status === 'Contradiction Detected');
  const filteredCases = filterCategory === 'all'
    ? cases
    : filterCategory === 'active'
      ? cases.filter(c => c.status === 'Investigating' || c.status === 'Contradiction Detected')
      : filterCategory === 'contradiction'
        ? cases.filter(c => c.status === 'Contradiction Detected')
        : cases.filter(c => c.status === 'Resolved');

  // 7-Day Chart Data for Case Velocity (Mon - Sun)
  const chartDays = [
    { day: 'Mon', ingested: 42, resolved: 38, contradiction: 2, amount: '$14,200' },
    { day: 'Tue', ingested: 58, resolved: 54, contradiction: 3, amount: '$18,900' },
    { day: 'Wed', ingested: 74, resolved: 70, contradiction: 4, amount: '$26,400' },
    { day: 'Thu', ingested: 62, resolved: 59, contradiction: 1, amount: '$21,100' },
    { day: 'Fri', ingested: 89, resolved: 85, contradiction: 3, amount: '$31,800' },
    { day: 'Sat', ingested: 46, resolved: 44, contradiction: 2, amount: '$16,500' },
    { day: 'Sun', ingested: 35, resolved: 34, contradiction: 1, amount: '$12,300' }
  ];

  // Recent investigation live activity stream items
  const activityStream = [
    { id: 1, text: 'Case ARG-1042 classified as "Billing & Order Sync"', time: '2m ago', icon: FolderGit2, color: 'var(--accent-cyan)' },
    { id: 2, text: 'Billing Agent queried Stripe ledger: ch_3M4zZ8891 confirmed', time: '3m ago', icon: Cpu, color: 'var(--status-emerald)' },
    { id: 3, text: 'Carrier FastTrack e-POD with geofence retrieved for ORD-99124', time: '8m ago', icon: FileCheck2, color: 'var(--accent-cyan)' },
    { id: 4, text: 'Contradiction detected: Customer denial vs Physical delivery scan', time: '14m ago', icon: ShieldAlert, color: 'var(--status-amber)' },
    { id: 5, text: 'Root cause isolated: Ingress Kafka 504 drops on pod restart', time: '22m ago', icon: AlertCircle, color: 'var(--status-purple)' },
    { id: 6, text: 'Automated DLQ replay & voucher generated for ARG-1042', time: '35m ago', icon: CheckCircle2, color: 'var(--status-emerald)' }
  ];

  if (loading) {
    return <LoadingState message="Connecting to ARGUS Investigation Layer..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Informational Prototype Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
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
          <strong style={{ color: 'var(--accent-cyan)' }}>Phase 2 Design System Preview:</strong>{' '}
          Showing verified UI layout and design tokens. All metrics below represent simulated cluster data until live backend integration in Milestone 2.
        </span>
        <Badge variant="cyan" size="sm">Design System Active</Badge>
      </div>

      {/* 1. Subheader Row */}
      <div className="ref-subheader">
        <div className="ref-title-group">
          <h1>Operations Intelligence Overview</h1>
          <p>Autonomous customer dispute diagnostics, multi-agent evidence verification, and fraud intelligence.</p>
        </div>

        <div className="ref-subheader-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => addToast({ type: 'info', title: 'Telemetry Window', message: 'Displaying telemetry for current production week.' })}
          >
            <Calendar size={14} />
            <span>This Week</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => addToast({ type: 'info', title: 'Audit Export', message: 'Investigation traces exported to CSV/JSON format.' })}
          >
            <Upload size={14} />
            <span>Export Report</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigateToSupport('agent')}
          >
            <Sparkles size={14} />
            <span>Launch Investigation</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Metrics Cards (4 Columns) */}
      <div className="ref-metrics-grid">
        {/* Placeholder 1: Active Cases */}
        <div
          className="ref-metric-card"
          onClick={() => setCurrentView('cases')}
          title="Click to view all active cases"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Active Cases</span>
            <div className="ref-metric-icon-box">
              <FolderGit2 size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.activeCases || '24'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive">+2.4% WoW</span>
            <span style={{ color: 'var(--text-faint)' }}>• 6 incoming</span>
          </div>
        </div>

        {/* Placeholder 2: Investigation Activity / Running DAGs */}
        <div
          className="ref-metric-card"
          onClick={() => navigateToCase('ARG-1042')}
          title="Click to open active multi-agent investigation"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Investigations Running</span>
            <div className="ref-metric-icon-box" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
              <GitBranch size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.investigationsRunning || '8'}</div>
          <div className="ref-metric-trend">
            <span className="trend-neutral">Parallel DAGs Active</span>
            <span style={{ color: 'var(--text-faint)' }}>• 4 Agents/case</span>
          </div>
        </div>

        {/* Placeholder 3: Resolved Cases */}
        <div
          className="ref-metric-card"
          onClick={() => {
            setFilterCategory('resolved');
            setCurrentView('cases');
          }}
          title="Click to view resolved cases"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Resolved Cases</span>
            <div className="ref-metric-icon-box" style={{ background: 'var(--status-emerald-bg)', color: 'var(--status-emerald)' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.casesResolved || '1,429'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive">+8.4% WoW</span>
            <span style={{ color: 'var(--text-faint)' }}>• 98.4% Auto</span>
          </div>
        </div>

        {/* Placeholder 4: Human Escalations / Contradictions Flagged */}
        <div
          className="ref-metric-card"
          onClick={() => navigateToCase('ARG-1043')}
          title="Click to inspect contradiction evidence"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Human Escalations</span>
            <div className="ref-metric-icon-box" style={{ background: 'var(--status-amber-bg)', color: 'var(--status-amber)' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.contradictionsDetected || '14'}</div>
          <div className="ref-metric-trend">
            <span className="trend-warning">Neutral Conflict Guard</span>
            <span style={{ color: 'var(--text-faint)' }}>• 0 Fraud labels</span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid Row 1: 2-Column Chart + 1-Column Active Investigations */}
      <div className="ref-grid-2-1">
        {/* Left Card: Investigation Velocity & Resolution Telemetry */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Investigation Velocity & Resolution Telemetry</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  $128,450 Protected
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'var(--accent-cyan-muted)',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  +8.4% <TrendingUp size={12} />
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '4px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  color: 'var(--text-muted)'
                }}
              >
                7-Day Ingestion Volume
              </span>
            </div>
          </div>

          {/* Legend and Integrated Data Sources Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              paddingBottom: '16px',
              marginBottom: '16px',
              borderBottom: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text-faint)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ingested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Autonomous Resolved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-amber)' }} />
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contradictions Flagged</span>
              </div>
            </div>

            {/* Source Gateways */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Shopify OMS</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '3px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Stripe API</span>
              </div>
            </div>
          </div>

          {/* SVG Bar Chart with Dark Theme Colors */}
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              <line x1="0" y1="20" x2="700" y2="20" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

              {chartDays.map((item, idx) => {
                const colWidth = 700 / chartDays.length;
                const xCenter = idx * colWidth + colWidth / 2;
                const maxIngested = 100;
                
                const barIngestedHeight = (item.ingested / maxIngested) * 140;
                const barResolvedHeight = (item.resolved / maxIngested) * 140;
                const isHovered = hoveredBarIndex === idx;

                return (
                  <g
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Ingested Bar (Muted Charcoal) */}
                    <rect
                      x={xCenter - 18}
                      y={170 - barIngestedHeight}
                      width="16"
                      height={barIngestedHeight}
                      rx="3"
                      fill={isHovered ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.15)'}
                      transition="all 0.2s ease"
                    />

                    {/* Resolved Bar (Luminous Cyan) */}
                    <rect
                      x={xCenter + 2}
                      y={170 - barResolvedHeight}
                      width="16"
                      height={barResolvedHeight}
                      rx="3"
                      fill={isHovered ? 'var(--accent-cyan-hover)' : 'var(--accent-cyan)'}
                      transition="all 0.2s ease"
                    />

                    {/* Contradiction Dot */}
                    <circle
                      cx={xCenter + 10}
                      y={166 - barResolvedHeight}
                      r="3.5"
                      fill="var(--status-amber)"
                    />

                    {/* X-Axis Day Label */}
                    <text
                      x={xCenter}
                      y="190"
                      textAnchor="middle"
                      fontSize="12"
                      fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                      fontWeight={isHovered ? '700' : '500'}
                    >
                      {item.day}
                    </text>

                    {/* Hover Tooltip Overlay */}
                    {isHovered && (
                      <g>
                        <rect
                          x={xCenter - 60}
                          y={170 - barResolvedHeight - 54}
                          width="120"
                          height="44"
                          rx="6"
                          fill="var(--bg-elevated)"
                          stroke="var(--glass-border-light)"
                          filter="drop-shadow(0 4px 12px rgba(0,0,0,0.5))"
                        />
                        <text
                          x={xCenter}
                          y={170 - barResolvedHeight - 35}
                          textAnchor="middle"
                          fontSize="11"
                          fill="var(--accent-cyan)"
                          fontWeight="700"
                        >
                          {item.resolved} Resolved / {item.ingested}
                        </text>
                        <text
                          x={xCenter}
                          y={170 - barResolvedHeight - 19}
                          textAnchor="middle"
                          fontSize="10"
                          fill="var(--text-primary)"
                        >
                          {item.amount} Protected
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Right Card: Active Investigations Queue */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Active Investigations</div>
              <div className="ref-card-subtitle">{activeInvestigations.length} Live Multi-Agent Tasks</div>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentView('cases')}
              style={{ fontSize: '12px' }}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {activeInvestigations.map((c) => (
              <div
                key={c.id}
                onClick={() => navigateToCase(c.id)}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--glass-border)',
                  background: 'var(--bg-tertiary)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.id}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>• {c.category}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.amount}
                  </span>
                </div>

                <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', lineHeight: 1.35, marginBottom: '8px' }}>
                  {c.title.length > 55 ? c.title.substring(0, 55) + '...' : c.title}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {c.activeAgents?.map((ag) => (
                      <span
                        key={ag.id}
                        title={`${ag.name}: ${ag.role} (${ag.status})`}
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 5px',
                          borderRadius: 'var(--radius-xs)',
                          background: ag.status === 'completed'
                            ? 'var(--status-emerald-bg)'
                            : ag.status === 'investigating'
                              ? 'var(--accent-cyan-muted)'
                              : 'rgba(255, 255, 255, 0.06)',
                          color: ag.status === 'completed'
                            ? 'var(--status-emerald)'
                            : ag.status === 'investigating'
                              ? 'var(--accent-cyan)'
                              : 'var(--text-muted)'
                        }}
                      >
                        {ag.name.replace(' Agent', '')}
                      </span>
                    ))}
                  </div>

                  <StatusBadge status={c.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Main Grid Row 2: 1-Column Agent Swarm Overview + 2-Column Recent Cases */}
      <div className="ref-grid-1-2">
        {/* Placeholder 5: System Overview / Agent Swarm Diagnostics */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Multi-Agent Swarm Status</div>
              <div className="ref-card-subtitle">Deterministic Consensus Telemetry</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator-dot" />
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-emerald)' }}>Operational</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Billing Agent */}
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Billing Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-emerald)' }}>99.2% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Stripe charge capture & escrow validation</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-faint)' }}>
                <span>Latency: 182ms</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>v3.4.1 Active</span>
              </div>
            </div>

            {/* Order Agent */}
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Order Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-emerald)' }}>97.8% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>OMS state machine & warehouse inventory hold</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-faint)' }}>
                <span>Latency: 310ms</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>v2.8.0 Active</span>
              </div>
            </div>

            {/* Technical Agent */}
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Technical Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>92.4% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Ingress trace, Kafka message bus & DLQ diagnostics</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-faint)' }}>
                <span>Latency: 890ms</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>v4.1.2 Active</span>
              </div>
            </div>

            {/* Coordinator Engine */}
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--status-emerald-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-emerald)' }}>Coordinator Consensus</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-emerald)' }}>98.1% Score</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Weighted Bayesian consensus with non-fraud safeguard</p>
              <div style={{ fontSize: '10px', color: 'var(--status-emerald)', fontWeight: 600 }}>0 Hallucinations Recorded</div>
            </div>
          </div>
        </div>

        {/* Placeholder 6: Recent Cases & Live Audit Stream */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Recent Cases & Live Audit Stream</div>
              <div className="ref-card-subtitle">Operational dispute cases & deterministic triage log</div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
              {[
                { id: 'all', label: 'All Cases' },
                { id: 'active', label: 'Investigating' },
                { id: 'contradiction', label: 'Contradictions' },
                { id: 'resolved', label: 'Resolved' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilterCategory(f.id)}
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterCategory === f.id ? 'var(--accent-cyan)' : 'transparent',
                    color: filterCategory === f.id ? '#07090e' : 'var(--text-muted)',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Table with Dark Theme Styling */}
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Case ID</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Issue Title</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Priority</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map(c => (
                  <tr
                    key={c.id}
                    style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', cursor: 'pointer', transition: 'background var(--transition-fast)' }}
                    onClick={() => navigateToCase(c.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.id}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.customer.name}</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{c.customer.tier}</div>
                    </td>
                    <td style={{ padding: '10px 12px', maxWidth: '240px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-secondary)' }}>
                        {c.title}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px', color: 'var(--text-muted)', border: '1px solid var(--glass-border)' }}>
                        {c.category}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: c.priority === 'Critical' || c.priority === 'Urgent'
                            ? 'var(--status-rose)'
                            : c.priority === 'High'
                              ? 'var(--status-amber)'
                              : 'var(--text-muted)'
                        }}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '3px 8px', height: '26px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToCase(c.id);
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Activity Stream Feed */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="var(--text-muted)" />
              <span>Investigation Activity Feed</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
              {activityStream.map(act => {
                const IconComponent = act.icon;
                return (
                  <div
                    key={act.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={12} color={act.color} />
                    </div>
                    <span style={{ flex: 1, color: 'var(--text-secondary)', lineHeight: 1.3 }}>{act.text}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-faint)', flexShrink: 0 }}>{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
