import React from 'react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import {
  CreditCard,
  Package,
  Cpu,
  GitMerge,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AgentVisualizationGraph({ caseData, onSelectAgent }) {
  const agentsData = caseData.agentsData || {};

  const getStatusColor = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('complet')) return 'var(--status-emerald)';
    if (s.includes('investigat')) return 'var(--accent-cyan)';
    if (s.includes('fail')) return 'var(--status-rose)';
    return 'var(--status-amber)';
  };

  return (
    <GlassCard style={{ padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Multi-Agent Investigation Workflow (DAG)</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Parallel diagnostic agents converge through the Coordinator to formulate the root-cause determination
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-emerald)' }} /> Completed
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-ring 1.5s infinite' }} /> Investigating
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-amber)' }} /> Waiting
          </span>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          position: 'relative'
        }}
      >
        {/* Step 1: Case Node */}
        <div
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(0, 242, 254, 0.4)',
            boxShadow: '0 0 20px rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            zIndex: 2
          }}
        >
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
            ARGUS CASE: {caseData.id} ({caseData.category})
          </span>
        </div>

        {/* Stem Line */}
        <div
          style={{
            width: '2px',
            height: '24px',
            background: 'linear-gradient(to bottom, rgba(0, 242, 254, 0.6), rgba(0, 242, 254, 0.2))'
          }}
        />

        {/* Parallel Multi-Agent Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            width: '100%',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Agent 1: Billing Agent */}
          <div
            onClick={() => onSelectAgent('billing')}
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${agentsData.billing?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border-light)'}`,
              boxShadow: agentsData.billing?.status === 'Investigating' ? '0 0 25px rgba(0, 242, 254, 0.2)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            className="glow-on-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)' }}>
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Billing Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Financial & Ledger Audit</div>
                </div>
              </div>
              <StatusBadge status={agentsData.billing?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              {agentsData.billing?.summary || 'Verifying gateway capture status and balance reserve.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.billing?.confidenceScore || 99}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 2: Order Agent */}
          <div
            onClick={() => onSelectAgent('order')}
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${agentsData.order?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border-light)'}`,
              boxShadow: agentsData.order?.status === 'Investigating' ? '0 0 25px rgba(0, 242, 254, 0.2)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            className="glow-on-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(79, 172, 254, 0.1)', color: 'var(--accent-blue)' }}>
                  <Package size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Order Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fulfillment & Inventory State</div>
                </div>
              </div>
              <StatusBadge status={agentsData.order?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              {agentsData.order?.summary || 'Inspecting warehouse fulfillment status and reserve locks.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.order?.confidenceScore || 98}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 3: Technical Agent */}
          <div
            onClick={() => onSelectAgent('tech')}
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(15, 23, 42, 0.8)',
              border: `1px solid ${agentsData.tech?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border-light)'}`,
              boxShadow: agentsData.tech?.status === 'Investigating' ? '0 0 25px rgba(0, 242, 254, 0.2)' : 'none',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            className="glow-on-hover"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.1)', color: 'var(--status-purple)' }}>
                  <Cpu size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Technical Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Event Bus & Webhook Logs</div>
                </div>
              </div>
              <StatusBadge status={agentsData.tech?.status || 'Investigating'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '12px' }}>
              {agentsData.tech?.summary || 'Inspecting edge proxies, trace IDs, and network retries.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.tech?.confidenceScore || 92}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </div>

        {/* Stem Line down to Coordinator */}
        <div
          style={{
            width: '2px',
            height: '24px',
            background: 'linear-gradient(to bottom, rgba(0, 242, 254, 0.2), rgba(139, 92, 246, 0.8))'
          }}
        />

        {/* Step 3: Coordinator / Consensus Engine */}
        <div
          onClick={() => onSelectAgent('coordinator')}
          style={{
            width: '100%',
            maxWidth: '680px',
            padding: '18px 24px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(22, 19, 44, 0.9) 0%, rgba(13, 20, 36, 0.9) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            boxShadow: '0 0 30px rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            zIndex: 2
          }}
          className="glow-on-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.15)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-purple)'
              }}
            >
              <GitMerge size={22} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Coordinator & Contradiction Engine
                </span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--status-purple)', fontWeight: 600 }}>
                  CONSENSUS 98.1%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {agentsData.coordinator?.summary || 'Consolidates multi-agent findings, checks contradictions, and prepares root cause.'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <StatusBadge status={agentsData.coordinator?.status || 'Completed'} size="sm" />
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '4px', fontWeight: 600 }}>
              Inspect Synthesis →
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
