import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import MetricCard from '../common/MetricCard';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import LoadingState from '../common/LoadingState';
import {
  FolderGit2,
  CheckCircle,
  Cpu,
  AlertTriangle,
  GitBranch,
  ShieldAlert,
  Network,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  Zap,
  Activity,
  Layers
} from 'lucide-react';

export default function DashboardView() {
  const { kpis, navigateToCase, navigateToSupport, setCurrentView } = useApp();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const recentCases = cases.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Platform Banner */}
      <GlassCard
        glow
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(14, 21, 37, 0.85) 0%, rgba(8, 14, 26, 0.95) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 242, 254, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 242, 254, 0.3)',
                letterSpacing: '0.06em'
              }}
            >
              MULTI-AGENT INTELLIGENCE ENGINE
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              • Core Pipeline v4.2 Active
            </span>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Autonomous Case Investigation & Support Intelligence
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            ARGUS distinguishes between simple information retrieval (Knowledge-Base FAQ) and multi-agent
            root-cause diagnosis for complex customer complaints. Specialized agents cross-verify ledgers,
            warehouse WMS, and spatial telemetry to surface contradictions and actionable resolutions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigateToSupport('faq')}
          >
            <span>FAQ Knowledge Base</span>
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigateToSupport('agent')}
          >
            <Sparkles size={16} />
            <span>Launch ARGUS Investigation</span>
          </button>
        </div>
      </GlassCard>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        <MetricCard
          title="Active Cases"
          value={kpis?.activeCases || '18'}
          subtext="Under active multi-agent triage"
          delta="+3 today"
          deltaType="neutral"
          icon={FolderGit2}
          accentColor="var(--accent-cyan)"
        />
        <MetricCard
          title="Cases Resolved"
          value={kpis?.casesResolved || '482'}
          subtext="Closed with verified root cause"
          delta="+24 this week"
          deltaType="positive"
          icon={CheckCircle}
          accentColor="var(--status-emerald)"
        />
        <MetricCard
          title="Auto-Resolved Rate"
          value={kpis?.autoResolvedRate || '86.4%'}
          subtext="Autonomous execution sans human intervention"
          delta="+4.2% MoM"
          deltaType="positive"
          icon={Zap}
          accentColor="var(--accent-cyan)"
        />
        <MetricCard
          title="Human Escalations"
          value={kpis?.humanEscalations || '12'}
          subtext="High-value or disputed thresholds"
          delta="-2 today"
          deltaType="positive"
          icon={AlertTriangle}
          accentColor="var(--status-amber)"
        />
        <MetricCard
          title="Investigations Running"
          value={kpis?.investigationsRunning || '6'}
          subtext="Billing, Order & Tech agents active"
          delta="Real-time"
          deltaType="positive"
          icon={GitBranch}
          accentColor="var(--accent-blue)"
        />
        <MetricCard
          title="Contradictions Detected"
          value={kpis?.contradictionsDetected || '9'}
          subtext="Customer statement vs System telemetry"
          delta="Audited"
          deltaType="negative"
          icon={ShieldAlert}
          accentColor="var(--status-rose)"
        />
      </div>

      {/* Main Operational Split: Active Investigations & Real-time Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left Column: Active Investigations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Active Investigations</h3>
              <span
                style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(0, 242, 254, 0.1)',
                  color: 'var(--accent-cyan)',
                  fontWeight: 600
                }}
              >
                {activeInvestigations.length} Live Pipeline
              </span>
            </div>

            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setCurrentView('cases')}
              style={{ fontSize: '12px', gap: '4px' }}
            >
              <span>View All Cases</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <LoadingState message="Loading live case investigations..." />
          ) : activeInvestigations.length === 0 ? (
            <GlassCard style={{ padding: '30px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No investigations currently running.</p>
            </GlassCard>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {activeInvestigations.map((c) => (
                <GlassCard
                  key={c.id}
                  interactive
                  onClick={() => navigateToCase(c.id)}
                  style={{
                    padding: '20px',
                    borderLeft: `3px solid ${
                      c.status === 'Contradiction Detected'
                        ? 'var(--status-rose)'
                        : 'var(--accent-cyan)'
                    }`
                  }}
                >
                  {/* Case Header Row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '13px',
                            fontWeight: 700,
                            color: 'var(--accent-cyan)'
                          }}
                        >
                          {c.id}
                        </span>
                        <StatusBadge status={c.status} size="sm" />
                        <span
                          style={{
                            fontSize: '11px',
                            padding: '2px 6px',
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {c.category}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            color: c.priority === 'Urgent' ? 'var(--status-rose)' : 'var(--status-amber)',
                            fontWeight: 600
                          }}
                        >
                          {c.priority} Priority
                        </span>
                      </div>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.title}
                      </h4>
                    </div>

                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                        {c.customer.name}
                      </span>
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {c.amount}
                      </span>
                    </div>
                  </div>

                  {/* Customer Complaint Excerpt */}
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: '14px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: '2px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    "{c.complaintText.length > 130 ? c.complaintText.substring(0, 130) + '...' : c.complaintText}"
                  </p>

                  {/* Active Agents Visualization Bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(10, 15, 28, 0.6)',
                      border: '1px solid var(--glass-border)',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
                      AGENTS:
                    </span>
                    {c.activeAgents.map(ag => (
                      <div
                        key={ag.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--glass-border)',
                          fontSize: '11px'
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background:
                              ag.status === 'completed'
                                ? 'var(--status-emerald)'
                                : ag.status === 'investigating'
                                ? 'var(--accent-cyan)'
                                : 'var(--status-amber)',
                            animation: ag.status === 'investigating' ? 'pulse-ring 1.5s infinite' : 'none'
                          }}
                        />
                        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{ag.name}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>→ {ag.status}</span>
                      </div>
                    ))}

                    <span style={{ marginLeft: 'auto', fontSize: '12px', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                      Inspect Pipeline <ArrowRight size={14} />
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: System Stream & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Agent Workflow Architecture Card */}
          <GlassCard style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Cpu size={18} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Autonomous Pipeline Architecture</h4>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Unlike single-prompt conversational bots, ARGUS uses a DAG (Directed Acyclic Graph) of
              specialized deterministic agents:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>1. Ingestion & Classification:</span>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Differentiates FAQ inquiry vs complex actionable complaint.
                </div>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(79, 172, 254, 0.05)', border: '1px solid rgba(79, 172, 254, 0.15)' }}>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>2. Parallel Specialized Agents:</span>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Billing (Ledgers), Order (Warehouse), Technical (Logs/APIs).
                </div>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.15)' }}>
                <span style={{ fontWeight: 600, color: 'var(--status-purple)' }}>3. Synthesis & Contradiction:</span>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Coordinator evaluates discrepancies without fraudulent presumption.
                </div>
              </div>

              <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
                <span style={{ fontWeight: 600, color: 'var(--status-emerald)' }}>4. Root Cause & Execution:</span>
                <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Issues verified refund, reshipment, or escalates to human specialist.
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Cross-Case Intelligence Link */}
          <GlassCard
            interactive
            onClick={() => setCurrentView('patterns')}
            style={{
              padding: '20px',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              background: 'linear-gradient(135deg, rgba(14, 21, 37, 0.8) 0%, rgba(6, 182, 212, 0.08) 100%)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Network size={18} color="var(--accent-cyan)" />
              <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Cross-Case Pattern Intelligence
              </h4>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
              ARGUS detected <strong>4 systemic patterns</strong> including seller expired product batches
              and carrier spatial drift anomalies in ZIP 98101.
            </p>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Inspect Patterns & Prevention <ArrowRight size={14} />
            </span>
          </GlassCard>
        </div>
      </div>

      {/* Recent Cases Table Section */}
      <GlassCard style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Recent Case Log</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              All incoming and historical tickets indexed across the enterprise cluster
            </p>
          </div>

          <button className="btn btn-secondary btn-sm" onClick={() => setCurrentView('cases')}>
            View Full Database
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>CASE ID</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>CUSTOMER</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>ISSUE SUMMARY</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>CATEGORY</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>PRIORITY</th>
                <th style={{ padding: '12px 14px', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '12px 14px', fontWeight: 600, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((c) => (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  onClick={() => navigateToCase(c.id)}
                >
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    {c.id}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{c.customer.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.customer.tier}</div>
                  </td>
                  <td style={{ padding: '14px', maxWidth: '340px' }}>
                    <div style={{ color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {c.title}
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    {c.category}
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: c.priority === 'Urgent' ? 'var(--status-rose)' : c.priority === 'High' ? 'var(--status-amber)' : 'var(--text-secondary)'
                      }}
                    >
                      {c.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td style={{ padding: '14px', textAlign: 'right' }}>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToCase(c.id);
                      }}
                      style={{ fontSize: '12px' }}
                    >
                      Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
