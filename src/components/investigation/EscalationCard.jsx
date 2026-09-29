import React from 'react';
import GlassCard from '../common/GlassCard';
import {
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  Sliders
} from 'lucide-react';

export default function EscalationCard({ escalation, onAction }) {
  if (!escalation) return null;

  const isCritical = escalation.riskLevel === 'Critical';

  return (
    <GlassCard
      style={{
        padding: '24px',
        border: `1px solid ${isCritical ? 'var(--status-rose-border)' : 'var(--status-amber-border)'}`,
        background: isCritical
          ? 'linear-gradient(135deg, rgba(30, 12, 18, 0.85) 0%, rgba(10, 16, 28, 0.9) 100%)'
          : 'linear-gradient(135deg, rgba(30, 22, 10, 0.85) 0%, rgba(10, 16, 28, 0.9) 100%)',
        boxShadow: isCritical
          ? '0 0 30px rgba(244, 63, 94, 0.15)'
          : '0 0 30px rgba(245, 158, 11, 0.15)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: isCritical ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)',
              flexShrink: 0
            }}
          >
            <ShieldAlert size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)', letterSpacing: '0.06em' }}>
                Human Review Escalation Required
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: 'var(--radius-sm)',
                  background: isCritical ? 'var(--status-rose-bg)' : 'var(--status-amber-bg)',
                  color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)',
                  textTransform: 'uppercase'
                }}
              >
                {escalation.riskLevel} Risk
              </span>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Specialist Review Triggered by Policy Threshold
            </h3>
          </div>
        </div>

        {escalation.assignedSpecialist && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Tier</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {escalation.assignedSpecialist}
            </div>
          </div>
        )}
      </div>

      {/* Escalation Reason */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Policy Trigger & Evidence Discrepancy
        </span>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.5 }}>
          {escalation.reason}
        </p>
      </div>

      {/* Recommended Action */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--glass-border)',
          marginBottom: '18px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>
          Recommended Human Action
        </span>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
          {escalation.recommendedAction}
        </p>
      </div>

      {/* Enterprise Review Controls */}
      <div>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px', display: 'block' }}>
          Human Specialist Review Controls
        </span>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onAction && onAction('approve_override')}
          >
            <UserCheck size={14} />
            <span>Approve Specialist Override</span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onAction && onAction('request_evidence')}
          >
            <FileText size={14} />
            <span>Request Certified Proof Upload</span>
          </button>

          <button
            className="btn btn-danger btn-sm"
            onClick={() => onAction && onAction('formal_dispute')}
          >
            <AlertTriangle size={14} />
            <span>Initiate Formal Carrier Dispute</span>
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
