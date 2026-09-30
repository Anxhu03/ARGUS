import React from 'react';
import { Check, Clock, CircleDot, AlertTriangle } from 'lucide-react';

export default function InvestigationTimeline({ timeline = [] }) {
  return (
    <div className="ref-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>Autonomous Investigation Lifecycle</h3>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Deterministic 9-stage sequence from complaint ingestion to resolution verification
          </p>
        </div>
        <span
          style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '9999px',
            background: '#e0f2fe',
            color: '#0284c7',
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(125px, 1fr))',
          gap: '10px',
          position: 'relative'
        }}
      >
        {timeline.map((item, idx) => {
          const isCompleted = item.status === 'completed';
          const isCurrent = item.status === 'current';
          const isPending = item.status === 'pending';

          let stepColor = '#94a3b8';
          let bgColor = '#ffffff';
          let borderColor = '#e2e8f0';

          if (isCompleted) {
            stepColor = '#16a34a';
            bgColor = '#f0fdf4';
            borderColor = '#bbf7d0';
          } else if (isCurrent) {
            stepColor = '#0284c7';
            bgColor = '#e0f2fe';
            borderColor = '#7dd3fc';
          }

          return (
            <div
              key={item.step}
              style={{
                padding: '10px',
                borderRadius: '6px',
                background: bgColor,
                border: `1px solid ${borderColor}`,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                position: 'relative',
                transition: 'all 0.15s ease'
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
                    background: isCompleted ? '#16a34a' : isCurrent ? '#0284c7' : '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b'
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
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#0f172a', lineHeight: 1.25 }}>
                {item.title}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.2 }}>
                {item.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
