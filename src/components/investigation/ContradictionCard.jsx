import React from 'react';
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
    <div
      className="ref-card"
      style={{
        padding: '22px 24px',
        border: '1px solid #fed7aa',
        background: '#fff7ed',
        borderLeft: '5px solid #ea580c'
      }}
    >
      {/* Banner Header with Fraud Safeguard Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#ffedd5',
              border: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ea580c',
              flexShrink: 0
            }}
          >
            <Scale size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#9a3412' }}>
                {contradiction.headline || 'Contradiction Detected Between Statements and Telemetry'}
              </h3>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: '#ffedd5',
                  border: '1px solid #fed7aa',
                  color: '#ea580c',
                  textTransform: 'uppercase'
                }}
              >
                FLAGGED FOR AUDIT
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#c2410c', marginTop: '2px' }}>
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
            padding: '5px 12px',
            borderRadius: '9999px',
            background: '#ffffff',
            border: '1px solid #fed7aa',
            fontSize: '11px',
            color: '#7c2d12',
            fontWeight: 600
          }}
        >
          <Info size={13} color="#ea580c" />
          <span>Contradiction ≠ Proof of Fraud</span>
        </div>
      </div>

      {/* Discrepancy Dual Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '14px' }}>
        {/* Customer Statement */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderLeft: '3px solid #94a3b8'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em' }}>
            Customer Statement
          </span>
          <p style={{ fontSize: '12px', color: '#0f172a', marginTop: '6px', lineHeight: 1.5, fontWeight: 500 }}>
            "{contradiction.customerClaim}"
          </p>
        </div>

        {/* System Evidence */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #fed7aa',
            borderLeft: '3px solid #0284c7'
          }}
        >
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#0284c7', letterSpacing: '0.05em' }}>
            System Recorded Evidence
          </span>
          <p style={{ fontSize: '12px', color: '#0f172a', marginTop: '6px', lineHeight: 1.5, fontWeight: 500 }}>
            {contradiction.systemEvidence}
          </p>
        </div>
      </div>

      {/* Conflicting Fields & Sources */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '14px',
          alignItems: 'center',
          padding: '10px 14px',
          borderRadius: '6px',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          fontSize: '11px',
          marginBottom: '14px'
        }}
      >
        <div>
          <span style={{ color: '#64748b' }}>Conflicting Fields: </span>
          {contradiction.conflictFields?.map((f, i) => (
            <span
              key={i}
              style={{
                marginLeft: '4px',
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#ffedd5',
                border: '1px solid #fed7aa',
                color: '#ea580c',
                fontWeight: 600,
                fontSize: '11px'
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <div style={{ marginLeft: 'auto' }}>
          <span style={{ color: '#64748b' }}>Sources: </span>
          <strong style={{ color: '#0f172a' }}>
            {contradiction.evidenceSources?.join(' • ')}
          </strong>
        </div>
      </div>

      {/* Synthesis Analysis & Next Step */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '12px', color: '#7c2d12', lineHeight: 1.5 }}>
          <strong style={{ color: '#9a3412' }}>Coordinator Diagnostic Finding: </strong>
          {contradiction.analysis}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '6px',
            background: '#ffffff',
            border: '1px solid #fed7aa',
            fontSize: '12px',
            color: '#c2410c'
          }}
        >
          <FileSearch size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>Recommended Verification Action: </strong>
            {contradiction.recommendedStep}
          </span>
        </div>
      </div>
    </div>
  );
}
