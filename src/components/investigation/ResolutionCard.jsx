import React from 'react';
import GlassCard from '../common/GlassCard';
import {
  CheckCircle2,
  Send,
  Zap,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function ResolutionCard({ resolution, onExecute, caseStatus }) {
  if (!resolution) return null;

  const isResolved = caseStatus === 'Resolved';

  return (
    <GlassCard
      style={{
        padding: '24px',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        background: 'linear-gradient(135deg, rgba(12, 28, 22, 0.85) 0%, rgba(10, 16, 28, 0.9) 100%)',
        boxShadow: '0 0 30px rgba(16, 185, 129, 0.12)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-emerald)',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)', letterSpacing: '0.06em' }}>
              Actionable Resolution Plan
            </span>
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {resolution.headline}
            </h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Confidence Score</div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--status-emerald)' }}>
            {resolution.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Rationalization */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Autonomous Triage Rationale
        </span>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
          {resolution.reason}
        </p>
      </div>

      {/* Customer-Facing Response Draft */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
          Generated Customer Notification
        </span>
        <div
          style={{
            marginTop: '6px',
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(5, 8, 15, 0.8)',
            border: '1px solid var(--glass-border)',
            fontSize: '13px',
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
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          Automated System Interventions
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {resolution.internalActions?.map((act) => (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)',
                fontSize: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={14} color="var(--status-emerald)" />
                <span style={{ color: 'var(--text-primary)' }}>{act.title}</span>
              </div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: act.status === 'Executed' || isResolved ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 242, 254, 0.15)',
                  color: act.status === 'Executed' || isResolved ? 'var(--status-emerald)' : 'var(--accent-cyan)'
                }}
              >
                {isResolved ? 'Executed' : act.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
