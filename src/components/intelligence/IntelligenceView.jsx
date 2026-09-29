import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import GlassCard from '../common/GlassCard';
import MetricCard from '../common/MetricCard';
import LoadingState from '../common/LoadingState';
import {
  BrainCircuit,
  Network,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Building2,
  Truck,
  FileCheck
} from 'lucide-react';

export default function IntelligenceView() {
  const { navigateToCase, addToast } = useApp();
  const [patterns, setPatterns] = useState([]);
  const [prevention, setPrevention] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patterns'); // 'patterns' | 'prevention' | 'protocols'

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getPatterns(), api.getPreventionRecommendations()])
      .then(([pat, prev]) => {
        if (isMounted) {
          setPatterns(pat);
          setPrevention(prev);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  const handleApplyRecommendation = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Deployed' ? 'Approved' : 'Deployed';
    await api.updatePreventionStatus(id, nextStatus);
    setPrevention(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    addToast({
      type: 'success',
      title: 'Prevention Policy Updated',
      message: `Recommendation ${id} is now ${nextStatus}. System policy rules reloaded.`
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner: Continuous Loop Story */}
      <GlassCard
        glow
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(14, 21, 37, 0.9) 0%, rgba(20, 15, 38, 0.95) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <BrainCircuit size={20} color="var(--accent-cyan)" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(0, 242, 254, 0.15)',
              color: 'var(--accent-cyan)',
              border: '1px solid rgba(0, 242, 254, 0.3)',
              letterSpacing: '0.06em'
            }}
          >
            LONGITUDINAL INTELLIGENCE & PREVENTION LOOP
          </span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
          Cross-Case Memory & Systemic Pattern Prevention
        </h2>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '820px' }}>
          ARGUS does not treat tickets in isolation. Case resolutions feed into long-term memory to detect systemic
          vendor discrepancies, carrier spatial anomalies, and infrastructure drops before they compound.
        </p>

        {/* Product Lifecycle Loop Diagram */}
        <div
          style={{
            marginTop: '16px',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          <span style={{ color: 'var(--text-muted)' }}>Complaint</span>
          <ArrowRight size={12} color="var(--accent-cyan)" />
          <span style={{ color: 'var(--accent-cyan)' }}>Investigation</span>
          <ArrowRight size={12} color="var(--accent-cyan)" />
          <span style={{ color: 'var(--status-purple)' }}>Root Cause</span>
          <ArrowRight size={12} color="var(--status-purple)" />
          <span style={{ color: 'var(--status-emerald)' }}>Resolution</span>
          <ArrowRight size={12} color="var(--status-emerald)" />
          <span style={{ color: 'var(--accent-blue)' }}>Case Memory</span>
          <ArrowRight size={12} color="var(--accent-blue)" />
          <span style={{ color: 'var(--status-amber)' }}>Pattern Detection</span>
          <ArrowRight size={12} color="var(--status-amber)" />
          <span style={{ color: 'var(--status-emerald)' }}>Prevention</span>
        </div>
      </GlassCard>

      {/* Metric Cards Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <MetricCard
          title="Active Patterns Detected"
          value={patterns.length || '4'}
          subtext="Seller, carrier & infra clusters"
          delta="Real-time"
          deltaType="positive"
          icon={Network}
          accentColor="var(--status-amber)"
        />
        <MetricCard
          title="Avg Customer Reliability"
          value="93.8%"
          subtext="Indexed on verified resolution proofs"
          delta="+1.4%"
          deltaType="positive"
          icon={ShieldCheck}
          accentColor="var(--status-emerald)"
        />
        <MetricCard
          title="Prevention Interventions"
          value={prevention.length || '4'}
          subtext="Automated quarantine & SLA rules"
          delta="3 Deployed"
          deltaType="positive"
          icon={Zap}
          accentColor="var(--accent-cyan)"
        />
        <MetricCard
          title="Systemic Waste Prevented"
          value="$48.2k"
          subtext="Estimated quarterly loss mitigation"
          delta="Target: $60k"
          deltaType="positive"
          icon={TrendingUp}
          accentColor="var(--status-purple)"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '4px' }}>
        <button
          className={`btn ${activeTab === 'patterns' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('patterns')}
        >
          <span>Detected Cross-Case Patterns ({patterns.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'prevention' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('prevention')}
        >
          <span>Systemic Prevention Recommendations ({prevention.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'protocols' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setActiveTab('protocols')}
        >
          <span>Dynamic Evidence Protocols</span>
        </button>
      </div>

      {/* TAB 1: Detected Patterns */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          {loading ? (
            <LoadingState message="Correlating cross-case telemetry patterns..." />
          ) : (
            patterns.map((pat) => (
              <GlassCard
                key={pat.id}
                style={{
                  padding: '24px',
                  borderLeft: `4px solid ${
                    pat.severity === 'Critical'
                      ? 'var(--status-rose)'
                      : pat.severity === 'High'
                      ? 'var(--status-amber)'
                      : 'var(--accent-cyan)'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {pat.id}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {pat.dimension}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: pat.severity === 'Critical' ? 'var(--status-rose)' : pat.severity === 'High' ? 'var(--status-amber)' : 'var(--accent-cyan)'
                        }}
                      >
                        {pat.severity} Severity
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Window: {pat.timeRange}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {pat.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Correlated Cases</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--status-amber)' }}>
                      {pat.affectedCasesCount} Cases
                    </div>
                  </div>
                </div>

                {/* Observation Narrative */}
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {pat.observation}
                </p>

                {/* Affected Entities & Consistency */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    fontSize: '12px',
                    marginBottom: '16px'
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Affected Targets: </span>
                    <strong style={{ color: 'var(--text-primary)' }}>{pat.affectedProducts?.join(', ')}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Evidence Consistency: </span>
                    <span style={{ color: 'var(--status-emerald)', fontWeight: 600 }}>{pat.consistencyScore}</span>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-cyan)', marginBottom: '8px', display: 'block' }}>
                    Observed Systemic Interventions
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pat.recommendedActions?.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Cases Footer */}
                {pat.relatedCases && pat.relatedCases.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', fontSize: '12px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Correlated Investigations:</span>
                    {pat.relatedCases.map((rc) => (
                      <button
                        key={rc}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 6px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}
                        onClick={() => navigateToCase(rc)}
                      >
                        {rc}
                      </button>
                    ))}
                  </div>
                )}
              </GlassCard>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Systemic Prevention */}
      {activeTab === 'prevention' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }} className="animate-fade-in">
          {prevention.map((prev) => (
            <GlassCard key={prev.id} style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    {prev.id}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-sm)',
                      background: prev.status === 'Deployed' || prev.status === 'Active in Production'
                        ? 'var(--status-emerald-bg)'
                        : 'var(--status-amber-bg)',
                      color: prev.status === 'Deployed' || prev.status === 'Active in Production'
                        ? 'var(--status-emerald)'
                        : 'var(--status-amber)',
                      border: `1px solid ${
                        prev.status === 'Deployed' || prev.status === 'Active in Production'
                          ? 'var(--status-emerald-border)'
                          : 'var(--status-amber-border)'
                      }`
                    }}
                  >
                    {prev.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                  {prev.title}
                </h4>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {prev.description}
                </p>
              </div>

              <div>
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', fontSize: '11px', marginBottom: '14px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Estimated Impact:</div>
                  <div style={{ color: 'var(--status-emerald)', fontWeight: 600, marginTop: '2px' }}>{prev.impact}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    Triggered by: <span style={{ color: 'var(--text-secondary)' }}>{prev.triggeredBy}</span>
                  </div>
                </div>

                <button
                  className={`btn ${prev.status === 'Deployed' ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ width: '100%' }}
                  onClick={() => handleApplyRecommendation(prev.id, prev.status)}
                >
                  <span>{prev.status === 'Deployed' ? 'Pause Rule Configuration' : 'Enforce Prevention Rule'}</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* TAB 3: Dynamic Evidence Protocols */}
      {activeTab === 'protocols' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          <GlassCard style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
              Adaptive Evidence Protocols
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              ARGUS adjusts verification stringency based on case context, dollar exposure, and observed pattern history:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-emerald)', textTransform: 'uppercase' }}>
                  Low-Risk Tier (&lt; $50)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', marginBottom: '6px' }}>
                  Normal Autonomous Verification
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Automated ledger check and tracking confirmation. Instant automated resolution without document request.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
                  Medium-Risk Tier ($50 - $300)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', marginBottom: '6px' }}>
                  Order & Packaging Validation
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Requests photo of shipping label barcode and packaging condition. Reconciles with carrier WMS scan.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-amber)', textTransform: 'uppercase' }}>
                  Recurring Quality Pattern
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', marginBottom: '6px' }}>
                  Vision OCR Batch Verification
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Mandates macro photo of manufacturer expiry date stamp. Auto-cross-referenced with seller consignment lot.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-rose)', textTransform: 'uppercase' }}>
                  High Value / Strong Contradiction
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginTop: '4px', marginBottom: '6px' }}>
                  Physical Scale & Sensor Telemetry
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Enforces certified carrier drop-off weigh-in receipt and intake CCTV conveyor inspection. Transfers to human review.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
