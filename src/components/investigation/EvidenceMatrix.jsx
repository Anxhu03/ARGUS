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
  Filter
} from 'lucide-react';

export default function EvidenceMatrix({ evidence = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const getEvidenceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('financial') || t.includes('payment') || t.includes('stripe')) return CreditCard;
    if (t.includes('database') || t.includes('oms') || t.includes('order')) return Database;
    if (t.includes('log') || t.includes('queue') || t.includes('kafka') || t.includes('trace')) return Terminal;
    if (t.includes('spatial') || t.includes('gis') || t.includes('carrier') || t.includes('delivery')) return MapPin;
    if (t.includes('vision') || t.includes('camera') || t.includes('photo') || t.includes('upload')) return Camera;
    return FileText;
  };

  const handleCopyPayload = (id, payload) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvidence = statusFilter === 'all'
    ? evidence
    : evidence.filter(ev => ev.status.toLowerCase() === statusFilter.toLowerCase());

  const statePills = [
    { value: 'all', label: 'All Artifacts' },
    { value: 'verified', label: 'Verified' },
    { value: 'pending', label: 'Pending' },
    { value: 'conflicting', label: 'Conflicting' },
    { value: 'unavailable', label: 'Unavailable' }
  ];

  return (
    <div className="ref-card" style={{ padding: '24px' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="#0284c7" />
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>Verifiable Cryptographic & Telemetry Evidence Matrix</h3>
          </div>
          <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            Multi-source verifiable artifacts ingested during autonomous triage across Payment, OMS, and Carrier gateways
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
          {statePills.map(sp => (
            <button
              key={sp.value}
              onClick={() => setStatusFilter(sp.value)}
              style={{
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === sp.value ? '#ffffff' : 'transparent',
                color: statusFilter === sp.value ? '#0f172a' : '#64748b',
                boxShadow: statusFilter === sp.value ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              {sp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {filteredEvidence.map((ev) => {
          const Icon = getEvidenceIcon(ev.type);
          const isExpanded = expandedId === ev.id;
          const isConflicting = ev.status === 'Conflicting';

          return (
            <div
              key={ev.id}
              style={{
                borderRadius: '8px',
                background: '#ffffff',
                border: `1px solid ${isConflicting ? '#fca5a5' : '#e2e8f0'}`,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                boxShadow: isConflicting ? '0 0 12px rgba(239, 68, 68, 0.1)' : '0 1px 3px rgba(0,0,0,0.03)',
                borderLeft: `4px solid ${
                  ev.status === 'Verified'
                    ? '#16a34a'
                    : ev.status === 'Conflicting'
                      ? '#dc2626'
                      : ev.status === 'Pending'
                        ? '#ea580c'
                        : '#64748b'
                }`
              }}
            >
              {/* Top Row: Type & Verification Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      background: isConflicting ? '#fee2e2' : '#e0f2fe',
                      color: isConflicting ? '#dc2626' : '#0284c7'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
                      {ev.type}
                    </span>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>
                      {ev.id}
                    </div>
                  </div>
                </div>

                <StatusBadge status={ev.status} size="sm" />
              </div>

              {/* Title & Description */}
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                  {ev.title}
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  {ev.description}
                </p>
              </div>

              {/* Source & Timestamp Meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', paddingTop: '6px', borderTop: '1px solid #f1f5f9' }}>
                <span>Source: <strong style={{ color: '#0f172a' }}>{ev.source}</strong></span>
                <span style={{ fontFamily: 'var(--font-mono)', color: '#94a3b8' }}>{ev.timestamp}</span>
              </div>

              {/* Expandable Raw Payload View */}
              {ev.payload && (
                <div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                    style={{
                      width: '100%',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      color: '#64748b',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '4px'
                    }}
                  >
                    <span>{isExpanded ? 'Hide Raw JSON Payload' : 'Inspect Raw JSON Payload'}</span>
                    {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  </button>

                  {isExpanded && (
                    <div style={{ position: 'relative', marginTop: '8px' }}>
                      <pre
                        style={{
                          background: '#0f172a',
                          padding: '10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: '#38bdf8',
                          overflowX: 'auto',
                          maxHeight: '140px',
                          border: '1px solid #1e293b'
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
                          background: 'rgba(255, 255, 255, 0.15)',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '10px'
                        }}
                      >
                        {copiedId === ev.id ? <Check size={11} color="#4ade80" /> : <Copy size={11} />}
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
    </div>
  );
}
