import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Modal from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  Calendar,
  User,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  Edit3,
  Users,
  Flag,
  ArrowRight,
  Clock,
  Send,
  Layers
} from 'lucide-react';

export default function CaseHeader({ caseData, onReload, onNavigateToWorkspace }) {
  const {
    setCurrentView,
    addToast,
    triggerRefresh,
    updateCaseStatus,
    updateCasePriority,
    assignCaseTeam,
    escalateCase,
    approveCaseResolution
  } = useApp();

  // Modals state
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Form states
  const [selectedStatus, setSelectedStatus] = useState(caseData.status);
  const [statusReason, setStatusReason] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(caseData.priority);
  const [selectedTeam, setSelectedTeam] = useState(caseData.assignedTeam || 'Payments Dispute');
  const [selectedAgent, setSelectedAgent] = useState(caseData.assignedAgent || 'Sarah Chen');

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCaseStatus(caseData.id, selectedStatus, statusReason);
      setIsStatusModalOpen(false);
      setStatusReason('');
    } catch (err) {
      addToast({ type: 'error', title: 'Status Update Error', message: err.message });
    }
  };

  const handlePrioritySubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCasePriority(caseData.id, selectedPriority);
      setIsPriorityModalOpen(false);
    } catch (err) {
      addToast({ type: 'error', title: 'Priority Update Error', message: err.message });
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignCaseTeam(caseData.id, selectedTeam, selectedAgent);
      setIsAssignModalOpen(false);
    } catch (err) {
      addToast({ type: 'error', title: 'Assignment Error', message: err.message });
    }
  };

  const handleEscalateClick = async () => {
    if (window.confirm(`Are you sure you want to escalate case ${caseData.id} to Tier 2 Human Review?`)) {
      try {
        await escalateCase(
          caseData.id,
          'Manual escalation initiated by support investigator for supervisor review.',
          'High'
        );
      } catch (err) {
        addToast({ type: 'error', title: 'Escalation Failed', message: err.message });
      }
    }
  };

  const handleApproveClick = async () => {
    if (window.confirm(`Approve proposed resolution and transition case ${caseData.id} to Resolved?`)) {
      try {
        await approveCaseResolution(caseData.id);
      } catch (err) {
        addToast({ type: 'error', title: 'Resolution Failed', message: err.message });
      }
    }
  };

  return (
    <div
      className="ref-card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Top Breadcrumb & Header Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentView('cases')}
          style={{ gap: '6px', height: '32px' }}
        >
          <ChevronLeft size={15} />
          <span>Back to All Cases</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Quick Status Modal Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsStatusModalOpen(true)}
            style={{ height: '32px', gap: '6px' }}
            title="Update case status"
          >
            <Edit3 size={13} />
            <span>Update Status</span>
          </button>

          {/* Quick Priority Modal Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsPriorityModalOpen(true)}
            style={{ height: '32px', gap: '6px' }}
            title="Change priority level"
          >
            <Flag size={13} />
            <span>Change Priority</span>
          </button>

          {/* Quick Assign Modal Button */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setIsAssignModalOpen(true)}
            style={{ height: '32px', gap: '6px' }}
            title="Assign team and specialist"
          >
            <Users size={13} />
            <span>Assign Team</span>
          </button>

          {/* Re-run agents */}
          <button
            className="btn btn-secondary btn-sm"
            onClick={onReload}
            title="Re-run diagnostic synchronization"
            style={{ height: '32px', gap: '6px' }}
          >
            <RotateCcw size={13} />
            <span>Re-run Agents</span>
          </button>

          {/* Escalate to Human */}
          {caseData.status !== 'Human Review' && caseData.status !== 'Resolved' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleEscalateClick}
              style={{
                color: 'var(--status-amber)',
                borderColor: 'rgba(245, 158, 11, 0.3)',
                background: 'rgba(245, 158, 11, 0.08)',
                height: '32px',
                gap: '6px'
              }}
            >
              <AlertTriangle size={13} />
              <span>Escalate to Human</span>
            </button>
          )}

          {/* Approve Resolution */}
          {caseData.status !== 'Resolved' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleApproveClick}
              style={{ height: '32px', gap: '6px' }}
            >
              <CheckCircle2 size={13} />
              <span>Approve Resolution</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title, Badge & Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                background: 'rgba(6, 182, 212, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--glass-border-cyan)'
              }}
            >
              {caseData.id}
            </span>

            <StatusBadge status={caseData.status} />

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: '4px',
                background: caseData.priority === 'Critical' || caseData.priority === 'Urgent'
                  ? 'rgba(244, 63, 94, 0.15)'
                  : caseData.priority === 'High'
                    ? 'rgba(245, 158, 11, 0.15)'
                    : 'rgba(255, 255, 255, 0.06)',
                color: caseData.priority === 'Critical' || caseData.priority === 'Urgent'
                  ? 'var(--status-rose)'
                  : caseData.priority === 'High'
                    ? 'var(--status-amber)'
                    : 'var(--text-muted)',
                border: '1px solid var(--glass-border)'
              }}
            >
              {caseData.priority} Priority
            </span>

            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Category: <strong style={{ color: 'var(--text-primary)' }}>{caseData.category}</strong>
            </span>

            <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
              Team: <strong style={{ color: 'var(--text-secondary)' }}>{caseData.assignedTeam || 'Payments Dispute'}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {caseData.title}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} /> Created: {caseData.createdAt || 'Oct 14, 2026 14:22 UTC'}
            </span>
            <span>•</span>
            <span>Last Updated: {caseData.updatedAt || 'Just now'}</span>
          </div>
        </div>

        {/* Customer & Order Context Pill */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: '#ffffff'
            }}
          >
            {caseData.customer?.avatar || caseData.customer?.name?.substring(0, 2).toUpperCase() || 'CU'}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {caseData.customer?.name || 'Customer'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {caseData.customer?.tier || 'Standard'} • Reliability: <strong style={{ color: 'var(--status-emerald)' }}>{caseData.customer?.reliabilityScore || 90}%</strong>
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '14px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Order ID</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              {caseData.orderId || 'N/A'}
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
              {caseData.amount || '$0.00'}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Update Status */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title={`Update Status — Case ${caseData.id}`}
        subtitle="Select a new operational lifecycle state and provide an optional rationale."
        maxWidth="500px"
      >
        <form onSubmit={handleStatusSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Select Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Under Review">Under Review</option>
              <option value="Investigation in Progress">Investigation in Progress</option>
              <option value="Evidence Required">Evidence Required</option>
              <option value="Contradiction Flagged">Contradiction Flagged</option>
              <option value="Human Review">Human Review</option>
              <option value="Resolved">Resolved</option>
              <option value="Escalated">Escalated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Reason for Status Transition (Optional)
            </label>
            <textarea
              value={statusReason}
              onChange={(e) => setStatusReason(e.target.value)}
              placeholder="E.g. Dispatched carrier proof request or completed ledger audit..."
              rows={3}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '12px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsStatusModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Confirm Status Update
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Change Priority */}
      <Modal
        isOpen={isPriorityModalOpen}
        onClose={() => setIsPriorityModalOpen(false)}
        title={`Change Priority — Case ${caseData.id}`}
        subtitle="Adjust the investigation urgency based on financial risk or SLA threshold."
        maxWidth="460px"
      >
        <form onSubmit={handlePrioritySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Select Priority Tier
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Low">Low — Routine inquiry</option>
              <option value="Medium">Medium — Standard dispute</option>
              <option value="High">High — Escalated customer or high-value cart</option>
              <option value="Urgent">Urgent — Impending gateway chargeback deadline</option>
              <option value="Critical">Critical — Regulatory compliance or active anomaly</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPriorityModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Priority
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 3: Assign Team & Agent */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title={`Assign Team & Agent — Case ${caseData.id}`}
        subtitle="Delegate this investigation to a specialized department or operational investigator."
        maxWidth="500px"
      >
        <form onSubmit={handleAssignSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Assigned Department / Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Payments Dispute">Payments Dispute</option>
              <option value="Tier 2 Operations">Tier 2 Operations</option>
              <option value="Fraud & Risk">Fraud & Risk</option>
              <option value="Fulfillment Logistics">Fulfillment Logistics</option>
              <option value="Executive Escalations">Executive Escalations</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Assigned Specialist
            </label>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)',
                padding: '8px 12px',
                fontSize: '13px',
                outline: 'none'
              }}
            >
              <option value="Sarah Chen">Sarah Chen (Lead Specialist)</option>
              <option value="Marcus Vance">Marcus Vance (Fraud Analyst)</option>
              <option value="Elena Rostova">Elena Rostova (Payments Lead)</option>
              <option value="Devon Price">Devon Price (Logistics Specialist)</option>
              <option value="Autonomous ARGUS-Bot">Autonomous ARGUS-Bot</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Assignment
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
