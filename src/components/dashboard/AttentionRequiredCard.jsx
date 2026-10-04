import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { AlertTriangle, ArrowRight, ShieldAlert, FileText, CheckCircle, UserCheck } from 'lucide-react';

export default function AttentionRequiredCard({
  cases = [],
  onNavigateToCase,
  onViewAllAttention
}) {
  const getAttentionBadge = (type) => {
    switch (type) {
      case 'Contradiction Detected':
        return { variant: 'amber', icon: ShieldAlert, label: 'Contradiction' };
      case 'Human Escalation Required':
        return { variant: 'rose', icon: UserCheck, label: 'Escalation' };
      case 'Pending Evidence':
        return { variant: 'cyan', icon: FileText, label: 'Evidence Needed' };
      case 'Consensus Ready':
        return { variant: 'emerald', icon: CheckCircle, label: 'Consensus Ready' };
      default:
        return { variant: 'purple', icon: AlertTriangle, label: type };
    }
  };

  return (
    <Card variant="default" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="ref-card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={16} color="var(--status-amber)" />
            <span>Cases Requiring Attention</span>
          </div>
          <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
            Critical discrepancies, high-value escalations & evidence holds
          </div>
        </div>

        <Badge variant="amber" size="sm">
          {cases.length} Queued
        </Badge>
      </div>

      {/* Attention Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
        {cases.map((item) => {
          const badgeMeta = getAttentionBadge(item.attentionType);
          const BadgeIcon = badgeMeta.icon;

          return (
            <div
              key={item.id}
              onClick={() => onNavigateToCase && onNavigateToCase(item.id)}
              style={{
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                transition: 'all var(--transition-fast)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
            >
              {/* Item Top Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {item.id}
                  </span>
                  <Badge variant={badgeMeta.variant} size="xs">
                    <BadgeIcon size={10} style={{ marginRight: '3px' }} />
                    {badgeMeta.label}
                  </Badge>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.amount}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                    • {item.updatedAt}
                  </span>
                </div>
              </div>

              {/* Title & Customer */}
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', lineHeight: 1.35 }}>
                {item.title}
              </div>

              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', lineHeight: 1.35 }}>
                {item.reason}
              </div>

              {/* Footer action row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                  Customer: <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.customer}</span> ({item.tier})
                </div>

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigateToCase && onNavigateToCase(item.id);
                  }}
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
