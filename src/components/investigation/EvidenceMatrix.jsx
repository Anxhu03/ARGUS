import React, { useState } from 'react';
import GlassCard from '../common/GlassCard';
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
  Check
} from 'lucide-react';

export default function EvidenceMatrix({ evidence = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const getEvidenceIcon = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('financial') || t.includes('payment')) return CreditCard;
    if (t.includes('database')) return Database;
    if (t.includes('log') || t.includes('queue')) return Terminal;
    if (t.includes('spatial') || t.includes('gis') || t.includes('carrier')) return MapPin;
    if (t.includes('vision') || t.includes('camera') || t.includes('photo')) return Camera;
    return FileText;
  };

  const handleCopyPayload = (id, payload) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <GlassCard style={{ padding: '24px' }}>
      {/* Panel Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Cryptographic & System Evidence Matrix</h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Multi-source verifiable artifacts ingested during autonomous triage
          </p>
        </div>

        <span
          style={{
            fontSize: '11px',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-secondary)'
          }}
        >
          {evidence.length} Evidence Artifacts Captured
        </span>
      </div>

      {/* Evidence Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {evidence.map((ev) => {
          const Icon = getEvidenceIcon(ev.type);
          const isExpanded = expandedId === ev.id;
          const isConflicting = ev.status === 'Conflicting';

          return (
            <div
              key={ev.id}
              style={{
                borderRadius: 'var(--radius-md)',
                background: 'rgba(10, 16, 28, 0.65)',
                border: `1px solid ${isConflicting ? 'var(--status-rose-border)' : 'var(--glass-border)'}`,
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                transition: 'border-color var(--transition-fast)'
              }}
            >
              {/* Top Row: Type & Verification Status */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      padding: '5px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'rgba(0, 242, 254, 0.08)',
                      color: isConflicting ? 'var(--status-rose)' : 'var(--accent-cyan)'
                    }}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      {ev.type}
                    </span>
                    <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-faint)' }}>
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
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {ev.description}
                </p>
              </div>

              {/* Source & Timestamp Meta */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', paddingTop: '6px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <span>Source: <strong style={{ color: 'var(--text-secondary)' }}>{ev.source}</strong></span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>{ev.timestamp}</span>
              </div>

              {/* Expandable Raw Payload View */}
              {ev.payload && (
                <div>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : ev.id)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '5px 10px',
                      color: 'var(--text-muted)',
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
                          background: '#040711',
                          padding: '10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent-cyan)',
                          overflowX: 'auto',
                          maxHeight: '140px',
                          border: '1px solid rgba(0, 242, 254, 0.15)'
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
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          padding: '4px 6px',
                          color: '#fff',
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
    </GlassCard>
  );
}
