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
  Info,
  HelpCircle,
  FileQuestion,
  AlertTriangle
} from 'lucide-react';

export default function RootCauseCard({ rootCause }) {
  if (!rootCause) return null;

  const uncertainty = rootCause.uncertaintyLevel || 'Low';
  const isSufficient = rootCause.isSufficient !== false;
  const verifiedFacts = rootCause.verifiedFacts || [];
  const suspectedCauses = rootCause.suspectedCauses || [];
  const unresolvedQuestions = rootCause.unresolvedQuestions || [];

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-purple)', letterSpacing: '0.06em' }}>
                Deterministic Root Cause Diagnosis
              </span>
              {/* Uncertainty Indicator */}
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: uncertainty === 'Low'
                    ? 'rgba(16, 185, 129, 0.15)'
                    : uncertainty === 'Moderate'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(244, 63, 94, 0.15)',
                  color: uncertainty === 'Low'
                    ? 'var(--status-emerald)'
                    : uncertainty === 'Moderate'
                      ? 'var(--status-amber)'
                      : 'var(--status-rose)',
                  border: `1px solid ${
                    uncertainty === 'Low'
                      ? 'rgba(16, 185, 129, 0.3)'
                      : uncertainty === 'Moderate'
                        ? 'rgba(245, 158, 11, 0.3)'
                        : 'rgba(244, 63, 94, 0.3)'
                  }`
                }}
              >
                {uncertainty} Uncertainty {isSufficient ? '(Telemetry Verified)' : '(Evidence Incomplete)'}
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {rootCause.headline}
            </h3>
          </div>
        </div>

        {/* Prototype notice */}
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
          <span>Deterministic Synthesis Engine (Simulated Telemetry)</span>
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
                borderLeft: `3px solid ${idx === rootCause.chain.length - 1 ? 'var(--status-purple)' : 'var(--accent-cyan)'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: idx === rootCause.chain.length - 1 ? 'var(--status-purple)' : 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  {link.label}
                </span>
                {link.evidenceId && (
                  <span style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.1)', padding: '1px 5px', borderRadius: '3px' }}>
                    {link.evidenceId}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.45 }}>
                {link.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmed Facts vs Suspected Causes vs Unresolved Questions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
        {/* Confirmed Facts */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-emerald)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <CheckCircle2 size={13} color="var(--status-emerald)" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)' }}>
              Confirmed Facts ({verifiedFacts.length})
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {verifiedFacts.length === 0 ? (
              <li style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Awaiting telemetry fact extraction.</li>
            ) : (
              verifiedFacts.map((fact, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  • {fact}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Suspected Causes */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-purple)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <HelpCircle size={13} color="var(--status-purple)" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-purple)' }}>
              Suspected Causes ({suspectedCauses.length})
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {suspectedCauses.length === 0 ? (
              <li style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Single definitive cause isolated.</li>
            ) : (
              suspectedCauses.map((cause, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  • {cause}
                </li>
              ))
            )}
          </ul>
        </div>

        {/* Unresolved Questions */}
        <div
          style={{
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            borderTop: '3px solid var(--status-amber)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <FileQuestion size={13} color="var(--status-amber)" />
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-amber)' }}>
              Unresolved Questions ({unresolvedQuestions.length})
            </span>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {unresolvedQuestions.length === 0 ? (
              <li style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Zero unresolved questions.</li>
            ) : (
              unresolvedQuestions.map((q, idx) => (
                <li key={idx} style={{ fontSize: '11px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  • {q}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {/* Next Recommended Investigative Action Callout */}
      {rootCause.nextAction && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid var(--glass-border-cyan)',
            borderLeft: '4px solid var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowRight size={16} className="text-cyan" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
                Recommended Investigative Action
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-primary)', marginTop: '2px', fontWeight: 500 }}>
                {rootCause.nextAction}
              </div>
            </div>
          </div>
        </div>
      )}

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
          <span>{rootCause.isSufficient ? 'Eligible for Auto-Execution' : 'Human Review Required'}</span>
        </div>
      </div>
    </div>
  );
}
