import React from 'react';
import StatusBadge from '../common/StatusBadge';
import {
  CreditCard,
  Package,
  Cpu,
  GitMerge,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function AgentVisualizationGraph({ caseData, onSelectAgent }) {
  const agentsData = caseData.agentsData || {};

  return (
    <div className="ref-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#0284c7" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Multi-Agent Investigation Workflow (DAG)</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Parallel diagnostic agents converge through the Coordinator to formulate the root-cause determination
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16a34a' }} /> Completed
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7', animation: 'pulse-ring 1.5s infinite' }} /> Investigating
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#ea580c' }} /> Waiting
          </span>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          position: 'relative'
        }}
      >
        {/* Step 1: Case Node */}
        <div
          style={{
            padding: '8px 20px',
            borderRadius: '9999px',
            background: '#0f172a',
            border: '1px solid #1e293b',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 2,
            color: '#ffffff'
          }}
        >
          <Sparkles size={14} color="#38bdf8" />
          <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.03em' }}>
            ARGUS INTAKE: {caseData.id} • {caseData.category}
          </span>
        </div>

        {/* Stem Line */}
        <div
          style={{
            width: '2px',
            height: '20px',
            background: '#cbd5e1'
          }}
        />

        {/* Parallel Multi-Agent Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '14px',
            width: '100%',
            position: 'relative',
            zIndex: 2
          }}
        >
          {/* Agent 1: Billing Agent */}
          <div
            onClick={() => onSelectAgent('billing')}
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: `1px solid ${agentsData.billing?.status === 'Investigating' ? '#0284c7' : '#e2e8f0'}`,
              boxShadow: agentsData.billing?.status === 'Investigating' ? '0 0 15px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.billing?.status === 'Investigating' ? '#0284c7' : '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '6px', background: '#e0f2fe', color: '#0284c7' }}>
                  <CreditCard size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Billing Agent</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Financial & Ledger Audit</div>
                </div>
              </div>
              <StatusBadge status={agentsData.billing?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.billing?.summary || 'Verifying gateway capture status and balance reserve.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>
                Confidence: <strong style={{ color: '#16a34a' }}>{agentsData.billing?.confidenceScore || 99}%</strong>
              </span>
              <span style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 2: Order Agent */}
          <div
            onClick={() => onSelectAgent('order')}
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: `1px solid ${agentsData.order?.status === 'Investigating' ? '#0284c7' : '#e2e8f0'}`,
              boxShadow: agentsData.order?.status === 'Investigating' ? '0 0 15px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.order?.status === 'Investigating' ? '#0284c7' : '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '6px', background: '#dbeafe', color: '#2563eb' }}>
                  <Package size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Order Agent</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Fulfillment & Inventory State</div>
                </div>
              </div>
              <StatusBadge status={agentsData.order?.status || 'Completed'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.order?.summary || 'Inspecting warehouse fulfillment status and reserve locks.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>
                Confidence: <strong style={{ color: '#16a34a' }}>{agentsData.order?.confidenceScore || 98}%</strong>
              </span>
              <span style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>

          {/* Agent 3: Technical Agent */}
          <div
            onClick={() => onSelectAgent('tech')}
            style={{
              padding: '16px',
              borderRadius: '8px',
              background: '#ffffff',
              border: `1px solid ${agentsData.tech?.status === 'Investigating' ? '#0284c7' : '#e2e8f0'}`,
              boxShadow: agentsData.tech?.status === 'Investigating' ? '0 0 15px rgba(2, 132, 199, 0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0284c7';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = agentsData.tech?.status === 'Investigating' ? '#0284c7' : '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ padding: '6px', borderRadius: '6px', background: '#f3e8ff', color: '#7e22ce' }}>
                  <Cpu size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Technical Agent</div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Event Bus & Webhook Logs</div>
                </div>
              </div>
              <StatusBadge status={agentsData.tech?.status || 'Investigating'} size="sm" />
            </div>

            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4, marginBottom: '10px' }}>
              {agentsData.tech?.summary || 'Inspecting edge proxies, trace IDs, and network retries.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ color: '#64748b' }}>
                Confidence: <strong style={{ color: '#16a34a' }}>{agentsData.tech?.confidenceScore || 92}%</strong>
              </span>
              <span style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                Audit Findings <ExternalLink size={11} />
              </span>
            </div>
          </div>
        </div>

        {/* Stem Line down to Coordinator */}
        <div
          style={{
            width: '2px',
            height: '20px',
            background: '#cbd5e1'
          }}
        />

        {/* Step 3: Coordinator / Consensus Engine Node */}
        <div
          onClick={() => onSelectAgent('coordinator')}
          style={{
            width: '100%',
            maxWidth: '680px',
            padding: '16px 20px',
            borderRadius: '8px',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            zIndex: 2,
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#7e22ce';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.backgroundColor = '#f8fafc';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: '#f3e8ff',
                border: '1px solid #e9d5ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#7e22ce'
              }}
            >
              <GitMerge size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  Coordinator & Contradiction Engine
                </span>
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', background: '#f3e8ff', color: '#7e22ce', fontWeight: 600 }}>
                  CONSENSUS 98.1%
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                {agentsData.coordinator?.summary || 'Consolidates multi-agent findings, checks contradictions, and prepares root cause.'}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <StatusBadge status={agentsData.coordinator?.status || 'Completed'} size="sm" />
            <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '4px', fontWeight: 600 }}>
              Inspect Synthesis →
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
