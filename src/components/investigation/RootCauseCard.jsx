import React from 'react';
import {
  GitCommit,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';

export default function RootCauseCard({ rootCause }) {
  if (!rootCause) return null;

  return (
    <div
      className="ref-card"
      style={{
        padding: '22px 24px',
        border: '1px solid #e9d5ff',
        background: '#faf5ff',
        borderLeft: '5px solid #7e22ce'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: '#f3e8ff',
            border: '1px solid #e9d5ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#7e22ce'
          }}
        >
          <GitCommit size={20} />
        </div>
        <div>
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#7e22ce', letterSpacing: '0.06em' }}>
            Root Cause Diagnosis
          </span>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#581c87', marginTop: '2px' }}>
            {rootCause.headline}
          </h3>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: '#4c1d95', lineHeight: 1.6, marginBottom: '18px' }}>
        {rootCause.summary}
      </p>

      {/* Visual Chain: Evidence -> Findings -> Root Cause */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#6b21a8', letterSpacing: '0.05em', marginBottom: '8px' }}>
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
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid #e9d5ff',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: idx === 2 ? '#7e22ce' : '#0284c7', textTransform: 'uppercase' }}>
                  {link.label}
                </span>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                  Step 0{idx + 1}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#1e293b', lineHeight: 1.4 }}>
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
            padding: '10px 14px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #e9d5ff',
            fontSize: '11px',
            color: '#6b21a8',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Cpu size={14} color="#7e22ce" style={{ flexShrink: 0 }} />
          <span>
            <strong>System Impact: </strong>
            {rootCause.impact}
          </span>
        </div>
      )}
    </div>
  );
}
