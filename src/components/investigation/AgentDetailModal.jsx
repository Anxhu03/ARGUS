import React from 'react';
import Modal from '../common/Modal';
import StatusBadge from '../common/StatusBadge';
import {
  CreditCard,
  Package,
  Cpu,
  GitMerge,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Clock,
  Layers
} from 'lucide-react';

export default function AgentDetailModal({ agentId, caseData, onClose }) {
  if (!agentId || !caseData) return null;

  const agent = caseData.agentsData?.[agentId];
  if (!agent) return null;

  let Icon = Cpu;
  if (agentId === 'billing') Icon = CreditCard;
  else if (agentId === 'order') Icon = Package;
  else if (agentId === 'coordinator') Icon = GitMerge;

  return (
    <Modal
      isOpen={Boolean(agentId)}
      onClose={onClose}
      title={`${agent.agentName} — Diagnostic Telemetry`}
      subtitle={`Agent Version: ${agent.version} • Execution Time: ${agent.executionTime}`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Status & Confidence Banner */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(0, 242, 254, 0.1)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {agent.agentName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Execution Status: <strong style={{ color: 'var(--accent-cyan)' }}>{agent.status}</strong>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verification Confidence</div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--status-emerald)' }}>
              {agent.confidenceScore}%
            </div>
          </div>
        </div>

        {/* Assigned Task Description */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Assigned Investigation Task
          </h4>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '12px 14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--accent-cyan)'
            }}
          >
            {agent.task}
          </p>
        </div>

        {/* Agent Metrics Grid */}
        {agent.metrics && agent.metrics.length > 0 && (
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Telemetry Metrics & State Indicators
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              {agent.metrics.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px', wordBreak: 'break-all' }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Findings */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Empirical Findings & Cross-Checks
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {agent.findings?.map((finding, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <CheckCircle2 size={16} color="var(--status-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                  {finding}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Close Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Telemetry View
          </button>
        </div>
      </div>
    </Modal>
  );
}
