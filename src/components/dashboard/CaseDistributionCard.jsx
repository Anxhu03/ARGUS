import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { PieChart, Filter } from 'lucide-react';

export default function CaseDistributionCard({
  categories = [],
  onSelectCategory,
  selectedCategory = 'all'
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const totalCases = categories.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card variant="default" style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="ref-card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={16} color="var(--accent-cyan)" />
            <span>Case Distribution</span>
          </div>
          <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
            {totalCases.toLocaleString()} total historical cases categorized
          </div>
        </div>

        <Badge variant="cyan" size="sm">
          Deterministic Classifier
        </Badge>
      </div>

      {/* Segmented Stacked Progress Bar */}
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            height: '12px',
            width: '100%',
            borderRadius: '9999px',
            overflow: 'hidden',
            display: 'flex',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            gap: '1px'
          }}
          role="progressbar"
          aria-label="Case Category Breakdown"
        >
          {categories.map((cat, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={cat.category}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  width: `${cat.percentage}%`,
                  height: '100%',
                  background: cat.color,
                  opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                  transition: 'all var(--transition-fast)',
                  cursor: 'pointer'
                }}
                title={`${cat.category}: ${cat.percentage}% (${cat.count} cases)`}
              />
            );
          })}
        </div>

        {/* Hover detail pill */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
          <span>
            {hoveredIdx !== null ? (
              <span style={{ color: categories[hoveredIdx]?.color, fontWeight: 600 }}>
                {categories[hoveredIdx]?.category}: {categories[hoveredIdx]?.count} cases ({categories[hoveredIdx]?.percentage}%)
              </span>
            ) : (
              <span>Hover segment to inspect allocation</span>
            )}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>100% Normalized</span>
        </div>
      </div>

      {/* Category List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {categories.map((cat, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedCategory === cat.category;

          return (
            <div
              key={cat.category}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelectCategory && onSelectCategory(cat.category === selectedCategory ? 'all' : cat.category)}
              style={{
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? 'var(--bg-elevated)' : isHovered ? 'var(--bg-tertiary)' : 'rgba(255, 255, 255, 0.02)',
                border: isSelected ? `1px solid ${cat.color}` : isHovered ? '1px solid var(--glass-border-light)' : '1px solid var(--glass-border)',
                transition: 'all var(--transition-fast)',
                cursor: onSelectCategory ? 'pointer' : 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: cat.color,
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {cat.category}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {cat.count}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-surface)',
                      color: cat.color,
                      border: '1px solid var(--glass-border)',
                      minWidth: '38px',
                      textAlign: 'center'
                    }}
                  >
                    {cat.percentage}%
                  </span>
                </div>
              </div>

              {/* Mini progress track */}
              <div
                style={{
                  height: '3px',
                  width: '100%',
                  borderRadius: '2px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  overflow: 'hidden',
                  marginBottom: '4px'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${cat.percentage}%`,
                    background: cat.color,
                    borderRadius: '2px'
                  }}
                />
              </div>

              {/* Description */}
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
