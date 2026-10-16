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
  Layers,
  Binary,
  Info
} from 'lucide-react';

export default function AgentDetailModal({ agentId, caseData, onClose }) {
  if (!agentId || !caseData) return null;

  const agent = caseData.agentsData?.[agentId];
  if (!agent) return null;

  let Icon = Cpu;
  let iconColor = 'var(--status-purple)';
  let iconBg = 'rgba(168, 85, 247, 0.15)';

  if (agentId === 'billing') {
    Icon = CreditCard;
    iconColor = 'var(--accent-cyan)';
    iconBg = 'rgba(6, 182, 212, 0.15)';
  } else if (agentId === 'order') {
    Icon = Package;
    iconColor = 'var(--accent-blue)';
    iconBg = 'rgba(59, 130, 246, 0.15)';
  } else if (agentId === 'coordinator') {
    Icon = GitMerge;
    iconColor = 'var(--accent-cyan)';
    iconBg = 'rgba(6, 182, 212, 0.15)';
  } else if (agentId === 'evidence_verifier') {
    Icon = ShieldCheck;
    iconColor = 'var(--accent-teal)';
    iconBg = 'rgba(20, 184, 166, 0.15)';
  }

  return (
    <Modal
      isOpen={Boolean(agentId)}
      onClose={onClose}
      title={`${agent.agentName} — Diagnostic Telemetry`}
      subtitle={`Agent Version: ${agent.version || 'v2.4.1'} • Execution Latency: ${agent.executionTime || '142ms'}`}
      maxWidth="720px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Prototype simulation label */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid var(--glass-border-cyan)',
            fontSize: '11px',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Info size={14} className="text-cyan" style={{ flexShrink: 0 }} />
          <span>
            <strong>Simulation Telemetry: </strong>
            This panel shows demonstration findings formulated by the ARGUS deterministic agent pipeline for local prototype evaluation.
          </span>
        </div>

        {/* Status & Confidence Banner */}
        <div
          style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: iconBg,
                color: iconColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Icon size={22} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {agent.agentName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Execution Status: <strong style={{ color: 'var(--accent-cyan)' }}>{agent.status}</strong>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verification Confidence</div>
            <div style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--status-emerald)' }}>
              {agent.confidenceScore || 98}%
            </div>
          </div>
        </div>

        {/* Assigned Task Description */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Assigned Investigation Task
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              background: 'var(--bg-tertiary)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--accent-cyan)',
              borderTop: '1px solid var(--glass-border)',
              borderRight: '1px solid var(--glass-border)',
              borderBottom: '1px solid var(--glass-border)'
            }}
          >
            {agent.task}
          </p>
        </div>

        {/* Real-time Query Metrics */}
        {agent.metrics && agent.metrics.length > 0 && (
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Gateway & Protocol Metrics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {agent.metrics.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', marginTop: '2px' }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empirical Findings */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Empirical Findings & Verified Ledger Facts
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
            {agent.findings?.map((find, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4,
                  padding: '8px 12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                <CheckCircle2 size={14} color="var(--status-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{find}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
