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
  FileCheck,
  CreditCard,
  Server,
  Package,
  History,
  Check,
  ChevronRight,
  ExternalLink,
  Search
} from 'lucide-react';

export default function IntelligenceView() {
  const { currentView, navigateToCase, addToast } = useApp();
  const [patterns, setPatterns] = useState([]);
  const [prevention, setPrevention] = useState([]);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(currentView === 'patterns' ? 'patterns' : 'patterns');
  const [dimensionFilter, setDimensionFilter] = useState('all');
  const [historySearch, setHistorySearch] = useState('');

  useEffect(() => {
    let isMounted = true;
    Promise.all([api.getPatterns(), api.getPreventionRecommendations(), api.getCases()])
      .then(([pat, prev, cList]) => {
        if (isMounted) {
          setPatterns(pat);
          setPrevention(prev);
          setCases(cList);
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
    const nextStatus = currentStatus === 'Deployed' || currentStatus === 'Active in Production' ? 'Approved' : 'Deployed';
    await api.updatePreventionStatus(id, nextStatus);
    setPrevention(prev => prev.map(p => p.id === id ? { ...p, status: nextStatus } : p));
    addToast({
      type: 'success',
      title: 'Prevention Policy Updated',
      message: `Recommendation ${id} is now ${nextStatus}. System policy rules reloaded.`,
      duration: 3500
    });
  };

  const filteredPatterns = patterns.filter(pat => {
    if (dimensionFilter === 'all') return true;
    if (dimensionFilter === 'seller') return pat.dimension.toLowerCase().includes('seller');
    if (dimensionFilter === 'delivery') return pat.dimension.toLowerCase().includes('delivery') || pat.dimension.toLowerCase().includes('logistics');
    if (dimensionFilter === 'payment') return pat.dimension.toLowerCase().includes('payment');
    if (dimensionFilter === 'system') return pat.dimension.toLowerCase().includes('system') || pat.dimension.toLowerCase().includes('infra');
    if (dimensionFilter === 'product') return pat.dimension.toLowerCase().includes('warehouse') || pat.dimension.toLowerCase().includes('product');
    return true;
  });

  const filteredHistory = cases.filter(c => {
    if (!historySearch) return true;
    const q = historySearch.toLowerCase();
    return (
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.rootCause?.headline && c.rootCause.headline.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Banner: Continuous Intelligence Loop matching dark SaaS reference aesthetics */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, rgba(14, 20, 34, 0.95) 0%, rgba(18, 25, 42, 0.85) 100%)',
          border: '1px solid var(--glass-border-light)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--glass-shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--glass-border-cyan)',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 14px rgba(6, 182, 212, 0.22)'
              }}
            >
              <BrainCircuit size={20} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--accent-cyan-muted)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid var(--glass-border-cyan)',
                  letterSpacing: '0.05em'
                }}
              >
                LONGITUDINAL MEMORY & SYSTEMIC PREVENTION
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.01em' }}>
                Cross-Case Intelligence & Autonomous Pattern Engine
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--status-emerald)',
                background: 'var(--status-emerald-bg)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--status-emerald-border)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-emerald)', display: 'inline-block' }} />
              Neural Indexing Active
            </span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '920px', marginBottom: '18px' }}>
          ARGUS does not treat customer inquiries as isolated tickets. Every resolved investigation feeds into longitudinal
          institutional memory—automatically correlating recurring seller faults, delivery routing drifts, and payment
          infrastructure drops to execute proactive systemic prevention.
        </p>

        {/* Product Lifecycle Loop Diagram */}
        <div
          style={{
            padding: '14px 20px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-muted)' }}>1</span>
            <span>Complaint</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-primary)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--text-primary)' }}>2</span>
            <span>Investigation</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-purple)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--status-purple-bg)', border: '1px solid var(--status-purple-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--status-purple)' }}>3</span>
            <span>Root Cause</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-emerald)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--status-emerald-bg)', border: '1px solid var(--status-emerald-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--status-emerald)' }}>4</span>
            <span>Resolution</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-sky)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.28)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--accent-sky)' }}>5</span>
            <span>Case Memory</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--status-amber)' }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--status-amber-bg)', border: '1px solid var(--status-amber-border)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--status-amber)' }}>6</span>
            <span>Pattern Detection</span>
          </div>
          <ArrowRight size={14} color="var(--text-faint)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-cyan-muted)', border: '1px solid var(--glass-border-cyan)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: 'var(--accent-cyan)' }}>7</span>
            <span>Systemic Prevention</span>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="ref-metrics-grid">
        <MetricCard
          title="Active Patterns Detected"
          value={patterns.length || '5'}
          subtext="Seller, delivery, payment & system"
          delta="Real-time"
          deltaType="positive"
          icon={Network}
          accentColor="var(--status-amber)"
        />
        <MetricCard
          title="Prevention Interventions"
          value={prevention.length || '4'}
          subtext="Automated policy & quarantine rules"
          delta="3 Deployed"
          deltaType="positive"
          icon={Zap}
          accentColor="var(--accent-cyan)"
        />
        <MetricCard
          title="Historical Cases Indexed"
          value="482"
          subtext="Indexed in institutional memory"
          delta="+14 today"
          deltaType="positive"
          icon={History}
          accentColor="var(--status-purple)"
        />
        <MetricCard
          title="Quarterly Loss Prevented"
          value="$48.2k"
          subtext="Mitigated via automated rules"
          delta="Target: $60k"
          deltaType="positive"
          icon={ShieldCheck}
          accentColor="var(--status-emerald)"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`ref-pill-btn ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Network size={14} />
          <span>Cross-Case Patterns ({patterns.length})</span>
        </button>

        <button
          type="button"
          className={`ref-pill-btn ${activeTab === 'prevention' ? 'active' : ''}`}
          onClick={() => setActiveTab('prevention')}
        >
          <Zap size={14} />
          <span>Prevention Recommendations ({prevention.length})</span>
        </button>

        <button
          type="button"
          className={`ref-pill-btn ${activeTab === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          <History size={14} />
          <span>Case Memory & Historical Links</span>
        </button>

        <button
          type="button"
          className={`ref-pill-btn ${activeTab === 'protocols' ? 'active' : ''}`}
          onClick={() => setActiveTab('protocols')}
        >
          <ShieldCheck size={14} />
          <span>Adaptive Evidence Protocols</span>
        </button>
      </div>

      {/* TAB 1: Detected Patterns */}
      {activeTab === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          {/* Dimension Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginRight: '4px' }}>
                Filter Dimension:
              </span>
              {[
                { id: 'all', label: 'All Dimensions' },
                { id: 'seller', label: 'Seller Patterns' },
                { id: 'delivery', label: 'Delivery Patterns' },
                { id: 'payment', label: 'Payment Patterns' },
                { id: 'system', label: 'System Patterns' },
                { id: 'product', label: 'Product & Warehouse' }
              ].map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setDimensionFilter(f.id)}
                  className={`ref-filter-chip ${dimensionFilter === f.id ? 'active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Showing {filteredPatterns.length} of {patterns.length} verified patterns
            </div>
          </div>

          {loading ? (
            <LoadingState message="Correlating cross-case telemetry patterns..." />
          ) : (
            filteredPatterns.map((pat) => (
              <div
                key={pat.id}
                className="glass-panel"
                style={{
                  padding: '24px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--glass-shadow)',
                  borderLeft: `4px solid ${
                    pat.severity === 'Critical'
                      ? 'var(--status-rose)'
                      : pat.severity === 'High'
                      ? 'var(--status-amber)'
                      : 'var(--accent-cyan)'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: 'var(--accent-cyan)',
                          background: 'var(--accent-cyan-muted)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--glass-border-cyan)'
                        }}
                      >
                        {pat.id}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: 'var(--bg-elevated)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        {pat.dimension}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background:
                            pat.severity === 'Critical'
                              ? 'var(--status-rose-bg)'
                              : pat.severity === 'High'
                              ? 'var(--status-amber-bg)'
                              : 'var(--accent-cyan-muted)',
                          color:
                            pat.severity === 'Critical'
                              ? 'var(--status-rose)'
                              : pat.severity === 'High'
                              ? 'var(--status-amber)'
                              : 'var(--accent-cyan)',
                          border: `1px solid ${
                            pat.severity === 'Critical'
                              ? 'var(--status-rose-border)'
                              : pat.severity === 'High'
                              ? 'var(--status-amber-border)'
                              : 'var(--glass-border-cyan)'
                          }`
                        }}
                      >
                        {pat.severity} Severity
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Window: {pat.timeRange}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
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
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>
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
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
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
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
                    Systemic Interventions & Prevention Actions
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pat.recommendedActions?.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={14} color="var(--status-emerald)" style={{ flexShrink: 0 }} />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Cases Footer */}
                {pat.relatedCases && pat.relatedCases.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)', fontSize: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Correlated Investigations:</span>
                    {pat.relatedCases.map((rc) => (
                      <button
                        key={rc}
                        type="button"
                        className="btn btn-ghost btn-sm"
                        style={{
                          padding: '2px 8px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--accent-cyan)',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--glass-border-light)',
                          borderRadius: 'var(--radius-xs)'
                        }}
                        onClick={() => navigateToCase(rc)}
                      >
                        {rc} <ExternalLink size={10} style={{ marginLeft: '4px' }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Systemic Prevention Recommendations */}
      {activeTab === 'prevention' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }} className="animate-fade-in">
          {prevention.map((prev) => (
            <div
              key={prev.id}
              className="glass-panel"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'var(--bg-surface)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--glass-shadow)'
              }}
            >
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
                      borderRadius: 'var(--radius-full)',
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
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', fontSize: '11px', marginBottom: '14px' }}>
                  <div style={{ color: 'var(--text-muted)' }}>Estimated Impact:</div>
                  <div style={{ color: 'var(--status-emerald)', fontWeight: 600, marginTop: '2px' }}>{prev.impact}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    Triggered by: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{prev.triggeredBy}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn ${prev.status === 'Deployed' || prev.status === 'Active in Production' ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                  style={{ width: '100%' }}
                  onClick={() => handleApplyRecommendation(prev.id, prev.status)}
                >
                  <span>{prev.status === 'Deployed' || prev.status === 'Active in Production' ? 'Pause Rule Configuration' : 'Enforce Prevention Rule'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Case Memory & Historical Links */}
      {activeTab === 'memory' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Institutional Case Memory Index
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Resolved investigations archived into long-term pattern vector memory.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={14} color="var(--text-faint)" style={{ position: 'absolute', left: '10px', top: '11px', pointerEvents: 'none' }} />
                  <input
                    type="text"
                    placeholder="Search memory by case, root cause..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    className="input-field"
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto', width: '100%' }}>
              <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--glass-border)', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Case ID</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Verified Root Cause</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((c) => (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: '1px solid var(--glass-border)',
                        transition: 'background var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                        {c.id}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-primary)' }}>
                        {c.customer?.name}
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        <span style={{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--bg-elevated)', border: '1px solid var(--glass-border)' }}>
                          {c.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '340px' }}>
                        {c.rootCause?.headline || 'Autonomous verification complete'}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '4px 10px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          onClick={() => navigateToCase(c.id)}
                        >
                          <span>Review</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Dynamic Evidence Protocols */}
      {activeTab === 'protocols' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="animate-fade-in">
          <div
            className="glass-panel"
            style={{
              padding: '24px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--glass-shadow)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Adaptive Evidence Protocols
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              ARGUS adjusts verification stringency based on case context, dollar exposure, and observed pattern history:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid var(--status-emerald-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-emerald)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Low-Risk Tier (&lt; $50)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>
                  Normal Autonomous Verification
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Automated ledger check and tracking confirmation. Instant automated resolution without document request.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.08)', border: '1px solid var(--glass-border-cyan)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Medium-Risk Tier ($50 - $300)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>
                  Order & Packaging Validation
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Requests photo of shipping label barcode and packaging condition. Reconciles with carrier WMS scan.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.08)', border: '1px solid var(--status-amber-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-amber)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Recurring Quality Pattern
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>
                  Vision OCR Batch Verification
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Mandates macro photo of manufacturer expiry date stamp. Auto-cross-referenced with seller consignment lot.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid var(--status-rose-border)' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--status-rose)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  High Value / Strong Contradiction
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>
                  Physical Scale & Sensor Telemetry
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                  Enforces certified carrier drop-off weigh-in receipt and intake CCTV conveyor inspection. Transfers to human review.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
