import React from 'react';
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
  ExternalLink,
  ShieldCheck,
  Binary,
  Info
} from 'lucide-react';

export default function AgentVisualizationGraph({ caseData, onSelectAgent }) {
  const agentsData = caseData.agentsData || {};

  return (
    <div className="ref-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} className="text-cyan" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Multi-Agent Investigation Workflow (DAG)
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Parallel diagnostic agents converge through the Coordinator to formulate the root-cause determination
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid var(--glass-border-cyan)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Info size={12} className="text-cyan" />
            <span>Demonstration Activity</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--status-emerald)' }} /> Completed
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-cyan)', animation: 'pulse-ring 1.5s infinite' }} /> Investigating
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--status-amber)' }} /> Queued
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative'
        }}
      >
        {/* Step 1: Ingestion Node */}
        <div
          style={{
            padding: '8px 24px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border-cyan)',
            boxShadow: 'var(--accent-glow-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 2,
            color: 'var(--text-primary)'
          }}
        >
          <Sparkles size={14} className="text-cyan" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
            ARGUS INGESTION: {caseData.id} • {caseData.category}
          </span>
        </div>

        {/* Stem Line down */}
        <div
          style={{
            width: '2px',
            height: '20px',
            background: 'var(--glass-border-cyan)'
          }}
        />

        {/* Step 2: Parallel 4-Agent Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            width: '100%',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Agent 1: Billing Agent */}
          <div
            onClick={() => onSelectAgent('billing')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: `1px solid ${agentsData.billing?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
              boxShadow: 'var(--glass-shadow)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.billing?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)' }}>
                  <CreditCard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Billing Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Financial & Ledger Audit</div>
                </div>
              </div>
              <StatusBadge status={agentsData.billing?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.billing?.summary || 'Verifying gateway capture status and balance reserve.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.billing?.confidenceScore || 99}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Inspect Telemetry <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 2: Order Agent */}
          <div
            onClick={() => onSelectAgent('order')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: `1px solid ${agentsData.order?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
              boxShadow: 'var(--glass-shadow)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.order?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
                  <Package size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Order Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fulfillment & Inventory State</div>
                </div>
              </div>
              <StatusBadge status={agentsData.order?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.order?.summary || 'Inspecting warehouse fulfillment status and reserve locks.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.order?.confidenceScore || 98}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Inspect Telemetry <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 3: Technical Agent */}
          <div
            onClick={() => onSelectAgent('tech')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: `1px solid ${agentsData.tech?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
              boxShadow: 'var(--glass-shadow)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.tech?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--status-purple)' }}>
                  <Cpu size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Technical Agent</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Event Bus & Webhook Logs</div>
                </div>
              </div>
              <StatusBadge status={agentsData.tech?.status || 'Investigating'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.tech?.summary || 'Inspecting edge proxies, trace IDs, and network retries.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.tech?.confidenceScore || 92}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Inspect Telemetry <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 4: Evidence Verification Agent */}
          <div
            onClick={() => onSelectAgent('evidence_verifier')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: `1px solid ${agentsData.evidence_verifier?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
              boxShadow: 'var(--glass-shadow)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.background = 'var(--bg-surface-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.evidence_verifier?.status === 'Investigating' ? 'var(--accent-cyan)' : 'var(--glass-border)';
              e.currentTarget.style.background = 'var(--bg-surface)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)' }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>Evidence Verification</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Cryptographic Hash Attestation</div>
                </div>
              </div>
              <StatusBadge status={agentsData.evidence_verifier?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.evidence_verifier?.summary || 'Validates SHA-256 evidence digests and carrier geolocation timestamps.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>
                Confidence: <strong style={{ color: 'var(--status-emerald)' }}>{agentsData.evidence_verifier?.confidenceScore || 99}%</strong>
              </span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Inspect Telemetry <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </div>

        {/* Stem Line down to Coordinator */}
        <div
          style={{
            width: '2px',
            height: '20px',
            background: 'var(--glass-border-cyan)'
          }}
        />

        {/* Step 3: Coordinator / Consensus Engine Node */}
        <div
          onClick={() => onSelectAgent('coordinator')}
          style={{
            width: '100%',
            maxWidth: '720px',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border-cyan)',
            boxShadow: 'var(--glass-shadow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-cyan)';
            e.currentTarget.style.background = 'var(--bg-surface-hover)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-border-cyan)';
            e.currentTarget.style.background = 'var(--bg-tertiary)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.15)',
                border: '1px solid var(--glass-border-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                flexShrink: 0
              }}
            >
              <GitMerge size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Investigation Coordinator & Consensus Engine
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: 'rgba(6, 182, 212, 0.15)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 600,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  CONSENSUS 98.1%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
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
    </div>
  );
}
