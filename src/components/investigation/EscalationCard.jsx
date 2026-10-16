import React from 'react';
import {
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function EscalationCard({ escalation, onAction }) {
  if (!escalation) return null;

  const isCritical = escalation.riskLevel === 'Critical';

  return (
    <div
      className="ref-card"
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        borderLeft: `5px solid ${isCritical ? 'var(--status-rose)' : 'var(--status-amber)'}`,
        background: isCritical ? 'rgba(244, 63, 94, 0.05)' : 'rgba(245, 158, 11, 0.05)',
        border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              background: isCritical ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${isCritical ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
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
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)', letterSpacing: '0.06em' }}>
                Human Review Escalation Required
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: isCritical ? 'rgba(244, 63, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)',
                  textTransform: 'uppercase'
                }}
              >
                {escalation.riskLevel || 'High'} Risk
              </span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Specialist Review Triggered by Policy Threshold
            </h3>
          </div>
        </div>

        {escalation.assignedSpecialist && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Assigned Specialist</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {escalation.assignedSpecialist}
            </div>
          </div>
        )}
      </div>

      {/* Escalation Reason */}
      <div>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Policy Trigger & Evidence Discrepancy
        </span>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
          {escalation.reason}
        </p>
      </div>

      {/* Recommended Action */}
      <div
        style={{
          padding: '12px 14px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--glass-border)',
          fontSize: '12px',
          color: 'var(--text-primary)'
        }}
      >
        <strong style={{ color: isCritical ? 'var(--status-rose)' : 'var(--status-amber)' }}>
          Recommended Specialist Action:{' '}
        </strong>
        {escalation.recommendedAction}
      </div>

      {/* Specialist Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ height: '36px', padding: '0 16px', gap: '6px' }}
          onClick={() => onAction('approve_override')}
        >
          <CheckCircle2 size={14} />
          <span>Approve Override & Mark Resolved</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ height: '36px', padding: '0 14px', gap: '6px' }}
          onClick={() => onAction('request_evidence')}
        >
          <FileText size={14} />
          <span>Request Certified Customer Proof</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ height: '36px', padding: '0 14px', gap: '6px', color: 'var(--status-amber)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
          onClick={() => onAction('formal_dispute')}
        >
          <AlertTriangle size={14} />
          <span>Open Carrier Insurance Dispute</span>
        </button>
      </div>
    </div>
  );
}
