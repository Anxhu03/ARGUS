import React from 'react';
import GlassCard from '../common/GlassCard';
import { Check, Clock, CircleDot, AlertTriangle } from 'lucide-react';

export default function InvestigationTimeline({ timeline = [] }) {
  return (
    <GlassCard style={{ padding: '22px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600 }}>Autonomous Investigation Lifecycle</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Deterministic 9-stage sequence from complaint ingestion to resolution verification
          </p>
        </div>
        <span
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 242, 254, 0.1)',
            color: 'var(--accent-cyan)',
            fontWeight: 600
          }}
        >
          {timeline.filter(t => t.status === 'completed').length} / {timeline.length} Stages Completed
        </span>
      </div>

      {/* Horizontal / Wrapped Step Flow */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          position: 'relative'
        }}
      >
        {timeline.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isPending = item.status === 'pending';

          let stepColor = 'var(--text-faint)';
          let bgColor = 'rgba(255, 255, 255, 0.02)';
          let borderColor = 'var(--glass-border)';

          if (isCompleted) {
            stepColor = 'var(--status-emerald)';
            bgColor = 'rgba(16, 185, 129, 0.06)';
            borderColor = 'rgba(16, 185, 129, 0.25)';
          } else if (isCurrent) {
            stepColor = 'var(--accent-cyan)';
            bgColor = 'rgba(0, 242, 254, 0.08)';
            borderColor = 'rgba(0, 242, 254, 0.4)';
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
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--status-emerald)' : isCurrent ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#050a14'
                  }}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isCurrent ? (
                    <CircleDot size={12} strokeWidth={3} style={{ animation: 'pulse-ring 1.5s infinite' }} />
                  ) : (
                    <span style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-muted)' }}>{item.step}</span>
                  )}
                </div>
              </div>

              {/* Title & Desc */}
              <div style={{ fontWeight: 600, fontSize: '12px', color: isPending ? 'var(--text-muted)' : 'var(--text-primary)', lineHeight: 1.3 }}>
                {item.title}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.3, flex: 1 }}>
                {item.desc}
              </div>

              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
