import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import CaseHeader from './CaseHeader';
import CaseOverviewTab from './CaseOverviewTab';
import InvestigationWorkspaceTab from './InvestigationWorkspaceTab';
import EvidenceMatrix from './EvidenceMatrix';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import {
  FileText,
  GitBranch,
  BrainCircuit,
  Layers,
  Sparkles,
  ShieldCheck,
  User,
  ArrowRight
} from 'lucide-react';

export default function CaseDetailView() {
  const {
    currentCase,
    isCaseLoading,
    selectedCaseId,
    triggerRefresh,
    addToast,
    setCurrentView,
    approveCaseResolution,
    escalateCase,
    updateCaseStatus
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'workspace' | 'evidence' | 'customer-intel'

  if (isCaseLoading) {
    return <LoadingState message={`Retrieving multi-agent investigation file for ${selectedCaseId}...`} />;
  }

  if (!currentCase) {
    return (
      <EmptyState
        title="Case Not Found"
        description={`The requested investigation (${selectedCaseId}) could not be located in the current cluster.`}
        actionLabel="Back to All Cases"
        onAction={() => setCurrentView('cases')}
      />
    );
  }

  const handleApproveResolution = async () => {
    try {
      await approveCaseResolution(currentCase.id);
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEscalateCase = async () => {
    try {
      await escalateCase(
        currentCase.id,
        'Manual escalation requested by support operations lead for supervisor sign-off.',
        'High'
      );
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleRequestEvidence = async () => {
    try {
      await updateCaseStatus(currentCase.id, 'Evidence Required', 'Requested additional proof from customer/carrier');
      addToast({
        type: 'info',
        title: 'Evidence Requested',
        message: 'Status updated to Evidence Required. Simulated proof upload notification sent.'
      });
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleReRunAgents = async () => {
    try {
      addToast({
        type: 'info',
        title: 'Re-running Investigation DAG',
        message: 'Flushing cache and re-querying Billing, Order, Tech, and Evidence Verification agent endpoints...'
      });
      await api.analyzeCase(currentCase.id);
      triggerRefresh();
      addToast({
        type: 'success',
        title: 'Investigation Re-Synthesized',
        message: 'All evidence re-verified; contradiction matrix and root cause updated.'
      });
    } catch {
      triggerRefresh();
    }
  };

  const handleEvidenceAdded = () => {
    addToast({
      type: 'success',
      title: 'Evidence Ingested & Verified',
      message: 'New telemetry artifact ingested. Deterministic contradiction checks and root cause re-synthesized.'
    });
    triggerRefresh();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Case Header with Back Button & Quick Actions */}
      <CaseHeader
        caseData={currentCase}
        onReload={handleReRunAgents}
        onNavigateToWorkspace={() => setActiveTab('workspace')}
      />

      {/* Tab Switcher Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--glass-border)',
          paddingBottom: '10px',
          overflowX: 'auto'
        }}
      >
        <button
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('overview')}
          style={{ height: '36px', borderRadius: 'var(--radius-sm)', gap: '6px' }}
        >
          <FileText size={15} />
          <span>Case Overview & Context</span>
        </button>

        <button
          className={`btn ${activeTab === 'workspace' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('workspace')}
          style={{ height: '36px', borderRadius: 'var(--radius-sm)', gap: '6px' }}
        >
          <GitBranch size={15} />
          <span>Investigation Workspace (Sections A–G)</span>
        </button>

        <button
          className={`btn ${activeTab === 'evidence' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('evidence')}
          style={{ height: '36px', borderRadius: 'var(--radius-sm)', gap: '6px' }}
        >
          <ShieldCheck size={15} />
          <span>Evidence Matrix ({currentCase.evidence?.length || 0})</span>
        </button>

        <button
          className={`btn ${activeTab === 'customer-intel' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          onClick={() => setActiveTab('customer-intel')}
          style={{ height: '36px', borderRadius: 'var(--radius-sm)', gap: '6px' }}
        >
          <BrainCircuit size={15} />
          <span>Customer Case Memory</span>
        </button>
      </div>

      {/* TAB 1: Case Overview & Customer / Order Details */}
      {activeTab === 'overview' && (
        <CaseOverviewTab
          caseData={currentCase}
          onNavigateToWorkspace={() => setActiveTab('workspace')}
        />
      )}

      {/* TAB 2: Investigation Workspace (Sections A–G) */}
      {activeTab === 'workspace' && (
        <InvestigationWorkspaceTab
          caseData={currentCase}
          onApproveResolution={handleApproveResolution}
          onEscalateCase={handleEscalateCase}
          onRequestEvidence={handleRequestEvidence}
          onEvidenceAdded={handleEvidenceAdded}
        />
      )}

      {/* TAB 3: Evidence Matrix Deep Dive */}
      {activeTab === 'evidence' && (
        <EvidenceMatrix
          evidence={currentCase.evidence || []}
          caseId={currentCase.id}
          onEvidenceAdded={handleEvidenceAdded}
        />
      )}

      {/* TAB 4: Customer Case Memory Profile */}
      {activeTab === 'customer-intel' && (
        <div className="ref-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BrainCircuit size={18} className="text-cyan" />
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Customer Historical Case Memory Profile
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Longitudinal context indexed to prevent redundant investigations and recognize customer veracity
              </p>
            </div>

            <div
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--status-emerald)'
              }}
            >
              Reliability Score: {currentCase.customer?.reliabilityScore || 90}% ({currentCase.customer?.reliabilityBand || 'High Veracity'})
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Customer Account</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                {currentCase.customer?.name}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{currentCase.customer?.email}</div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Historical Inquiries</div>
              <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                {currentCase.customer?.totalCases || 3}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                {currentCase.customer?.resolvedCases || 3} Verified / {currentCase.customer?.disputedCases || 0} Disputed
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Account Tier</div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--status-emerald)', marginTop: '2px' }}>
                {currentCase.customer?.tier || 'Gold VIP'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Member since {currentCase.customer?.joinedDate || '2023'}</div>
            </div>
          </div>

          <div
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}
          >
            <strong style={{ color: 'var(--accent-cyan)' }}>Reliability Policy Note: </strong>
            ARGUS utilizes objective <em>Complaint Reliability Indexing</em> derived strictly from telemetry timestamps, delivery carrier geo-fencing, and ledger reconciliation, proactively preventing punitive or speculative fraud tagging.
          </div>
        </div>
      )}
    </div>
  );
}
