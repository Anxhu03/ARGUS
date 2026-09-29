import React from 'react';
import GlassCard from '../common/GlassCard';
import {
  GitCommit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers
} from 'lucide-react';

export default function RootCauseCard({ rootCause }) {
  if (!rootCause) return null;

  return (
    <GlassCard
      style={{
        padding: '24px',
        border: '1px solid rgba(139, 92, 246, 0.4)',
        background: 'linear-gradient(135deg, rgba(20, 16, 38, 0.8) 0%, rgba(10, 16, 28, 0.9) 100%)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.12)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--status-purple)'
          }}
        >
          <GitCommit size={20} />
        </div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-purple)', letterSpacing: '0.06em' }}>
            Root Cause Diagnosis
          </span>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {rootCause.headline}
          </h3>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
        {rootCause.summary}
      </p>

      {/* Visual Chain: Evidence -> Findings -> Root Cause */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '10px' }}>
          Deterministic Diagnostic Chain (Evidence → Finding → Root Cause)
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '12px',
            position: 'relative'
          }}
        >
          {rootCause.chain?.map((link, idx) => (
            <div
              key={idx}
              style={{
                padding: '14px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(10, 15, 26, 0.8)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: idx === 2 ? 'var(--status-purple)' : 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  {link.label}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  Step 0{idx + 1}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {link.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* System Impact */}
      {rootCause.impact && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--glass-border)',
            fontSize: '12px',
            color: 'var(--text-muted)'
          }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>System Impact:</span>
          <span>{rootCause.impact}</span>
        </div>
      )}
    </GlassCard>
  );
}
