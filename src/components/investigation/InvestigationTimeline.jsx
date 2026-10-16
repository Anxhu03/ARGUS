import React from 'react';
import { Check, Clock, CircleDot, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function InvestigationTimeline({ timeline = [] }) {
  const completedCount = timeline.filter(t => t.status === 'completed').length;

  return (
    <div className="ref-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} className="text-cyan" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Deterministic Investigation Lifecycle
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Deterministic 9-stage sequence from complaint ingestion to resolution verification
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.12)',
              border: '1px solid var(--glass-border-cyan)',
              color: 'var(--accent-cyan)',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)'
            }}
          >
            {completedCount} / {timeline.length} Stages Completed
          </span>
          <span
            style={{
              fontSize: '10px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.06)',
              color: 'var(--text-muted)',
              border: '1px solid var(--glass-border)'
            }}
          >
            Demo Sequence
          </span>
        </div>
      </div>

      {/* Horizontal / Wrapped Step Flow */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '10px',
          position: 'relative'
        }}
      >
        {timeline.map((item) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isPending = item.status === 'pending';

          let stepColor = 'var(--text-muted)';
          let bgColor = 'var(--bg-tertiary)';
          let borderColor = 'var(--glass-border)';

          if (isCompleted) {
            stepColor = 'var(--status-emerald)';
            bgColor = 'rgba(16, 185, 129, 0.08)';
            borderColor = 'rgba(16, 185, 129, 0.3)';
          } else if (isCurrent) {
            stepColor = 'var(--accent-cyan)';
            bgColor = 'rgba(6, 182, 212, 0.12)';
            borderColor = 'var(--glass-border-cyan)';
          }

          return (
            <div
              key={item.step}
              style={{
                padding: '12px 10px',
                borderRadius: 'var(--radius-md)',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                position: 'relative',
                transition: 'all var(--transition-fast)'
              }}
            >
              {/* Step Number & Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: stepColor }}>
                  STAGE 0{item.step}
                </span>

                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isCompleted ? 'rgba(16, 185, 129, 0.25)' : isCurrent ? 'rgba(6, 182, 212, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isCompleted ? 'var(--status-emerald)' : isCurrent ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted ? 'var(--status-emerald)' : isCurrent ? 'var(--accent-cyan)' : 'var(--text-faint)'
                  }}
                >
                  {isCompleted ? (
                    <Check size={11} strokeWidth={3} />
                  ) : isCurrent ? (
                    <CircleDot size={11} strokeWidth={3} style={{ animation: 'pulse-ring 1.5s infinite' }} />
                  ) : (
                    <span style={{ fontSize: '9px', fontWeight: 700 }}>{item.step}</span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25 }}>
                {item.title}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.25 }}>
                {item.description}
              </div>

              {/* Stage status tag */}
              <div style={{ marginTop: 'auto', paddingTop: '4px' }}>
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    color: isCompleted ? 'var(--status-emerald)' : isCurrent ? 'var(--accent-cyan)' : 'var(--text-faint)'
                  }}
                >
                  {isCompleted ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'QUEUED'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
