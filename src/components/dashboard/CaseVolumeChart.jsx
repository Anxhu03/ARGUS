import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { TrendingUp } from 'lucide-react';

export default function CaseVolumeChart({
  volumeData = [],
  timeframe = '7d',
  onTimeframeChange
}) {
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Derive maximum value for dynamic scaling
  const maxIngested = Math.max(...volumeData.map(d => d.ingested), 100);
  const chartHeight = 140;

  return (
    <Card variant="default" style={{ padding: '20px' }}>
      {/* Header */}
      <div className="ref-card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="ref-card-title">Case Volume & Resolution Throughput</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              $128,450 Protected
            </span>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: 'var(--accent-cyan-muted)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              +8.4% <TrendingUp size={12} />
            </span>
          </div>
        </div>

        {/* Timeframe Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
          {[
            { id: '7d', label: '7D' },
            { id: '14d', label: '14D' },
            { id: '30d', label: '30D' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => onTimeframeChange && onTimeframeChange(t.id)}
              style={{
                border: 'none',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                background: timeframe === t.id ? 'var(--accent-cyan)' : 'transparent',
                color: timeframe === t.id ? '#07090e' : 'var(--text-muted)',
                transition: 'all var(--transition-fast)'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Legend and Data Sources */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Ingested</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-Resolved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--status-amber)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Contradictions Flagged</span>
          </div>
        </div>

        {/* Source Telemetry Gateways */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>S</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Shopify OMS</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '2px 8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            <span style={{ width: '14px', height: '14px', borderRadius: '3px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>$</span>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Stripe Gateway</span>
          </div>
        </div>
      </div>

      {/* SVG Time-Series Chart */}
      <div style={{ height: '210px', width: '100%', position: 'relative' }}>
        <svg viewBox="0 0 700 190" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Horizontal Grid Lines */}
          <line x1="0" y1="20" x2="700" y2="20" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="65" x2="700" y2="65" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="110" x2="700" y2="110" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="155" x2="700" y2="155" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

          {volumeData.map((item, idx) => {
            const colWidth = 700 / volumeData.length;
            const xCenter = idx * colWidth + colWidth / 2;
            const barIngestedHeight = (item.ingested / maxIngested) * chartHeight;
            const barResolvedHeight = (item.resolved / maxIngested) * chartHeight;
            const isHovered = hoveredBarIndex === idx;

            const barWidth = volumeData.length > 10 ? 10 : 16;
            const offset = volumeData.length > 10 ? 6 : 10;

            return (
              <g
                key={item.label}
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Ingested Bar */}
                <rect
                  x={xCenter - offset}
                  y={155 - barIngestedHeight}
                  width={barWidth}
                  height={barIngestedHeight}
                  rx="3"
                  fill={isHovered ? 'rgba(255, 255, 255, 0.35)' : 'rgba(255, 255, 255, 0.15)'}
                  style={{ transition: 'all 0.18s ease' }}
                />

                {/* Resolved Bar */}
                <rect
                  x={xCenter + 2}
                  y={155 - barResolvedHeight}
                  width={barWidth}
                  height={barResolvedHeight}
                  rx="3"
                  fill={isHovered ? 'var(--accent-cyan-hover)' : 'var(--accent-cyan)'}
                  style={{ transition: 'all 0.18s ease' }}
                />

                {/* Contradiction Indicator Dot */}
                {item.contradiction > 0 && (
                  <circle
                    cx={xCenter + 2 + barWidth / 2}
                    y={151 - barResolvedHeight}
                    r="3.5"
                    fill="var(--status-amber)"
                  />
                )}

                {/* X-Axis Label */}
                <text
                  x={xCenter}
                  y="175"
                  textAnchor="middle"
                  fontSize="11"
                  fill={isHovered ? 'var(--text-primary)' : 'var(--text-muted)'}
                  fontWeight={isHovered ? '700' : '500'}
                >
                  {item.label}
                </text>

                {/* Floating Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={Math.max(10, Math.min(570, xCenter - 65))}
                      y={Math.max(5, 155 - barResolvedHeight - 56)}
                      width="130"
                      height="48"
                      rx="6"
                      fill="var(--bg-elevated)"
                      stroke="var(--glass-border-light)"
                      filter="drop-shadow(0 4px 12px rgba(0,0,0,0.6))"
                    />
                    <text
                      x={Math.max(10, Math.min(570, xCenter - 65)) + 65}
                      y={Math.max(5, 155 - barResolvedHeight - 56) + 18}
                      textAnchor="middle"
                      fontSize="11"
                      fill="var(--accent-cyan)"
                      fontWeight="700"
                    >
                      {item.resolved} Resolved / {item.ingested} In
                    </text>
                    <text
                      x={Math.max(10, Math.min(570, xCenter - 65)) + 65}
                      y={Math.max(5, 155 - barResolvedHeight - 56) + 34}
                      textAnchor="middle"
                      fontSize="10"
                      fill="var(--text-secondary)"
                    >
                      {item.amount} • {item.contradiction} Flagged
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </Card>
  );
}
