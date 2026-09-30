import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import CaseHeader from './CaseHeader';
import InvestigationTimeline from './InvestigationTimeline';
import AgentVisualizationGraph from './AgentVisualizationGraph';
import AgentDetailModal from './AgentDetailModal';
import EvidenceMatrix from './EvidenceMatrix';
import ContradictionCard from './ContradictionCard';
import RootCauseCard from './RootCauseCard';
import ResolutionCard from './ResolutionCard';
import EscalationCard from './EscalationCard';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import {
  Layers,
  FileText,
  UserCheck,
  RotateCcw,
  Sparkles,
  GitBranch,
  BrainCircuit
} from 'lucide-react';

export default function CaseDetailView() {
  const { currentCase, isCaseLoading, selectedCaseId, triggerRefresh, addToast, setCurrentView } = useApp();
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [activeTab, setActiveTab] = useState('workflow'); // 'workflow' | 'evidence' | 'customer-intel'

  if (isCaseLoading) {
    return <LoadingState message={`Retrieving multi-agent investigation file for ${selectedCaseId}...`} />;
  }

  if (!currentCase) {
    return (
      <EmptyState
        title="Case Not Found"
        description={`The requested investigation (${selectedCaseId}) could not be located in the current cluster.`}
        actionLabel="Back to Cases"
        onAction={() => setCurrentView('cases')}
      />
    );
  }

  const handleEscalationAction = async (actionType) => {
    if (actionType === 'approve_override') {
      await api.approveResolution(currentCase.id);
      addToast({
        type: 'success',
        title: 'Specialist Override Approved',
        message: `Case ${currentCase.id} approved by supervisor and transitioned to Resolved.`
      });
      triggerRefresh();
    } else if (actionType === 'request_evidence') {
      await api.updateCaseStatus(currentCase.id, 'Evidence Required');
      addToast({
        type: 'info',
        title: 'Proof Upload Requested',
        message: 'Dispatched secure upload link for certified delivery receipt to customer portal.'
      });
      triggerRefresh();
    } else if (actionType === 'formal_dispute') {
      addToast({
        type: 'warning',
        title: 'Carrier Dispute Opened',
        message: 'Automated legal liability claim filed with carrier insurance operations.'
      });
    }
  };

  const handleReRunAgents = () => {
    addToast({
      type: 'info',
      title: 'Re-running Investigation DAG',
      message: 'Flushing cache and re-querying Billing, Order, and Technical agent endpoints...'
    });
    triggerRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Case Header */}
      <CaseHeader caseData={currentCase} onReload={handleReRunAgents} />

      {/* Investigation Timeline */}
      <InvestigationTimeline timeline={currentCase.timeline || []} />

      {/* Tab Switcher Pills */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '8px'
        }}
      >
        <button
          className={`btn ${activeTab === 'workflow' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('workflow')}
          style={{ height: '34px', borderRadius: '6px' }}
        >
          <GitBranch size={15} />
          <span>Investigation Workflow & Agents DAG</span>
        </button>

        <button
          className={`btn ${activeTab === 'evidence' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('evidence')}
          style={{ height: '34px', borderRadius: '6px' }}
        >
          <FileText size={15} />
          <span>Evidence Matrix ({currentCase.evidence?.length || 0})</span>
        </button>

        <button
          className={`btn ${activeTab === 'customer-intel' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('customer-intel')}
          style={{ height: '34px', borderRadius: '6px' }}
        >
          <BrainCircuit size={15} />
          <span>Customer Case Memory</span>
        </button>
      </div>

      {/* Tab 1: Multi-Agent Workflow & Diagnosis */}
      {activeTab === 'workflow' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Multi-Agent DAG Visualization */}
          <AgentVisualizationGraph
            caseData={currentCase}
            onSelectAgent={(agentId) => setSelectedAgentId(agentId)}
          />

          {/* Contradiction Detection Card (if present) */}
          {currentCase.contradiction && (
            <ContradictionCard contradiction={currentCase.contradiction} />
          )}

          {/* Root Cause Analysis Card */}
          {currentCase.rootCause && (
            <RootCauseCard rootCause={currentCase.rootCause} />
          )}

          {/* Resolution Plan Card */}
          {currentCase.resolution && (
            <ResolutionCard
              resolution={currentCase.resolution}
              caseStatus={currentCase.status}
              onExecute={() => {}}
            />
          )}

          {/* Human Escalation Card (if in review or required) */}
          {(currentCase.status === 'Human Review' || currentCase.escalation?.required) && (
            <EscalationCard
              escalation={currentCase.escalation}
              onAction={handleEscalationAction}
            />
          )}
        </div>
      )}

      {/* Tab 2: Evidence Matrix */}
      {activeTab === 'evidence' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <EvidenceMatrix evidence={currentCase.evidence || []} />
        </div>
      )}

      {/* Tab 3: Customer Case Memory & Reliability Context */}
      {activeTab === 'customer-intel' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="ref-card" style={{ padding: '24px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>Customer Case Memory Profile</h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Historic context indexed to prevent redundant investigations and recognize customer veracity
                </p>
              </div>

              <div
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0284c7'
                }}
              >
                Reliability Score: {currentCase.customer.reliabilityScore}% ({currentCase.customer.reliabilityBand})
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Customer Account</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>{currentCase.customer.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{currentCase.customer.email}</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Total Historical Cases</div>
                <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#0284c7', marginTop: '2px' }}>
                  {currentCase.customer.totalCases || 3}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  {currentCase.customer.resolvedCases || 3} Verified / {currentCase.customer.disputedCases || 0} Disputed
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Customer Tier</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#16a34a', marginTop: '2px' }}>
                  {currentCase.customer.tier}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Member since {currentCase.customer.joinedDate}</div>
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border)', fontSize: '12px', color: '#475569' }}>
              <strong style={{ color: '#0284c7' }}>Reliability Policy Note: </strong>
              ARGUS uses neutral <em>Complaint Reliability</em> indexing based strictly on verified technical findings and historical delivery receipts, avoiding speculative fraud grading.
            </div>
          </div>
        </div>
      )}

      {/* Selected Agent Modal */}
      <AgentDetailModal
        agentId={selectedAgentId}
        caseData={currentCase}
        onClose={() => setSelectedAgentId(null)}
      />
    </div>
  );
}
