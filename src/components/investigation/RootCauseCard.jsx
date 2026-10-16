import React from 'react';
import {
  GitCommit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  UserCheck,
  Info
} from 'lucide-react';

export default function RootCauseCard({ rootCause }) {
  if (!rootCause) return null;

  return (
    <div
      className="ref-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(168, 85, 247, 0.15)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-purple)',
              flexShrink: 0
            }}
          >
            <GitCommit size={22} />
          </div>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-purple)', letterSpacing: '0.06em' }}>
              Root Cause Diagnosis
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {rootCause.headline}
            </h3>
          </div>
        </div>

        {/* Prototype sample notice */}
        <div
          style={{
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--glass-border)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Info size={12} className="text-cyan" />
          <span>Illustrative Hypothesis (Prototype)</span>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {rootCause.summary}
      </p>

      {/* Visual Chain: Evidence -> Findings -> Root Cause */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Deterministic Diagnostic Chain (Evidence → Finding → Root Cause)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px',
            position: 'relative'
          }}
        >
          {rootCause.chain?.map((link, idx) => (
            <div
              key={idx}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                boxShadow: 'var(--glass-shadow)',
                borderLeft: `3px solid ${idx === 2 ? 'var(--status-purple)' : 'var(--accent-cyan)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: idx === 2 ? 'var(--status-purple)' : 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  {link.label}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
                  Step 0{idx + 1}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {link.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Supporting Findings & Missing Info Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {/* Supporting Findings */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)', marginBottom: '6px' }}>
            Supporting Findings
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {rootCause.supportingFindings || 'Consistent with gateway ledger idempotency keys and upstream proxy timeout traces.'}
          </p>
        </div>

        {/* Missing Information */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-amber)', marginBottom: '6px' }}>
            Missing Information
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {rootCause.missingInfo || 'Upstream payment processor internal transaction log export not yet fully reconciled.'}
          </p>
        </div>
      </div>

      {/* Impact & Review Policy Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--glass-border)',
          fontSize: '11px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} className="text-cyan" style={{ flexShrink: 0 }} />
          <span style={{ color: 'var(--text-secondary)' }}>
            <strong>System Impact: </strong>
            {rootCause.impact || 'Telemetry suggests edge network latency rather than fraudulent dispute intent.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-purple)', fontWeight: 600 }}>
          <UserCheck size={14} />
          <span>{rootCause.humanReviewRequired ? 'Human Review Sign-Off Required' : 'Eligible for Auto-Execution'}</span>
        </div>
      </div>
    </div>
  );
}
