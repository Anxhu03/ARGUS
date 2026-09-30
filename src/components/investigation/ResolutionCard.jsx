import React from 'react';
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
    <div
      className="ref-card"
      style={{
        padding: '22px 24px',
        border: '1px solid #bbf7d0',
        background: '#f0fdf4',
        borderLeft: '5px solid #16a34a'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#dcfce7',
              border: '1px solid #bbf7d0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#15803d',
              flexShrink: 0
            }}
          >
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#15803d', letterSpacing: '0.06em' }}>
              Actionable Resolution Plan
            </span>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#14532d', marginTop: '2px' }}>
              {resolution.headline}
            </h3>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#64748b' }}>Confidence Score</div>
          <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#15803d' }}>
            {resolution.confidenceScore}%
          </div>
        </div>
      </div>

      {/* Rationalization */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#166534' }}>
          Autonomous Triage Rationale
        </span>
        <p style={{ fontSize: '12px', color: '#1e293b', marginTop: '4px', lineHeight: 1.5 }}>
          {resolution.reason}
        </p>
      </div>

      {/* Customer-Facing Response Draft */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#0284c7' }}>
          Generated Customer Notification
        </span>
        <div
          style={{
            marginTop: '6px',
            padding: '12px 14px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #bbf7d0',
            fontSize: '12px',
            color: '#0f172a',
            lineHeight: 1.6,
            fontFamily: 'var(--font-body)'
          }}
        >
          {resolution.customerFacingMessage}
        </div>
      </div>

      {/* Internal Automated Actions */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#166534', marginBottom: '8px', display: 'block' }}>
          Automated System Interventions
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
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #bbf7d0',
                fontSize: '11px',
                color: '#14532d'
              }}
            >
              <Zap size={14} color="#16a34a" style={{ flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 500 }}>{act}</span>
              <span style={{ fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '4px', background: '#dcfce7', color: '#15803d' }}>
                READY
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
