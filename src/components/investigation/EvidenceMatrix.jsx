import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import {
  FileText,
  CreditCard,
  Database,
  Terminal,
  MapPin,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Filter,
  ShieldCheck,
  Hash,
  Eye,
  Info,
  Plus,
  X,
  Send,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { api } from '../../services/api';

export default function EvidenceMatrix({ evidence = [], caseId = 'ARG-1049', onEvidenceAdded }) {
  const [expandedId, setExpandedId] = useState(null);
  const [expandedAuditId, setExpandedAuditId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [ingestLoading, setIngestLoading] = useState(false);
  const [ingestError, setIngestError] = useState(null);

  // Ingestion Form State
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('Financial Record');
  const [newSource, setNewSource] = useState('Stripe Gateway API');
  const [newSourceLabel, setNewSourceLabel] = useState('verified');
  const [newDescription, setNewDescription] = useState('');
  const [newPayloadJson, setNewPayloadJson] = useState('{\n  "transaction_id": "tx_9912401",\n  "status": "succeeded",\n  "amount": 389.00\n}');

  const getEvidenceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('financial') || t.includes('payment') || t.includes('stripe')) return CreditCard;
    if (t.includes('database') || t.includes('oms') || t.includes('order')) return Database;
    if (t.includes('log') || t.includes('queue') || t.includes('kafka') || t.includes('trace') || t.includes('signal')) return Terminal;
    if (t.includes('spatial') || t.includes('gis') || t.includes('carrier') || t.includes('delivery')) return MapPin;
    if (t.includes('vision') || t.includes('camera') || t.includes('photo') || t.includes('upload') || t.includes('receipt') || t.includes('footage')) return Camera;
    return FileText;
  };

  const handleCopyPayload = (id, payload) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleIngestSubmit = async (e) => {
    e.preventDefault();
    setIngestLoading(true);
    setIngestError(null);

    let parsedPayload = {};
    try {
      if (newPayloadJson.trim()) {
        parsedPayload = JSON.parse(newPayloadJson);
      }
    } catch (err) {
      setIngestError("Invalid JSON in telemetry payload: " + err.message);
      setIngestLoading(false);
      return;
    }

    try {
      const created = await api.addCaseEvidence(caseId, {
        title: newTitle,
        type: newType,
        source: newSource,
        sourceLabel: newSourceLabel,
        description: newDescription,
        payload: parsedPayload
      });
      setIsIngestModalOpen(false);
      setNewTitle('');
      setNewDescription('');
      if (onEvidenceAdded) {
        onEvidenceAdded(created);
      }
    } catch (err) {
      setIngestError(err.data?.error?.message || err.message || "Failed to ingest evidence artifact.");
    } finally {
      setIngestLoading(false);
    }
  };

  const filteredEvidence = statusFilter === 'all'
    ? evidence
    : evidence.filter(ev => {
        const s = (ev.status || '').toLowerCase();
        if (statusFilter === 'verified') return s === 'verified' || s === 'evidence reviewed';
        if (statusFilter === 'pending') return s === 'pending' || s === 'evidence pending review';
        if (statusFilter === 'conflicting') return s.includes('conflict');
        if (statusFilter === 'clarification') return s.includes('clarification');
        return s === statusFilter;
      });

  const statePills = [
    { value: 'all', label: `All Artifacts (${evidence.length})` },
    { value: 'verified', label: 'Verified / Reviewed' },
    { value: 'conflicting', label: 'Conflicting' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'clarification', label: 'Requires Clarification' }
  ];

  return (
    <div className="ref-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-cyan" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Verifiable Cryptographic & Telemetry Evidence Matrix
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-source verifiable artifacts with deterministic verification rules, SHA-256 digests, and source attestation
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Ingest Evidence Button */}
          <button
            onClick={() => setIsIngestModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(6, 182, 212, 0.15)',
              border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            <Plus size={14} />
            <span>Ingest Evidence Artifact</span>
          </button>

          {/* Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
            {statePills.map(sp => (
              <button
                key={sp.value}
                onClick={() => setStatusFilter(sp.value)}
                style={{
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === sp.value ? 'var(--accent-cyan)' : 'transparent',
                  color: statusFilter === sp.value ? '#05070c' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Information / Warning Notice if 0 evidence */}
      {evidence.length === 0 && (
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <AlertCircle size={20} color="var(--status-amber)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px', color: 'var(--text-primary)' }}>
            <strong>Evidence Intake Required: </strong>
            No telemetry artifacts have been ingested for case {caseId}. Use "Ingest Evidence Artifact" to submit gateway records or trigger automated ingestion.
          </div>
        </div>
      )}

      {/* Empty Filter State */}
      {filteredEvidence.length === 0 && evidence.length > 0 ? (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)'
          }}
        >
          <FileText size={32} style={{ color: 'var(--text-faint)', margin: '0 auto 12px' }} />
          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            No Evidence Artifacts Found
          </h4>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto' }}>
            No evidence matches the filter "{statusFilter}". Change or clear the filter to view other ingested verification artifacts.
          </p>
        </div>
      ) : (
        /* Evidence Cards Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {filteredEvidence.map((ev) => {
            const Icon = getEvidenceIcon(ev.type);
            const isExpanded = expandedId === ev.id;
            const isAuditExpanded = expandedAuditId === ev.id;
            const isConflicting = (ev.status || '').toLowerCase().includes('conflict');
            const isClarification = (ev.status || '').toLowerCase().includes('clarification');
            const sourceLabel = (ev.sourceLabel || 'simulated').toLowerCase();

            return (
              <div
                key={ev.id}
                style={{
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-tertiary)',
                  border: `1px solid ${isConflicting ? 'rgba(244, 63, 94, 0.4)' : isClarification ? 'rgba(245, 158, 11, 0.4)' : 'var(--glass-border)'}`,
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: 'var(--glass-shadow)',
                  borderLeft: `4px solid ${
                    ev.status === 'Verified' || ev.status === 'Evidence Reviewed'
                      ? 'var(--status-emerald)'
                      : isConflicting
                        ? 'var(--status-rose)'
                        : isClarification || ev.status === 'Pending'
                          ? 'var(--status-amber)'
                          : 'var(--accent-cyan)'
                  }`
                }}
              >
                {/* Top Row: Type, Source Label & Verification Status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        background: isConflicting ? 'rgba(244, 63, 94, 0.15)' : 'rgba(6, 182, 212, 0.15)',
                        color: isConflicting ? 'var(--status-rose)' : 'var(--accent-cyan)'
                      }}
                    >
                      <Icon size={16} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {ev.type || 'Telemetry Data'}
                        </span>
                        {/* Explicit Source Label Pill */}
                        <span
                          style={{
                            fontSize: '9px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '3px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background: sourceLabel === 'verified'
                              ? 'rgba(16, 185, 129, 0.15)'
                              : sourceLabel === 'simulated'
                                ? 'rgba(168, 85, 247, 0.15)'
                                : 'rgba(255, 255, 255, 0.08)',
                            color: sourceLabel === 'verified'
                              ? 'var(--status-emerald)'
                              : sourceLabel === 'simulated'
                                ? 'var(--status-purple)'
                                : 'var(--text-muted)',
                            border: `1px solid ${
                              sourceLabel === 'verified'
                                ? 'rgba(16, 185, 129, 0.3)'
                                : sourceLabel === 'simulated'
                                  ? 'rgba(168, 85, 247, 0.3)'
                                  : 'var(--glass-border)'
                            }`
                          }}
                        >
                          {sourceLabel === 'verified' ? 'Verified Enterprise' : sourceLabel === 'simulated' ? 'Simulated Telemetry' : 'Mock Ingestion'}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                        {ev.id}
                      </div>
                    </div>
                  </div>

                  <StatusBadge status={ev.status} size="sm" />
                </div>

                {/* Title & Description */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {ev.title}
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {ev.description}
                  </p>
                </div>

                {/* Metadata & Deterministic Reliability Score */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--glass-border)',
                    fontSize: '11px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Case: </span>
                    <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{caseId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Source: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{ev.source || 'Gateway Telemetry'}</strong>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Ingestion Time: </span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{ev.timestamp || '2026-10-14 14:22 UTC'}</span>
                  </div>

                  {/* Deterministic Confidence Indicator */}
                  <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '6px', marginTop: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ShieldCheck size={13} color="var(--status-emerald)" />
                      <span style={{ color: 'var(--text-muted)' }}>Reliability: </span>
                      <strong style={{ color: 'var(--status-emerald)', fontFamily: 'var(--font-mono)' }}>
                        {ev.confidenceScore !== undefined ? `${ev.confidenceScore}%` : '95.0%'}
                      </strong>
                    </div>

                    {/* Verification Audit Toggle */}
                    {ev.verificationAudit && (
                      <button
                        onClick={() => setExpandedAuditId(isAuditExpanded ? null : ev.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--accent-cyan)',
                          fontSize: '10px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span>{isAuditExpanded ? 'Hide Verification Audit' : 'Audit Trail'}</span>
                        {isAuditExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Verification Audit Drawer */}
                {isAuditExpanded && ev.verificationAudit && (
                  <div
                    style={{
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(5, 7, 12, 0.6)',
                      border: '1px solid var(--glass-border-cyan)',
                      fontSize: '11px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-cyan)', fontSize: '10px', textTransform: 'uppercase' }}>
                        Deterministic Verification Audit
                      </span>
                      <span style={{ color: 'var(--text-faint)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>
                        {ev.verificationAudit.verifiedAt}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <strong>Audit Result: </strong>{ev.verificationAudit.reason}
                    </div>

                    {/* Checks Checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {ev.verificationAudit.checks?.map((chk, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '11px' }}>
                          {chk.passed ? (
                            <CheckCircle2 size={13} color="var(--status-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          ) : (
                            <AlertTriangle size={13} color="var(--status-rose)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          )}
                          <div>
                            <span style={{ fontWeight: 600, color: chk.passed ? 'var(--text-primary)' : 'var(--status-rose)' }}>
                              {chk.checkName}:{' '}
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>{chk.detail}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SHA-256 Digest if available */}
                {ev.sha256 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--glass-border)',
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <Hash size={12} className="text-cyan" />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      SHA-256: {ev.sha256}
                    </span>
                  </div>
                )}

                {/* Expandable Raw Payload View */}
                {ev.payload && (
                  <div>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                      style={{
                        width: '100%',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '6px 10px',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '2px',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      <span>{isExpanded ? 'Hide Raw JSON Telemetry' : 'Inspect Raw JSON Telemetry'}</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>

                    {isExpanded && (
                      <div style={{ position: 'relative', marginTop: '8px' }}>
                        <pre
                          style={{
                            background: 'var(--bg-primary)',
                            padding: '10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '11px',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--text-cyan)',
                            overflowX: 'auto',
                            maxHeight: '160px',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {JSON.stringify(ev.payload, null, 2)}
                        </pre>

                        <button
                          onClick={() => handleCopyPayload(ev.id, ev.payload)}
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            color: copiedId === ev.id ? 'var(--status-emerald)' : 'var(--text-muted)',
                            borderRadius: 'var(--radius-xs)',
                            padding: '4px 6px',
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          {copiedId === ev.id ? <Check size={11} /> : <Copy size={11} />}
                          <span>{copiedId === ev.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* INGEST EVIDENCE MODAL */}
      {isIngestModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 7, 12, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="ref-card"
            style={{
              width: '100%',
              maxWidth: '560px',
              padding: '24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border-cyan)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} className="text-cyan" />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Ingest Technical Evidence Artifact
                </h3>
              </div>
              <button
                onClick={() => setIsIngestModalOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Submit an empirical telemetry record for Case <strong style={{ color: 'var(--text-primary)' }}>{caseId}</strong>. The deterministic engine will execute duplicate checks, cryptographic hashing, and cross-source reconciliation upon ingestion.
            </p>

            {ingestError && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.3)',
                  color: 'var(--status-rose)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{ingestError}</span>
              </div>
            )}

            <form onSubmit={handleIngestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Artifact Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe Charge Capture Record"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-primary)',
                    fontSize: '12px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Evidence Category *
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  >
                    <option value="Financial Record">Financial Record</option>
                    <option value="Carrier Document">Carrier Document</option>
                    <option value="GIS Spatial Record">GIS Spatial Record</option>
                    <option value="Hardware Sensor Record">Hardware Sensor Record</option>
                    <option value="Database Entity">Database Entity</option>
                    <option value="Customer Upload">Customer Upload</option>
                    <option value="System Log">System Log</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Source Adapter *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe API v2"
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Attestation Label *
                  </label>
                  <select
                    value={newSourceLabel}
                    onChange={(e) => setNewSourceLabel(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  >
                    <option value="verified">Verified Enterprise Record</option>
                    <option value="simulated">Simulated Telemetry</option>
                    <option value="mock">Mock Ingestion</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Summary Observation
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of observed telemetry"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--glass-border)',
                      color: 'var(--text-primary)',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Raw Telemetry Payload (JSON) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newPayloadJson}
                  onChange={(e) => setNewPayloadJson(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-cyan)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsIngestModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ingestLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--accent-cyan)',
                    border: 'none',
                    color: '#05070c',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: ingestLoading ? 'wait' : 'pointer',
                    opacity: ingestLoading ? 0.7 : 1
                  }}
                >
                  <Send size={13} />
                  <span>{ingestLoading ? 'Verifying & Ingesting...' : 'Ingest & Verify Artifact'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
