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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Status & Confidence Banner */}
        <div
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            background: '#f8fafc',
            border: '1px solid var(--border)',
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
                borderRadius: '6px',
                background: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Icon size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                {agent.agentName}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Execution Status: <strong style={{ color: '#0284c7' }}>{agent.status}</strong>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Verification Confidence</div>
            <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#16a34a' }}>
              {agent.confidenceScore}%
            </div>
          </div>
        </div>

        {/* Assigned Task Description */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '6px' }}>
            Assigned Investigation Task
          </h4>
          <p
            style={{
              fontSize: '12px',
              color: '#334155',
              lineHeight: 1.5,
              background: '#f8fafc',
              padding: '10px 14px',
              borderRadius: '6px',
              borderLeft: '3px solid #0284c7'
            }}
          >
            {agent.task}
          </p>
        </div>

        {/* Real-time Query Metrics */}
        {agent.metrics && agent.metrics.length > 0 && (
          <div>
            <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Gateway & Protocol Metrics
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px' }}>
              {agent.metrics.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: '#f8fafc',
                    border: '1px solid var(--border)'
                  }}
                >
                  <div style={{ fontSize: '10px', color: '#64748b' }}>{m.label}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: '#0f172a', marginTop: '2px' }}>
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empirical Findings */}
        <div>
          <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Empirical Findings & Verified Ledger Facts
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {agent.findings?.map((find, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  fontSize: '12px',
                  color: '#334155',
                  lineHeight: 1.4,
                  padding: '6px 10px',
                  background: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>{find}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
