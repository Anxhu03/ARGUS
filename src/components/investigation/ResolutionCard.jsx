import React from 'react';
import {
  CheckCircle2,
  Send,
  Zap,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  AlertTriangle,
  Info,
  ShieldAlert
} from 'lucide-react';

export default function ResolutionCard({
  resolution,
  caseStatus,
  onApprove,
  onEscalate,
  onRequestEvidence
}) {
  if (!resolution) return null;

  const isResolved = caseStatus === 'Resolved';
  const isHumanReview = caseStatus === 'Human Review';

  return (
    <div
      className="ref-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderLeft: isResolved ? '5px solid var(--status-emerald)' : '5px solid var(--accent-cyan)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
              border: `1px solid ${isResolved ? 'rgba(16, 185, 129, 0.3)' : 'var(--glass-border-cyan)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isResolved ? 'var(--status-emerald)' : 'var(--accent-cyan)',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: isResolved ? 'var(--status-emerald)' : 'var(--accent-cyan)', letterSpacing: '0.06em' }}>
                {isResolved ? 'Resolution Executed (Prototype)' : 'Actionable Resolution Plan'}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isResolved ? 'var(--status-emerald)' : 'var(--status-amber)'
                }}
              >
                {isResolved ? 'Status: Resolved' : 'Status: Pending Sign-off'}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {resolution.headline}
            </h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence Score</div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--status-emerald)' }}>
            {resolution.confidenceScore || 96}%
          </div>
        </div>
      </div>

      {/* Rationale */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Autonomous Triage Rationale
        </span>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
          {resolution.reason}
        </p>
      </div>

      {/* Customer-Facing Response Draft */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
          Generated Customer Notification Message
        </span>
        <div
          style={{
            marginTop: '6px',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            fontSize: '12px',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)'
          }}
        >
          {resolution.customerFacingMessage}
        </div>
      </div>

      {/* Internal Automated Actions */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          Automated System Interventions (Simulated Prototype Actions)
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '8px' }}>
          {resolution.automatedActions?.map((act, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                fontSize: '11px',
                color: 'var(--text-primary)'
              }}
            >
              <Zap size={14} className="text-cyan" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 500 }}>{act}</span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                  color: isResolved ? 'var(--status-emerald)' : 'var(--accent-cyan)'
                }}
              >
                {isResolved ? 'EXECUTED' : 'READY'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Prototype disclaimer notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-sm)',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--glass-border)',
          fontSize: '11px',
          color: 'var(--text-faint)'
        }}
      >
        <Info size={13} className="text-cyan" style={{ flexShrink: 0 }} />
        <span>
          <strong>Demonstration Notice: </strong>
          Approving this resolution updates the local case lifecycle in ARGUS. No real payment processor refunds, chargebacks, or external carrier claims are transmitted.
        </span>
      </div>

      {/* Interactive Action Buttons */}
      {!isResolved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '8px', borderTop: '1px solid var(--glass-border)' }}>
          <button
            className="btn btn-primary btn-sm"
            style={{ height: '36px', padding: '0 16px', gap: '6px' }}
            onClick={onApprove}
          >
            <CheckCircle2 size={14} />
            <span>Approve & Mark Resolved (Prototype)</span>
          </button>

          {!isHumanReview && (
            <button
              className="btn btn-secondary btn-sm"
              style={{ height: '36px', padding: '0 14px', gap: '6px', color: 'var(--status-amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
              onClick={onEscalate}
            >
              <AlertTriangle size={14} />
              <span>Escalate to Human Review</span>
            </button>
          )}

          <button
            className="btn btn-secondary btn-sm"
            style={{ height: '36px', padding: '0 14px', gap: '6px' }}
            onClick={onRequestEvidence}
          >
            <Clock size={14} />
            <span>Request Additional Evidence</span>
          </button>
        </div>
      )}
    </div>
  );
}
