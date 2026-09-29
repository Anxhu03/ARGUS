import React from 'react';
import GlassCard from '../common/GlassCard';
import {
  AlertTriangle,
  Scale,
  ShieldCheck,
  UserX,
  FileSearch,
  ArrowRight,
  Info
} from 'lucide-react';

export default function ContradictionCard({ contradiction }) {
  if (!contradiction) return null;

  return (
    <GlassCard
      style={{
        padding: '24px',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        background: 'linear-gradient(135deg, rgba(28, 14, 25, 0.85) 0%, rgba(15, 23, 42, 0.9) 100%)',
        boxShadow: '0 0 30px rgba(244, 63, 94, 0.12)'
      }}
    >
      {/* Banner Header with Fraud Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-rose)',
              flexShrink: 0
            }}
          >
            <Scale size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>
                {contradiction.headline || 'Contradiction Detected Between Statements and Telemetry'}
              </h3>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--status-rose-bg)',
                  border: '1px solid var(--status-rose-border)',
                  color: 'var(--status-rose)',
                  textTransform: 'uppercase'
                }}
              >
                FLAGGED FOR AUDIT
              </span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Autonomous discrepancy reconciliation active
            </div>
          </div>
        </div>

        {/* Ethical / Neutral Disclaimer Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--glass-border-light)',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}
        >
          <Info size={13} color="var(--accent-cyan)" />
          <span>Contradiction ≠ Proof of Fraud</span>
        </div>
      </div>

      {/* Discrepancy Dual Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        {/* Customer Statement */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Customer Statement
          </span>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.5 }}>
            "{contradiction.customerClaim}"
          </p>
        </div>

        {/* System Evidence */}
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(10, 15, 26, 0.7)',
            border: '1px solid rgba(0, 242, 254, 0.25)'
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
            System Recorded Evidence
          </span>
          <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.5 }}>
            {contradiction.systemEvidence}
          </p>
        </div>
      </div>

      {/* Conflicting Fields & Sources */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0, 0, 0, 0.25)',
          fontSize: '12px',
          marginBottom: '16px'
        }}
      >
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Conflicting Fields: </span>
          {contradiction.conflictFields?.map((f, i) => (
            <span
              key={i}
              style={{
                marginLeft: '4px',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: 'var(--status-rose)',
                fontWeight: 600,
                fontSize: '11px'
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <span style={{ color: 'var(--text-muted)' }}>Sources: </span>
          <strong style={{ color: 'var(--text-secondary)' }}>
            {contradiction.evidenceSources?.join(' • ')}
          </strong>
        </div>
      </div>

      {/* Synthesis Analysis & Next Step */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          <strong style={{ color: '#fff' }}>Coordinator Diagnostic Finding: </strong>
          {contradiction.analysis}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            fontSize: '12px',
            color: 'var(--accent-cyan)'
          }}
        >
          <FileSearch size={15} style={{ flexShrink: 0 }} />
          <span>
            <strong>Recommended Verification Action: </strong>
            {contradiction.recommendedStep}
          </span>
        </div>
      </div>
    </GlassCard>
  );
}
