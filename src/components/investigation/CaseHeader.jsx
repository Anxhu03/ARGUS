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
      className="ref-card"
      style={{
        padding: '22px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Top Breadcrumb & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => setCurrentView('cases')}
          style={{ gap: '6px', height: '32px' }}
        >
          <ChevronLeft size={15} />
          <span>Back to Cases</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onReload}
            title="Re-run diagnostic synchronization"
            style={{ height: '32px' }}
          >
            <RotateCcw size={13} />
            <span>Re-run Agents</span>
          </button>

          {caseData.status !== 'Human Review' && caseData.status !== 'Resolved' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleEscalate}
              style={{ color: '#ea580c', borderColor: '#fed7aa', background: '#fff7ed', height: '32px' }}
            >
              <AlertTriangle size={13} />
              <span>Escalate to Human</span>
            </button>
          )}

          {caseData.status !== 'Resolved' && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleApproveResolution}
              style={{ height: '32px' }}
            >
              <CheckCircle2 size={13} />
              <span>Approve & Execute Resolution</span>
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
                fontSize: '14px',
                fontWeight: 700,
                color: '#0284c7',
                background: '#e0f2fe',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid #bae6fd'
              }}
            >
              {caseData.id}
            </span>
            <StatusBadge status={caseData.status} />
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                background: '#f1f5f9',
                color: caseData.priority === 'Critical' || caseData.priority === 'Urgent'
                  ? '#dc2626'
                  : caseData.priority === 'High'
                    ? '#ea580c'
                    : '#64748b'
              }}
            >
              {caseData.priority} Priority
            </span>
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Category: <strong style={{ color: '#0f172a' }}>{caseData.category}</strong>
            </span>
          </div>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
            {caseData.title}
          </h2>
        </div>

        {/* Customer & Order Context Pill */}
        <div
          style={{
            padding: '10px 16px',
            borderRadius: '8px',
            background: '#f8fafc',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            flexShrink: 0
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '12px',
              color: '#ffffff'
            }}
          >
            {caseData.customer.avatar || 'CU'}
          </div>

          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
              {caseData.customer.name}
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              {caseData.customer.tier} • Joined {caseData.customer.joinedDate}
            </div>
            <div style={{ fontSize: '10px', color: '#0284c7', marginTop: '1px', fontWeight: 600 }}>
              Reliability Score: {caseData.customer.reliabilityScore}% ({caseData.customer.reliabilityBand})
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border)', paddingLeft: '14px' }}>
            <div style={{ fontSize: '10px', color: '#64748b' }}>Order ID</div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0f172a' }}>
              {caseData.orderId}
            </div>
            <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0284c7', fontWeight: 600 }}>
              {caseData.amount}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Verbatim Complaint Callout */}
      <div
        style={{
          marginTop: '4px',
          padding: '12px 16px',
          borderRadius: '8px',
          background: '#f8fafc',
          borderLeft: '4px solid #0284c7',
          borderTop: '1px solid var(--border)',
          borderRight: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <User size={13} color="#0284c7" />
          <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0284c7' }}>
            Customer's Verbatim Statement
          </span>
          <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: 'auto' }}>
            Logged at: {caseData.createdAt}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
          "{caseData.complaintText}"
        </p>
      </div>
    </div>
  );
}
