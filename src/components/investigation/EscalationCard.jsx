import React from 'react';
import {
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  FileText,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export default function EscalationCard({ escalation, onAction }) {
  if (!escalation) return null;

  const isCritical = escalation.riskLevel === 'Critical';

  return (
    <div
      className="ref-card"
      style={{
        padding: '22px 24px',
        border: `1px solid ${isCritical ? '#fecdd3' : '#fed7aa'}`,
        background: isCritical ? '#fff1f2' : '#fffbeb',
        borderLeft: `5px solid ${isCritical ? '#dc2626' : '#ea580c'}`
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: isCritical ? '#fee2e2' : '#ffedd5',
              border: `1px solid ${isCritical ? '#fecdd3' : '#fed7aa'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isCritical ? '#dc2626' : '#ea580c',
              flexShrink: 0
            }}
          >
            <ShieldAlert size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: isCritical ? '#dc2626' : '#ea580c', letterSpacing: '0.06em' }}>
                Human Review Escalation Required
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '4px',
                  background: isCritical ? '#fee2e2' : '#ffedd5',
                  color: isCritical ? '#dc2626' : '#ea580c',
                  textTransform: 'uppercase'
                }}
              >
                {escalation.riskLevel} Risk
              </span>
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
              Specialist Review Triggered by Policy Threshold
            </h3>
          </div>
        </div>

        {escalation.assignedSpecialist && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Assigned Specialist</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
              {escalation.assignedSpecialist}
            </div>
          </div>
        )}
      </div>

      {/* Escalation Reason */}
      <div style={{ marginBottom: '14px' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b' }}>
          Policy Trigger & Evidence Discrepancy
        </span>
        <p style={{ fontSize: '12px', color: '#334155', marginTop: '4px', lineHeight: 1.5 }}>
          {escalation.reason}
        </p>
      </div>

      {/* Recommended Action */}
      <div
        style={{
          padding: '10px 14px',
          borderRadius: '6px',
          background: '#ffffff',
          border: '1px solid #fed7aa',
          fontSize: '12px',
          color: '#7c2d12',
          marginBottom: '16px'
        }}
      >
        <strong>Recommended Specialist Action: </strong>
        {escalation.recommendedAction}
      </div>

      {/* Specialist Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button
          className="btn btn-primary btn-sm"
          style={{ height: '34px', background: '#16a34a', borderColor: '#15803d' }}
          onClick={() => onAction('approve_override')}
        >
          <CheckCircle2 size={14} />
          <span>Approve Override & Mark Resolved</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ height: '34px' }}
          onClick={() => onAction('request_evidence')}
        >
          <FileText size={14} />
          <span>Request Certified Customer Proof</span>
        </button>

        <button
          className="btn btn-secondary btn-sm"
          style={{ height: '34px', color: '#ea580c', borderColor: '#fed7aa' }}
          onClick={() => onAction('formal_dispute')}
        >
          <AlertTriangle size={14} />
          <span>Open Carrier Insurance Dispute</span>
        </button>
      </div>
    </div>
  );
}
