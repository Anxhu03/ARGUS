import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import StatusBadge from '../common/StatusBadge';
import LoadingState from '../common/LoadingState';
import {
  FolderGit2,
  CheckCircle2,
  Cpu,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Calendar,
  Upload,
  Clock,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Layers,
  FileCheck2,
  Check,
  TrendingUp,
  AlertCircle
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

  // Daily Chart Data for Case Velocity (Mon - Sun)
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
    { id: 1, type: 'classified', text: 'Case ARG-1042 classified as "Billing & Order Sync"', time: '2m ago', icon: FolderGit2, color: '#0284c7' },
    { id: 2, type: 'agent_start', text: 'Billing Agent queried Stripe ledger: ch_3M4zZ8891 confirmed', time: '3m ago', icon: Cpu, color: '#16a34a' },
    { id: 3, type: 'evidence', text: 'Carrier FastTrack e-POD with geofence retrieved for ORD-99124', time: '8m ago', icon: FileCheck2, color: '#0284c7' },
    { id: 4, type: 'contradiction', text: 'Contradiction detected: Customer denial vs Physical delivery scan', time: '14m ago', icon: ShieldAlert, color: '#ea580c' },
    { id: 5, type: 'root_cause', text: 'Root cause isolated: Ingress Kafka 504 drops on pod restart', time: '22m ago', icon: AlertCircle, color: '#7e22ce' },
    { id: 6, type: 'resolution', text: 'Automated DLQ replay & refund voucher generated for ARG-1042', time: '35m ago', icon: CheckCircle2, color: '#16a34a' },
    { id: 7, type: 'escalation', text: 'Human specialist review requested: High-value enterprise tier', time: '1h ago', icon: AlertTriangle, color: '#ea580c' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Subheader Row matching Reference */}
      <div className="ref-subheader">
        <div className="ref-title-group">
          <h1>Welcome, Operations Lead 👋</h1>
          <p>AI-powered customer-support investigation, multi-agent dispute diagnostics, and fraud intelligence platform.</p>
        </div>

        <div className="ref-subheader-actions">
          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '6px', gap: '6px', height: '36px' }}
            onClick={() => addToast({ type: 'info', title: 'Date Filter', message: 'Displaying telemetry for current production week.' })}
          >
            <Calendar size={14} />
            <span>This Week</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '6px', gap: '6px', height: '36px' }}
            onClick={() => addToast({ type: 'info', title: 'Audit Report Exported', message: 'Deterministic trace logs exported to CSV/JSON.' })}
          >
            <Upload size={14} />
            <span>Export Report</span>
          </button>

          <button
            className="btn btn-primary btn-sm"
            style={{ borderRadius: '6px', gap: '6px', height: '36px' }}
            onClick={() => navigateToSupport('agent')}
          >
            <Sparkles size={14} />
            <span>Launch Investigation</span>
          </button>
        </div>
      </div>

      {/* 2. Overview Metrics Cards matching Reference (4 columns) */}
      <div className="ref-metrics-grid">
        {/* Card 1: Active Cases */}
        <div
          className="ref-metric-card"
          onClick={() => setCurrentView('cases')}
          title="Click to view all cases"
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
            <span style={{ color: '#94a3b8' }}>• 6 incoming</span>
          </div>
        </div>

        {/* Card 2: Investigations Running */}
        <div
          className="ref-metric-card"
          onClick={() => navigateToCase('ARG-1042')}
          title="Click to open active multi-agent investigation"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Investigations Running</span>
            <div className="ref-metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <GitBranch size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.investigationsRunning || '8'}</div>
          <div className="ref-metric-trend">
            <span className="trend-neutral">Parallel DAGs Active</span>
            <span style={{ color: '#94a3b8' }}>• 4 Agents/case</span>
          </div>
        </div>

        {/* Card 3: Resolved Cases */}
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
            <div className="ref-metric-icon-box" style={{ background: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.casesResolved || '1,429'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive">+8.4% WoW</span>
            <span style={{ color: '#94a3b8' }}>• 98.4% Auto</span>
          </div>
        </div>

        {/* Card 4: Contradictions Detected */}
        <div
          className="ref-metric-card"
          onClick={() => navigateToCase('ARG-1043')}
          title="Click to inspect contradiction evidence"
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Contradictions Detected</span>
            <div className="ref-metric-icon-box" style={{ background: '#ffedd5', color: '#ea580c' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpis?.contradictionsDetected || '14'}</div>
          <div className="ref-metric-trend">
            <span className="trend-warning">Neutral Conflict Guard</span>
            <span style={{ color: '#94a3b8' }}>• 0 Fraud labels</span>
          </div>
        </div>
      </div>

      {/* 3. Main Grid Row 1: 2-Column Chart + 1-Column Active Investigations */}
      <div className="ref-grid-2-1">
        {/* Left Card (2 cols): Investigation Velocity & Resolution Telemetry */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Investigation Velocity & Resolution Telemetry</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>
                  $128,450 Protected
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#e0f2fe',
                    color: '#0284c7',
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
                  borderRadius: '6px',
                  background: '#f8fafc',
                  border: '1px solid var(--border)',
                  color: '#64748b'
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
              borderBottom: '1px solid var(--border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }}></span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Total Ingested</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }}></span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Autonomous Resolved</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ea580c' }}></span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Contradictions Flagged</span>
              </div>
            </div>

            {/* Source Gateways */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#dbeafe', color: '#1d4ed8', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Shopify OMS</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>400 Syncs</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ width: '16px', height: '16px', borderRadius: '4px', background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#334155' }}>Stripe API</span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>206 Audits</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Bar Chart matching Rexora aesthetics */}
          <div style={{ height: '220px', width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 700 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
              {/* Background Grid Lines */}
              <line x1="0" y1="20" x2="700" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="700" y2="70" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="700" y2="120" stroke="#f1f5f9" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="700" y2="170" stroke="#e2e8f0" strokeWidth="1" />

              {/* Render Bars for each day */}
              {chartDays.map((item, idx) => {
                const colWidth = 700 / chartDays.length;
                const xCenter = idx * colWidth + colWidth / 2;
                const maxIngested = 100;
                
                // Heights
                const barIngestedHeight = (item.ingested / maxIngested) * 140;
                const barResolvedHeight = (item.resolved / maxIngested) * 140;
                const barContradictionHeight = (item.contradiction / 10) * 40;

                const isHovered = hoveredBarIndex === idx;

                return (
                  <g
                    key={item.day}
                    onMouseEnter={() => setHoveredBarIndex(idx)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Ingested Bar (gray) */}
                    <rect
                      x={xCenter - 18}
                      y={170 - barIngestedHeight}
                      width="16"
                      height={barIngestedHeight}
                      rx="3"
                      fill={isHovered ? '#64748b' : '#cbd5e1'}
                      transition="all 0.2s ease"
                    />

                    {/* Resolved Bar (cyan/accent) */}
                    <rect
                      x={xCenter + 2}
                      y={170 - barResolvedHeight}
                      width="16"
                      height={barResolvedHeight}
                      rx="3"
                      fill={isHovered ? '#0284c7' : '#38bdf8'}
                      transition="all 0.2s ease"
                    />

                    {/* Contradiction indicator dot */}
                    <circle
                      cx={xCenter + 10}
                      y={166 - barResolvedHeight}
                      r="3.5"
                      fill="#ea580c"
                    />

                    {/* X-Axis Day Label */}
                    <text
                      x={xCenter}
                      y="190"
                      textAnchor="middle"
                      fontSize="12"
                      fill={isHovered ? '#0f172a' : '#64748b'}
                      fontWeight={isHovered ? '700' : '500'}
                    >
                      {item.day}
                    </text>

                    {/* Hover Tooltip Overlay */}
                    {isHovered && (
                      <g>
                        <rect
                          x={xCenter - 55}
                          y={170 - barResolvedHeight - 50}
                          width="110"
                          height="42"
                          rx="6"
                          fill="#0f172a"
                          opacity="0.95"
                          filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))"
                        />
                        <text
                          x={xCenter}
                          y={170 - barResolvedHeight - 33}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#38bdf8"
                          fontWeight="700"
                        >
                          {item.resolved} Resolved / {item.ingested}
                        </text>
                        <text
                          x={xCenter}
                          y={170 - barResolvedHeight - 18}
                          textAnchor="middle"
                          fontSize="9"
                          fill="#ffffff"
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

        {/* Right Card (1 col): Active Investigations Queue */}
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
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  background: '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#0284c7';
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: '#0284c7' }}>
                      {c.id}
                    </span>
                    <span style={{ fontSize: '10px', color: '#64748b' }}>• {c.category}</span>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600, color: '#0f172a' }}>
                    {c.amount}
                  </span>
                </div>

                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', lineHeight: 1.35, marginBottom: '8px' }}>
                  {c.title.length > 55 ? c.title.substring(0, 55) + '...' : c.title}
                </p>

                {/* Agents participating */}
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
                          borderRadius: '4px',
                          background: ag.status === 'completed' ? '#dcfce7' : ag.status === 'investigating' ? '#e0f2fe' : '#f1f5f9',
                          color: ag.status === 'completed' ? '#15803d' : ag.status === 'investigating' ? '#0284c7' : '#64748b'
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

      {/* 4. Main Grid Row 2: 1-Column Agent Swarm Diagnostics + 2-Column Recent Cases & Audit Stream */}
      <div className="ref-grid-1-2">
        {/* Left Card (1 col): Agent Swarm Diagnostics */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Agent Swarm Diagnostics</div>
              <div className="ref-card-subtitle">Deterministic Consensus Telemetry</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span className="pulse-indicator-dot"></span>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>Healthy</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Billing Agent */}
            <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Billing Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>99.2% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Stripe charge capture & escrow validation</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>Latency: 182ms</span>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>v3.4.1 Active</span>
              </div>
            </div>

            {/* Order Agent */}
            <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Order Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a' }}>97.8% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>OMS state machine & warehouse inventory hold</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>Latency: 310ms</span>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>v2.8.0 Active</span>
              </div>
            </div>

            {/* Technical Agent */}
            <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Technical Agent</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0284c7' }}>92.4% Conf</span>
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>Ingress trace, Kafka message bus & DLQ diagnostics</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8' }}>
                <span>Latency: 890ms</span>
                <span style={{ color: '#0284c7', fontWeight: 600 }}>v4.1.2 Active</span>
              </div>
            </div>

            {/* Coordinator Engine */}
            <div style={{ padding: '12px', borderRadius: '8px', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803d' }}>Coordinator Consensus</span>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d' }}>98.1% Score</span>
              </div>
              <p style={{ fontSize: '11px', color: '#166534', marginBottom: '4px' }}>Weighted Bayesian consensus with non-fraud safeguard</p>
              <div style={{ fontSize: '10px', color: '#15803d', fontWeight: 600 }}>0 Hallucinations Recorded</div>
            </div>
          </div>
        </div>

        {/* Right Card (2 cols): Recent Cases & Live Audit Stream */}
        <div className="ref-card">
          <div className="ref-card-header">
            <div>
              <div className="ref-card-title">Recent Cases & Live Audit Stream</div>
              <div className="ref-card-subtitle">Operational case queue & deterministic triage log</div>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
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
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: filterCategory === f.id ? '#ffffff' : 'transparent',
                    color: filterCategory === f.id ? '#0f172a' : '#64748b',
                    boxShadow: filterCategory === f.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cases Table */}
          <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: '#64748b' }}>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Case ID</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '8px 12px', fontWeight: 600 }}>Issue</th>
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
                    style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.15s ease' }}
                    onClick={() => navigateToCase(c.id)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>
                      {c.id}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{c.customer.name}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>{c.customer.tier}</div>
                    </td>
                    <td style={{ padding: '10px 12px', maxWidth: '240px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#334155' }}>
                        {c.title}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '10px', padding: '2px 6px', background: '#f1f5f9', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>
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
                            ? '#dc2626'
                            : c.priority === 'High'
                              ? '#ea580c'
                              : '#64748b'
                        }}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '4px 8px' }}
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

          {/* Investigation Activity Stream Timeline */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={14} color="#64748b" />
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
                      borderRadius: '6px',
                      background: '#f8fafc',
                      border: '1px solid var(--border)',
                      fontSize: '11px'
                    }}
                  >
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#ffffff', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconComponent size={12} color={act.color} />
                    </div>
                    <span style={{ flex: 1, color: '#334155', lineHeight: 1.3 }}>{act.text}</span>
                    <span style={{ fontSize: '10px', color: '#94a3b8', flexShrink: 0 }}>{act.time}</span>
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
