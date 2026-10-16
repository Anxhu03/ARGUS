import React from 'react';
import {
  AlertTriangle,
  Scale,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  FileSearch,
  ArrowRight,
  Info,
  Layers,
  FileCheck2,
  FileQuestion,
  FileX
} from 'lucide-react';

export default function ContradictionCard({ contradiction, findings }) {
  const verifiedFacts = findings?.verifiedFacts || [];
  const unverifiedClaims = findings?.unverifiedClaims || [];
  const supportingEvidence = findings?.supportingEvidence || [];
  const missingInfo = findings?.missingInfo || [];
  const confidenceStatus = findings?.confidenceStatus || 'High Confidence (Telemetry Verified)';

  return (
    <div
      className="ref-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* Banner Header with Fraud Safeguard Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-amber)',
              flexShrink: 0
            }}
          >
            <Scale size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Findings, Telemetry Facts & Contradictions
              </h3>
              {contradiction && (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--status-amber)',
                    textTransform: 'uppercase'
                  }}
                >
                  DISCREPANCY FLAGGED
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Structured empirical evidence reconciliation across multi-agent audit streams
            </div>
          </div>
        </div>

        {/* Ethical / Neutral Disclaimer Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            fontSize: '12px',
            color: 'var(--status-amber)',
            fontWeight: 600
          }}
        >
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Contradiction ≠ Proof of Fraud</span>
        </div>
      </div>

      {/* Discrepancy Dual Comparison Grid (When Contradiction is present) */}
      {contradiction && (
        <div
          style={{
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.05)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderLeft: '4px solid var(--status-amber)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {contradiction.headline || 'Contradiction Detected Between Statements and Telemetry'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {/* Customer Statement */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderLeft: '3px solid var(--text-muted)'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                Customer Statement
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.5, fontWeight: 500 }}>
                "{contradiction.customerClaim}"
              </p>
            </div>

            {/* System Recorded Evidence */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderLeft: '3px solid var(--accent-cyan)'
              }}
            >
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.05em' }}>
                System Recorded Evidence
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '6px', lineHeight: 1.5, fontWeight: 500 }}>
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
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              fontSize: '11px'
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
                    borderRadius: '4px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--status-amber)',
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
              <strong style={{ color: 'var(--text-primary)' }}>
                {contradiction.evidenceSources?.join(' • ')}
              </strong>
            </div>
          </div>

          {/* Synthesis Analysis */}
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--status-amber)' }}>Coordinator Diagnostic Finding: </strong>
            {contradiction.analysis}
          </div>
        </div>
      )}

      {/* Structured Multi-Area Findings Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {/* Verified Facts */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-emerald)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle2 size={15} color="var(--status-emerald)" />
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)', letterSpacing: '0.04em' }}>
              Verified Facts ({verifiedFacts.length})
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
            {verifiedFacts.map((fact, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ color: 'var(--status-emerald)', fontWeight: 700 }}>•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unverified Claims */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-amber)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <HelpCircle size={15} color="var(--status-amber)" />
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-amber)', letterSpacing: '0.04em' }}>
              Unverified Claims ({unverifiedClaims.length})
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
            {unverifiedClaims.map((claim, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ color: 'var(--status-amber)', fontWeight: 700 }}>•</span>
                <span>{claim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Supporting Evidence */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--accent-cyan)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <FileCheck2 size={15} className="text-cyan" />
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.04em' }}>
              Supporting Evidence ({supportingEvidence.length})
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
            {supportingEvidence.map((ev, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>•</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Information & Ambiguities */}
        <div
          style={{
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-purple)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <FileQuestion size={15} color="var(--status-purple)" />
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-purple)', letterSpacing: '0.04em' }}>
              Missing Information ({missingInfo.length})
            </h4>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
            {missingInfo.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'flex-start'
                }}
              >
                <span style={{ color: 'var(--status-purple)', fontWeight: 700 }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: Verification Status & Disclaimer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--glass-border)',
          fontSize: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={15} color="var(--status-emerald)" />
          <span style={{ color: 'var(--text-muted)' }}>Confidence Status: </span>
          <strong style={{ color: 'var(--text-primary)' }}>{confidenceStatus}</strong>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
          Assumptions clearly segregated from verified cryptographic traces
        </div>
      </div>
    </div>
  );
}
