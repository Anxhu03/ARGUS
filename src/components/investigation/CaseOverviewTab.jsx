import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../common/StatusBadge';
import {
  User,
  Package,
  Calendar,
  CreditCard,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileText,
  MessageSquare,
  Send,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Hash,
  Users,
  ChevronRight,
  Info,
  ShieldAlert,
  Edit3
} from 'lucide-react';

export default function CaseOverviewTab({ caseData, onNavigateToWorkspace, onOpenActionModal }) {
  const { addCaseInternalNote, addToast } = useApp();
  const [newNoteText, setNewNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Sarah Chen');
  const [noteRole, setNoteRole] = useState('Tier 2 Lead');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const customer = caseData.customer || {};
  const orderId = caseData.orderId || 'N/A';
  const amount = caseData.amount || '$0.00';
  const category = caseData.category || 'General';
  const internalNotes = caseData.internalNotes || [];
  const investigation = caseData.investigationOverview || {};
  const findings = caseData.findings || {};

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      await addCaseInternalNote(caseData.id, {
        author: noteAuthor,
        role: noteRole,
        text: newNoteText.trim(),
        timestamp: 'Just now'
      });
      setNewNoteText('');
      addToast({
        type: 'success',
        title: 'Internal Note Recorded',
        message: 'Your investigative observation has been logged to the case ledger.'
      });
    } catch (err) {
      addToast({
        type: 'error',
        title: 'Failed to Add Note',
        message: err.message || 'An error occurred while saving the note.'
      });
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Known facts fallback
  const knownFacts = findings.verifiedFacts?.length > 0
    ? findings.verifiedFacts
    : [
        `Case filed under category "${category}" with order reference ${orderId}`,
        `Payment authorization recorded at ${amount} via gateway telemetry`,
        `Customer account reliability band: ${customer.reliabilityBand || 'Standard'} (${customer.reliabilityScore || 90}%)`
      ];

  // Outstanding questions fallback
  const outstandingQuestions = investigation.openQuestions?.length > 0
    ? investigation.openQuestions
    : [
        'Awaiting final reconciliation between carrier transit GPS and customer doorstep confirmation',
        'Verification of upstream webhook receipt for order reserve fulfillment'
      ];

  // Related cases history fallback
  const relatedCases = [
    {
      id: 'ARG-0992',
      title: 'Previous billing inquiry — double pending auth',
      date: '3 months ago',
      outcome: 'Auto-resolved (gateway released hold)'
    },
    {
      id: 'ARG-0841',
      title: 'Address update verification on active shipment',
      date: '8 months ago',
      outcome: 'Completed by Tier 1'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner: Quick Workspace Jump CTA */}
      <div
        className="glass-panel-glow"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(14, 20, 34, 0.85) 100%)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--glass-border-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Sparkles size={16} className="text-cyan" />
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Deep Diagnostics Available
            </span>
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Autonomous Multi-Agent Investigation Workspace
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            Explore the 9-stage deterministic timeline, inspect Billing, Order, Tech, and Evidence Verification agent telemetry, examine cryptographic digests, and evaluate root cause consensus.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={onNavigateToWorkspace}
          style={{
            height: '40px',
            padding: '0 20px',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'var(--accent-glow)'
          }}
        >
          <span>Launch Investigation Workspace</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Main 2-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {/* Column 1: Customer & Order Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Customer Profile Card */}
          <div className="ref-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ref-card-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} className="text-cyan" />
                <h3 className="ref-card-title">Customer Context & History</h3>
              </div>
              {customer.isUserSubmitted ? (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: 'var(--status-emerald)',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  Portal Submitted
                </span>
              ) : (
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--glass-border)'
                  }}
                >
                  Sample Demo Account
                </span>
              )}
            </div>

            {/* Customer Basic Info Row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#ffffff',
                  flexShrink: 0
                }}
              >
                {customer.avatar || customer.name?.substring(0, 2).toUpperCase() || 'CU'}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {customer.name || 'Anonymous Customer'}
                  </div>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      background: 'rgba(6, 182, 212, 0.15)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    {customer.tier || 'Standard Tier'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {customer.email || 'No email associated'}
                </div>
              </div>
            </div>

            {/* Customer Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Reliability Score</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--status-emerald)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {customer.reliabilityScore || 92}%
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>{customer.reliabilityBand || 'High Veracity'}</div>
              </div>

              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Historical Cases</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-cyan)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {customer.totalCases || 3}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                  {customer.resolvedCases || 3} verified
                </div>
              </div>

              <div
                style={{
                  padding: '10px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Account Age</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {customer.joinedDate || '2023'}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>Verified tenure</div>
              </div>
            </div>

            {/* Preferred Resolution */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              <HelpCircle size={16} style={{ color: 'var(--status-amber)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--status-amber)', textTransform: 'uppercase' }}>
                  Customer's Preferred Resolution:
                </span>
                <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-primary)', marginLeft: '6px' }}>
                  {caseData.preferredResolution || 'Full refund / chargeback release to original payment method'}
                </span>
              </div>
            </div>

            {/* Related Historical Cases */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Related Case History ({relatedCases.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {relatedCases.map((rc) => (
                  <div
                    key={rc.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                          {rc.id}
                        </span>
                        <span style={{ color: 'var(--text-primary)' }}>{rc.title}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-faint)', marginTop: '2px' }}>
                        {rc.date} • {rc.outcome}
                      </div>
                    </div>
                    <ChevronRight size={14} color="var(--text-faint)" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Details Card */}
          <div className="ref-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="ref-card-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} className="text-cyan" />
                <h3 className="ref-card-title">Associated Order & Transaction</h3>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--accent-cyan)'
                }}
              >
                {orderId}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Transaction Amount</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  {amount}
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Order Date</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {caseData.createdAt ? caseData.createdAt.split(' ')[0] : 'Oct 14, 2026'}
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Assigned Team</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-cyan)', marginTop: '4px' }}>
                  {caseData.assignedTeam || 'Payments Dispute'}
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Investigator</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {caseData.assignedAgent || 'Sarah Chen'}
                </div>
              </div>
            </div>

            {/* Issue Description Callout */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-tertiary)',
                borderLeft: '3px solid var(--accent-cyan)',
                borderTop: '1px solid var(--glass-border)',
                borderRight: '1px solid var(--glass-border)',
                borderBottom: '1px solid var(--glass-border)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                Customer's Reported Issue
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                "{caseData.complaintText || caseData.description || 'No statement recorded.'}"
              </p>
            </div>
          </div>
        </div>

        {/* Column 2: Case Summary & Internal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Structured Case Summary */}
          <div className="ref-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ref-card-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} className="text-cyan" />
                <h3 className="ref-card-title">Executive Case Summary</h3>
              </div>
              <StatusBadge status={caseData.status} size="sm" />
            </div>

            {/* Prototype illustrative notice */}
            <div
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontSize: '11px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Info size={14} className="text-cyan" style={{ flexShrink: 0 }} />
              <span>
                <strong>Demonstration Prototype: </strong>
                Telemetry summaries synthesize mock gateway traces and user intake. Real external actions require human sign-off.
              </span>
            </div>

            {/* Investigation Objective & Current Status */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Current Investigation Objective
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {investigation.objective || 'Isolate gateway timeouts, verify ledger capture state, and formulate deterministic resolution.'}
              </p>
            </div>

            {/* Established Facts */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-emerald)', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={13} />
                <span>Established & Verified Facts</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
                {knownFacts.map((fact, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <span style={{ color: 'var(--status-emerald)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Outstanding Questions */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--status-amber)', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <HelpCircle size={13} />
                <span>Outstanding Questions & Ambiguities</span>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
                {outstandingQuestions.map((q, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4,
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <span style={{ color: 'var(--status-amber)', fontWeight: 700, flexShrink: 0 }}>?</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Required Action */}
            <div
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(20, 184, 166, 0.05) 100%)',
                border: '1px solid var(--glass-border-cyan)'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                Next Suggested Action
              </div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {investigation.nextSuggestedStep || 'Review agent consensus in Investigation Workspace and execute proposed settlement.'}
              </div>
            </div>
          </div>

          {/* Internal Notes & Investigator Log */}
          <div className="ref-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="ref-card-header" style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} className="text-cyan" />
                <h3 className="ref-card-title">Internal Investigative Notes ({internalNotes.length})</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Visible to support team only</span>
            </div>

            {/* Note Composer Form */}
            <form onSubmit={handleAddNote} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                >
                  <option value="Sarah Chen">Sarah Chen (Tier 2 Lead)</option>
                  <option value="Marcus Vance">Marcus Vance (Fraud Analyst)</option>
                  <option value="Elena Rostova">Elena Rostova (Payments Lead)</option>
                  <option value="Devon Price">Devon Price (Logistics Specialist)</option>
                </select>

                <select
                  value={noteRole}
                  onChange={(e) => setNoteRole(e.target.value)}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-primary)',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    outline: 'none'
                  }}
                >
                  <option value="Tier 2 Lead">Observation</option>
                  <option value="Audit Note">Audit Note</option>
                  <option value="Evidence Verification">Evidence Verification</option>
                  <option value="Customer Callback">Customer Callback</option>
                </select>
              </div>

              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Log internal finding, telemetry note, or phone log with customer..."
                rows={3}
                style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  padding: '10px 12px',
                  fontSize: '13px',
                  fontFamily: 'var(--font-body)',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={!newNoteText.trim() || isSubmittingNote}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px', height: '34px' }}
                >
                  <Send size={13} />
                  <span>{isSubmittingNote ? 'Saving Note...' : 'Record Internal Note'}</span>
                </button>
              </div>
            </form>

            {/* Notes Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
              {internalNotes.length === 0 ? (
                <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No internal notes recorded yet. Use the composer above to log the first entry.
                </div>
              ) : (
                internalNotes.map((note, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {note.author}
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-muted)'
                          }}
                        >
                          {note.role}
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                        {note.timestamp}
                      </span>
                    </div>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {note.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
