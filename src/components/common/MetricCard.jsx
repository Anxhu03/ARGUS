import React from 'react';
import GlassCard from './GlassCard';

export default function MetricCard({
  title,
  value,
  subtext,
  delta,
  deltaType = 'positive', // 'positive' | 'negative' | 'neutral'
  icon: Icon,
  accentColor = 'var(--accent-cyan)'
}) {
  return (
    <GlassCard className="metric-card" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--glass-border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: accentColor
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '4px' }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)'
          }}
        >
          {value}
        </span>

        {delta && (
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)',
              background:
                deltaType === 'positive'
                  ? 'var(--status-emerald-bg)'
                  : deltaType === 'negative'
                  ? 'var(--status-rose-bg)'
                  : 'rgba(255,255,255,0.06)',
              color:
                deltaType === 'positive'
                  ? 'var(--status-emerald)'
                  : deltaType === 'negative'
                  ? 'var(--status-rose)'
                  : 'var(--text-secondary)',
              border: `1px solid ${
                deltaType === 'positive'
                  ? 'var(--status-emerald-border)'
                  : deltaType === 'negative'
                  ? 'var(--status-rose-border)'
                  : 'var(--glass-border)'
              }`
            }}
          >
            {delta}
          </span>
        )}
      </div>

      {subtext && (
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {subtext}
        </span>
      )}
    </GlassCard>
  );
}
