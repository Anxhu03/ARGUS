import React from 'react';
import StatusBadge from '../common/StatusBadge';
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
  ChevronLeft
} from 'lucide-react';

export default function CaseHeader({ caseData, onReload }) {
  const { setCurrentView, addToast, triggerRefresh } = useApp();

  const handleApproveResolution = async () => {
    try {
      await api.approveResolution(caseData.id);
      addToast({
        type: 'success',
        title: 'Resolution Approved & Executed',
        message: `Case ${caseData.id} marked as resolved. Automated internal actions dispatched.`
      });
      triggerRefresh();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleEscalate = async () => {
    try {
      await api.escalateCaseToHuman(
        caseData.id,
        'Manual escalation requested by support operations lead for supervisor sign-off.',
        'High'
      );
      addToast({
        type: 'warning',
        title: 'Escalated to Human Review',
        message: `Case ${caseData.id} transferred to Tier 2 Operations specialist queue.`
      });
      triggerRefresh();
    } catch (err) {
      addToast({ type: 'error', title: 'Error', message: err.message });
    }
  };

  return (
    <div
      style={{
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'rgba(14, 21, 37, 0.75)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() => setCurrentView('cases')}
          style={{ gap: '6px', color: 'var(--text-secondary)' }}
        >
          <ChevronLeft size={16} />
          <span>Back to Cases</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onReload}
            title="Re-run diagnostic synchronization"
          >
            <RotateCcw size={14} />
            <span>Re-run Agents</span>
          </button>

          {caseData.status !== 'Human Review' && caseData.status !== 'Resolved' && (
            <button
              className="btn btn-danger btn-sm"
              onClick={handleEscalate}
            >
              <AlertTriangle size={14} />
              <span>Escalate to Human</span>
            </button>
          )}

          {caseData.status !== 'Resolved' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleApproveResolution}
            >
              <CheckCircle2 size={14} />
              <span>Approve & Execute Resolution</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Title, Badge & Meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--accent-cyan)',
                background: 'rgba(0, 242, 254, 0.1)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(0, 242, 254, 0.25)'
              }}
            >
              {caseData.id}
            </span>
            <StatusBadge status={caseData.status} />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: caseData.priority === 'Urgent' ? 'var(--status-rose)' : 'var(--status-amber)'
              }}
            >
              {caseData.priority} Priority
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Category: <strong style={{ color: 'var(--text-secondary)' }}>{caseData.category}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {caseData.title}
          </h2>
        </div>

        {/* Customer & Order Context Pill */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--accent-cyan)'
            }}
          >
            {caseData.customer.avatar || 'CU'}
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {caseData.customer.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {caseData.customer.tier} • Member since {caseData.customer.joinedDate}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', marginTop: '2px', fontWeight: 600 }}>
              Reliability Score: {caseData.customer.reliabilityScore}% ({caseData.customer.reliabilityBand})
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--glass-border)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Order ID</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
              {caseData.orderId}
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
              {caseData.amount}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Verbatim Complaint Callout */}
      <div
        style={{
          marginTop: '6px',
          padding: '14px 18px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(10, 16, 28, 0.7)',
          borderLeft: '4px solid var(--accent-cyan)',
          borderTop: '1px solid var(--glass-border)',
          borderRight: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <User size={14} color="var(--accent-cyan)" />
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-cyan)' }}>
            Customer's Verbatim Statement
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            Logged at: {caseData.createdAt}
          </span>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
          "{caseData.complaintText}"
        </p>
      </div>
    </div>
  );
}
