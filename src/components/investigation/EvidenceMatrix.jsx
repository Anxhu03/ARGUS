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
  Info
} from 'lucide-react';

export default function EvidenceMatrix({ evidence = [], caseId = 'ARG-1049' }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const getEvidenceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('financial') || t.includes('payment') || t.includes('stripe')) return CreditCard;
    if (t.includes('database') || t.includes('oms') || t.includes('order')) return Database;
    if (t.includes('log') || t.includes('queue') || t.includes('kafka') || t.includes('trace')) return Terminal;
    if (t.includes('spatial') || t.includes('gis') || t.includes('carrier') || t.includes('delivery')) return MapPin;
    if (t.includes('vision') || t.includes('camera') || t.includes('photo') || t.includes('upload') || t.includes('receipt')) return Camera;
    return FileText;
  };

  const handleCopyPayload = (id, payload) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvidence = statusFilter === 'all'
    ? evidence
    : evidence.filter(ev => {
        const s = (ev.status || '').toLowerCase();
        if (statusFilter === 'verified') return s === 'verified' || s === 'evidence reviewed';
        if (statusFilter === 'pending') return s === 'pending' || s === 'evidence pending review';
        if (statusFilter === 'clarification') return s.includes('clarification') || s.includes('conflict');
        if (statusFilter === 'submitted') return s === 'evidence submitted' || s === 'submitted';
        return s === statusFilter;
      });

  const statePills = [
    { value: 'all', label: `All Artifacts (${evidence.length})` },
    { value: 'verified', label: 'Verified / Reviewed' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'clarification', label: 'Requires Clarification' }
  ];

  return (
    <div className="ref-card" style={{ padding: '24px' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} className="text-cyan" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Verifiable Cryptographic & Telemetry Evidence Matrix
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-source verifiable artifacts ingested during autonomous triage across Payment, OMS, and Carrier gateways
          </p>
        </div>

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

      {/* Empty State */}
      {filteredEvidence.length === 0 ? (
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
            const isConflicting = (ev.status || '').toLowerCase().includes('conflict');
            const isClarification = (ev.status || '').toLowerCase().includes('clarification');

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
                {/* Top Row: Type & Verification Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        {ev.type || 'Telemetry Data'}
                      </span>
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

                {/* Evidence Metadata (Associated Case, Source, Timestamp) */}
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
                </div>

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

                {/* Optional Valid File/Image Preview if provided */}
                {ev.filePreviewUrl && (
                  <div style={{ marginTop: '4px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} />
                      <span>Submitted File Preview</span>
                    </div>
                    <img
                      src={ev.filePreviewUrl}
                      alt={ev.title}
                      style={{
                        width: '100%',
                        maxHeight: '140px',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--glass-border)'
                      }}
                    />
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
                            top: '6px',
                            right: '6px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '4px',
                            padding: '3px 8px',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '10px'
                          }}
                        >
                          {copiedId === ev.id ? <Check size={11} color="var(--status-emerald)" /> : <Copy size={11} />}
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
    </div>
  );
}
