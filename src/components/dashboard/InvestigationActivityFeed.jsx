import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import {
  Activity,
  FolderGit2,
  Cpu,
  Truck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Clock,
  ArrowRight
} from 'lucide-react';

export default function InvestigationActivityFeed({
  activities = [],
  onInspectCase
}) {
  const [filterType, setFilterType] = useState('all');

  const getActivityIcon = (type) => {
    switch (type) {
      case 'classified':
        return { icon: FolderGit2, color: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.12)' };
      case 'billing_audit':
        return { icon: Cpu, color: 'var(--status-emerald)', bg: 'var(--status-emerald-bg)' };
      case 'carrier_telemetry':
        return { icon: Truck, color: 'var(--accent-teal)', bg: 'rgba(20, 184, 166, 0.12)' };
      case 'contradiction':
        return { icon: ShieldAlert, color: 'var(--status-amber)', bg: 'var(--status-amber-bg)' };
      case 'root_cause':
        return { icon: AlertCircle, color: 'var(--status-purple)', bg: 'rgba(168, 85, 247, 0.12)' };
      case 'resolution':
        return { icon: CheckCircle2, color: 'var(--status-emerald)', bg: 'var(--status-emerald-bg)' };
      case 'escalation':
        return { icon: UserCheck, color: 'var(--status-rose)', bg: 'var(--status-rose-bg)' };
      default:
        return { icon: Activity, color: 'var(--accent-cyan)', bg: 'rgba(6, 182, 212, 0.12)' };
    }
  };

  const filteredActivities = filterType === 'all'
    ? activities
    : filterType === 'agents'
      ? activities.filter(a => a.type === 'billing_audit' || a.type === 'carrier_telemetry' || a.type === 'root_cause')
      : activities.filter(a => a.type === 'contradiction' || a.type === 'escalation');

  return (
    <Card variant="default" style={{ padding: '20px' }}>
      {/* Header */}
      <div className="ref-card-header" style={{ marginBottom: '14px' }}>
        <div>
          <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="var(--accent-cyan)" />
            <span>Live Multi-Agent Investigation Stream</span>
          </div>
          <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
            Real-time consensus audit trail & evidence verification events
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="cyan" size="sm">
            Demo Telemetry
          </Badge>

          {/* Filter tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: 'var(--bg-tertiary)', padding: '2px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--glass-border)' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'agents', label: 'Agents' },
              { id: 'flags', label: 'Alerts' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id)}
                style={{
                  border: 'none',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-xs)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: filterType === tab.id ? 'var(--accent-cyan)' : 'transparent',
                  color: filterType === tab.id ? '#07090e' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredActivities.map((act) => {
          const meta = getActivityIcon(act.type);
          const IconComponent = meta.icon;

          return (
            <div
              key={act.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border-light)';
                e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)';
                e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
              }}
            >
              {/* Event Icon */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: meta.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: meta.color,
                  flexShrink: 0,
                  marginTop: '2px'
                }}
              >
                <IconComponent size={16} />
              </div>

              {/* Event Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.title}
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        padding: '1px 5px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      {act.caseId}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} />
                      {act.time}
                    </span>
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        padding: '1px 6px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      {act.agent}
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                  {act.detail}
                </p>
              </div>

              {/* Quick Inspect Button */}
              {onInspectCase && act.caseId && (
                <button
                  type="button"
                  onClick={() => onInspectCase(act.caseId)}
                  className="btn btn-ghost btn-sm"
                  style={{
                    fontSize: '11px',
                    padding: '3px 8px',
                    height: '24px',
                    color: 'var(--text-muted)',
                    alignSelf: 'center'
                  }}
                  title={`Inspect ${act.caseId}`}
                >
                  <ArrowRight size={12} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
