import React from 'react';
import Card from '../common/Card';
import {
  Sparkles,
  FileText,
  FolderGit2,
  BrainCircuit,
  ArrowRight,
  Zap
} from 'lucide-react';

export default function QuickActionsCard({
  onSubmitComplaint,
  onOpenSupport,
  onViewAllCases,
  onOpenIntelligence
}) {
  const actions = [
    {
      id: 'submit-complaint',
      title: 'Submit Customer Complaint',
      description: 'Intake a new dispute with automated classification & evidence ingestion',
      icon: FileText,
      color: 'var(--accent-cyan)',
      action: onSubmitComplaint
    },
    {
      id: 'open-support',
      title: 'Support Intelligence Hub',
      description: 'Launch agent intake portal with real-time multi-agent deployment',
      icon: Sparkles,
      color: 'var(--status-emerald)',
      action: onOpenSupport
    },
    {
      id: 'view-cases',
      title: 'Explore All Cases',
      description: 'Inspect full registry, filter active DAGs, and review resolution records',
      icon: FolderGit2,
      color: 'var(--accent-teal)',
      action: onViewAllCases
    },
    {
      id: 'case-intelligence',
      title: 'Open Case Intelligence',
      description: 'Cross-case pattern detection, fraud clusters, and prevention rules',
      icon: BrainCircuit,
      color: 'var(--status-purple)',
      action: onOpenIntelligence
    }
  ];

  return (
    <Card variant="default" style={{ padding: '20px' }}>
      <div className="ref-card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="var(--accent-cyan)" />
            <span>Operational Quick Actions</span>
          </div>
          <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
            Frequent operator shortcuts & platform workflows
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
        {actions.map((act) => {
          const IconComp = act.icon;
          return (
            <div
              key={act.id}
              onClick={act.action}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = act.color;
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  act.action();
                }
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: act.color,
                  flexShrink: 0
                }}
              >
                <IconComp size={16} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {act.title}
                  </span>
                  <ArrowRight size={12} color="var(--text-faint)" />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.3 }}>
                  {act.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
