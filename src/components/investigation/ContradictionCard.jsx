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
  FileX,
  Hash
} from 'lucide-react';

export default function ContradictionCard({ contradiction, findings }) {
  const verifiedFacts = findings?.verifiedFacts || [];
  const unverifiedClaims = findings?.unverifiedClaims || [];
  const supportingEvidence = findings?.supportingEvidence || [];
  const missingInfo = findings?.missingInfo || [];
  const confidenceStatus = findings?.confidenceStatus || 'High Confidence (Telemetry Corroborated)';

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
              background: contradiction ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
              border: `1px solid ${contradiction ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: contradiction ? 'var(--status-amber)' : 'var(--status-emerald)',
              flexShrink: 0
            }}
          >
            {contradiction ? <Scale size={20} /> : <CheckCircle2 size={20} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Findings, Telemetry Facts & Contradictions
              </h3>
              {contradiction ? (
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
              ) : (
                <span
                  style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: 'var(--status-emerald)',
                    textTransform: 'uppercase'
                  }}
                >
                  ZERO CONTRADICTIONS
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Deterministic evidence reconciliation across multi-agent audit streams
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
            background: contradiction ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${contradiction ? 'rgba(245, 158, 11, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
            fontSize: '12px',
            color: contradiction ? 'var(--status-amber)' : 'var(--status-emerald)',
            fontWeight: 600
          }}
        >
          <Info size={14} style={{ flexShrink: 0 }} />
          <span>Contradiction ≠ Proof of Fraud</span>
        </div>
      </div>

      {/* Discrepancy Dual Comparison Grid (When Contradiction is present) */}
      {contradiction ? (
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

          {/* Conflicting Fields, Conflicting Evidence IDs & Sources */}
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

            {/* Conflicting Evidence IDs */}
            {contradiction.conflictingEvidenceIds && contradiction.conflictingEvidenceIds.length > 0 && (
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Artifact IDs: </span>
                {contradiction.conflictingEvidenceIds.map((cid, i) => (
                  <span
                    key={i}
                    style={{
                      marginLeft: '4px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      border: '1px solid var(--glass-border-cyan)',
                      color: 'var(--accent-cyan)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px'
                    }}
                  >
                    {cid}
                  </span>
                ))}
              </div>
            )}

            <div style={{ marginLeft: 'auto' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sources: </span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {contradiction.evidenceSources?.join(' • ')}
              </strong>
            </div>
          </div>

          {/* Synthesis Analysis & Suggested Action */}
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--status-amber)' }}>Empirical Diagnostic Analysis: </strong>
            {contradiction.analysis}
          </div>

          {contradiction.recommendedStep && (
            <div
              style={{
                fontSize: '11px',
                color: 'var(--accent-cyan)',
                background: 'rgba(6, 182, 212, 0.08)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--glass-border-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ArrowRight size={13} />
              <span><strong>Next Investigative Action: </strong>{contradiction.recommendedStep}</span>
            </div>
          )}
        </div>
      ) : (
        /* Zero Contradictions State */
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderLeft: '4px solid var(--status-emerald)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <CheckCircle2 size={18} color="var(--status-emerald)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
            <strong>Empirical Consensus Verified: </strong>
            Customer statements and multi-agent gateway records align with zero technical discrepancies.
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
          {verifiedFacts.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Awaiting telemetry fact extraction.</p>
          ) : (
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
          )}
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
          {unverifiedClaims.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>All claims corroborated by technical records.</p>
          ) : (
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
          )}
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
          {supportingEvidence.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>No supporting evidence linked yet.</p>
          ) : (
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
          )}
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
              Missing Information & Questions ({missingInfo.length})
            </h4>
          </div>
          {missingInfo.length === 0 ? (
            <p style={{ fontSize: '12px', color: 'var(--text-faint)' }}>Zero missing telemetry fields.</p>
          ) : (
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
          )}
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
