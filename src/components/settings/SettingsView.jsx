import React, { useState } from 'react';
import GlassCard from '../common/GlassCard';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Cpu,
  Shield,
  Sliders,
  Database,
  Radio,
  CheckCircle2,
  Save,
  RotateCcw
} from 'lucide-react';

export default function SettingsView() {
  const { addToast } = useApp();
  const [consensusThreshold, setConsensusThreshold] = useState(95);
  const [autoResolveCap, setAutoResolveCap] = useState(500);
  const [geofenceTolerance, setGeofenceTolerance] = useState(150);
  const [visionOcrEnabled, setVisionOcrEnabled] = useState(true);

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Agent Configuration Saved',
      message: 'New consensus parameters propagated to Billing, Order, and Technical agents.'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '880px' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
          System Configuration & Agent Tuning
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          Tune autonomous thresholds, consensus requirements, and external mock service integrations
        </p>
      </div>

      {/* Autonomous Tuning Card */}
      <GlassCard style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <Sliders size={18} color="#0f172a" />
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Multi-Agent Consensus Thresholds</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Minimum Consensus Threshold for Auto-Resolution
              </label>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0284c7' }}>
                {consensusThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={consensusThreshold}
              onChange={(e) => setConsensusThreshold(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0284c7' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              If multi-agent confidence score falls below {consensusThreshold}%, the case automatically transfers to Human Review.
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Autonomous Resolution Dollar Cap
              </label>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#16a34a' }}>
                ${autoResolveCap}.00
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={autoResolveCap}
              onChange={(e) => setAutoResolveCap(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#16a34a' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Claims exceeding ${autoResolveCap}.00 mandate two-tier human supervisor authorization before fund release.
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Carrier Spatial Geofence Tolerance
              </label>
              <span style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#d97706' }}>
                {geofenceTolerance} meters
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="500"
              step="25"
              value={geofenceTolerance}
              onChange={(e) => setGeofenceTolerance(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#d97706' }}
            />
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Delivery scanner GPS offset greater than {geofenceTolerance}m flags a spatial contradiction for driver route audit.
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={15} />
            <span>Save Threshold Configuration</span>
          </button>
        </div>
      </GlassCard>

      {/* Connected Services & Mock Integrations */}
      <GlassCard style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Radio size={18} color="#16a34a" />
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Active Integrations & Mock Service Gateways</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { name: 'Stripe Gateway Live API', status: 'Connected (182ms)', type: 'Financial Ledger' },
            { name: 'PostgreSQL Core OMS Cluster', status: 'Healthy (4ms)', type: 'Inventory & Order State' },
            { name: 'FastTrack Logistics Telemetry Webhooks', status: 'Active (Ingress Stream)', type: 'Carrier GPS Telemetry' },
            { name: 'Kafka Cluster (payment-events-dlq)', status: 'Connected (0 backlog)', type: 'Event Bus' },
            { name: 'ARGUS Vision OCR Engine', status: 'Ready (v2.1 GPU accelerated)', type: 'Computer Vision' }
          ].map((svc, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: 'var(--radius-sm)',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                fontSize: '13px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>{svc.name}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{svc.type}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontSize: '12px', fontWeight: 500 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16a34a' }} />
                <span>{svc.status}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Developer Environment & Ownership Card */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
          Workspace Identity & Git Branch
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div>
            <span style={{ color: '#64748b' }}>Frontend Owner:</span>
            <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>Anxhu — Frontend 1</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Active Branch:</span>
            <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#0284c7', marginTop: '2px' }}>anxhu/frontend-1</div>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Platform Engine:</span>
            <div style={{ fontWeight: 600, color: '#0f172a', marginTop: '2px' }}>ARGUS Core v4.2 Production</div>
          </div>
        </div>
      </div>
    </div>
  );
}
