import React, { useState } from 'react';
import InvestigationTimeline from './InvestigationTimeline';
import AgentVisualizationGraph from './AgentVisualizationGraph';
import AgentDetailModal from './AgentDetailModal';
import EvidenceMatrix from './EvidenceMatrix';
import ContradictionCard from './ContradictionCard';
import RootCauseCard from './RootCauseCard';
import ResolutionCard from './ResolutionCard';
import EscalationCard from './EscalationCard';
import {
  ShieldCheck,
  Layers,
  FileText,
  Scale,
  GitCommit,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Cpu,
  UserCheck
} from 'lucide-react';

export default function InvestigationWorkspaceTab({
  caseData,
  onApproveResolution,
  onEscalateCase,
  onRequestEvidence,
  onEvidenceAdded
}) {
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [activeWorkspaceSection, setActiveWorkspaceSection] = useState('all'); // 'all' | 'timeline' | 'agents' | 'evidence' | 'findings' | 'resolution'

  const overview = caseData.investigationOverview || {};
  const agentsData = caseData.agentsData || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* SECTION A — INVESTIGATION OVERVIEW */}
      <div
        className="ref-card"
        style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', letterSpacing: '0.06em' }}>
                Section A — Autonomous Investigation Overview
              </span>
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              Investigation Diagnostic Summary & Objectives
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              High-level consensus snapshot generated deterministically by multi-agent audit workers
            </p>
          </div>

          <div
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid var(--glass-border-cyan)',
              fontSize: '11px',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Info size={13} className="text-cyan" />
            <span>Demonstration Prototype — Local Simulation</span>
          </div>
        </div>

        {/* 4-Stat Overview Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Investigation Status</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-cyan)', marginTop: '2px' }}>
              {overview.status || caseData.status}
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Current Stage</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {overview.currentStage || 'Stage 06 of 09 (Root Cause Formulation)'}
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Pending Evidence</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--status-amber)', marginTop: '2px' }}>
              {overview.pendingEvidence || 'Carrier GPS Timestamp Log'}
            </div>
          </div>

          <div
            style={{
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active Diagnostic Agents</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--status-emerald)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              5 / 5 Converged
            </div>
          </div>
        </div>

        {/* Objective & Suggested Step Callout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              borderLeft: '4px solid var(--accent-cyan)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              Investigation Objective
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {overview.objective || 'Isolate gateway timeouts, cross-reference order ledger state, and recommend compensatory settlement.'}
            </p>
          </div>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              borderLeft: '4px solid var(--status-emerald)'
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)', marginBottom: '4px' }}>
              Next Suggested Step
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              {overview.nextSuggestedStep || 'Review proposed resolution draft, verify ledger refund release, and execute approval.'}
            </p>
          </div>
        </div>
      </div>

      {/* SECTION B — INVESTIGATION TIMELINE */}
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} className="text-cyan" />
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Section B — 9-Stage Chronological Sequence
          </h4>
        </div>
        <InvestigationTimeline timeline={caseData.timeline || []} />
      </div>

      {/* SECTION C — AGENT ACTIVITY */}
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={16} className="text-cyan" />
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Section C — Diagnostic Agent Activity & DAG Synthesis
          </h4>
        </div>
        <AgentVisualizationGraph
          caseData={caseData}
          onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
        />
      </div>

      {/* SECTION D — EVIDENCE PANEL */}
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={16} className="text-cyan" />
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Section D — Verifiable Cryptographic & Telemetry Evidence
          </h4>
        </div>
        <EvidenceMatrix
          evidence={caseData.evidence || []}
          caseId={caseData.id}
          onEvidenceAdded={onEvidenceAdded}
        />
      </div>

      {/* SECTION E — FINDINGS AND CONTRADICTIONS */}
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Scale size={16} className="text-cyan" />
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Section E — Findings, Telemetry Facts & Contradictions
          </h4>
        </div>
        <ContradictionCard
          contradiction={caseData.contradiction}
          findings={caseData.findings}
        />
      </div>

      {/* SECTION F — ROOT CAUSE */}
      {caseData.rootCause && (
        <div>
          <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitCommit size={16} className="text-cyan" />
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Section F — Root Cause Diagnosis & Deterministic Chain
            </h4>
          </div>
          <RootCauseCard rootCause={caseData.rootCause} />
        </div>
      )}

      {/* SECTION G — RESOLUTION AND ESCALATION */}
      <div>
        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} className="text-cyan" />
          <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            Section G — Resolution Plan & Human Review Escalation
          </h4>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {caseData.resolution && (
            <ResolutionCard
              resolution={caseData.resolution}
              caseStatus={caseData.status}
              onApprove={onApproveResolution}
              onEscalate={onEscalateCase}
              onRequestEvidence={onRequestEvidence}
            />
          )}

          {(caseData.status === 'Human Review' || caseData.escalation?.required) && (
            <EscalationCard
              escalation={caseData.escalation}
              onAction={(actionType) => {
                if (actionType === 'approve_override') onApproveResolution();
                else if (actionType === 'request_evidence') onRequestEvidence();
                else onEscalateCase();
              }}
            />
          )}
        </div>
      </div>

      {/* Diagnostic Agent Modal */}
      <AgentDetailModal
        agentId={selectedAgentId}
        caseData={caseData}
        onClose={() => setSelectedAgentId(null)}
      />
    </div>
  );
}
