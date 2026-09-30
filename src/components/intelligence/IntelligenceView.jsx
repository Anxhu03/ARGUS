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
      message: `Recommendation ${id} is now ${nextStatus}. System policy rules reloaded.`
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
      {/* Banner: Continuous Intelligence Loop matching reference card aesthetics */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#0f172a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <BrainCircuit size={18} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '100px',
                  background: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #e2e8f0',
                  letterSpacing: '0.04em'
                }}
              >
                LONGITUDINAL MEMORY & SYSTEMIC PREVENTION
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
                Cross-Case Intelligence & Autonomous Pattern Engine
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#16a34a',
                background: '#f0fdf4',
                padding: '4px 10px',
                borderRadius: '100px',
                border: '1px solid #bbf7d0'
              }}
            >
              ● Neural Indexing Active
            </span>
          </div>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, maxWidth: '880px', marginBottom: '16px' }}>
          ARGUS does not treat customer inquiries as isolated tickets. Every resolved investigation feeds into longitudinal
          institutional memory—automatically correlating recurring seller faults, delivery routing drifts, and payment
          infrastructure drops to execute proactive systemic prevention.
        </p>

        {/* Product Lifecycle Loop Diagram */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            fontSize: '12px',
            fontWeight: 600
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>1</span>
            <span>Complaint</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#e2e8f0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>2</span>
            <span>Investigation</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7c3aed' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#ede9fe', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>3</span>
            <span>Root Cause</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dcfce7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>4</span>
            <span>Resolution</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563eb' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#dbeafe', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>5</span>
            <span>Case Memory</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d97706' }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fef3c7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>6</span>
            <span>Pattern Detection</span>
          </div>
          <ArrowRight size={14} color="#94a3b8" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: 700 }}>
            <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#bbf7d0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>7</span>
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
          accentColor="#d97706"
        />
        <MetricCard
          title="Prevention Interventions"
          value={prevention.length || '4'}
          subtext="Automated policy & quarantine rules"
          delta="3 Deployed"
          deltaType="positive"
          icon={Zap}
          accentColor="#0284c7"
        />
        <MetricCard
          title="Historical Cases Indexed"
          value="482"
          subtext="Indexed in institutional memory"
          delta="+14 today"
          deltaType="positive"
          icon={History}
          accentColor="#7c3aed"
        />
        <MetricCard
          title="Quarterly Loss Prevented"
          value="$48.2k"
          subtext="Mitigated via automated rules"
          delta="Target: $60k"
          deltaType="positive"
          icon={ShieldCheck}
          accentColor="#16a34a"
        />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', flexWrap: 'wrap' }}>
        <button
          className={`ref-pill-btn ${activeTab === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveTab('patterns')}
        >
          <Network size={14} />
          <span>Cross-Case Patterns ({patterns.length})</span>
        </button>

        <button
          className={`ref-pill-btn ${activeTab === 'prevention' ? 'active' : ''}`}
          onClick={() => setActiveTab('prevention')}
        >
          <Zap size={14} />
          <span>Prevention Recommendations ({prevention.length})</span>
        </button>

        <button
          className={`ref-pill-btn ${activeTab === 'memory' ? 'active' : ''}`}
          onClick={() => setActiveTab('memory')}
        >
          <History size={14} />
          <span>Case Memory & Historical Links</span>
        </button>

        <button
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
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginRight: '4px' }}>
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
                  onClick={() => setDimensionFilter(f.id)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '12px',
                    fontWeight: 500,
                    border: '1px solid',
                    borderColor: dimensionFilter === f.id ? '#0f172a' : '#e2e8f0',
                    background: dimensionFilter === f.id ? '#0f172a' : '#ffffff',
                    color: dimensionFilter === f.id ? '#ffffff' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: '12px', color: '#64748b' }}>
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
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  borderLeft: `4px solid ${
                    pat.severity === 'Critical'
                      ? '#ef4444'
                      : pat.severity === 'High'
                      ? '#f59e0b'
                      : '#0284c7'
                  }`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        {pat.id}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '100px',
                          background: '#f1f5f9',
                          color: '#475569',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        {pat.dimension}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '100px',
                          background: pat.severity === 'Critical' ? '#fee2e2' : pat.severity === 'High' ? '#fef3c7' : '#e0f2fe',
                          color: pat.severity === 'Critical' ? '#b91c1c' : pat.severity === 'High' ? '#b45309' : '#0369a1'
                        }}
                      >
                        {pat.severity} Severity
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        Window: {pat.timeRange}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                      {pat.title}
                    </h3>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Correlated Cases</div>
                    <div style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#d97706' }}>
                      {pat.affectedCasesCount} Cases
                    </div>
                  </div>
                </div>

                {/* Observation Narrative */}
                <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
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
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    marginBottom: '16px'
                  }}
                >
                  <div>
                    <span style={{ color: '#64748b' }}>Affected Targets: </span>
                    <strong style={{ color: '#0f172a' }}>{pat.affectedProducts?.join(', ')}</strong>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#64748b' }}>Evidence Consistency: </span>
                    <span style={{ color: '#16a34a', fontWeight: 600 }}>{pat.consistencyScore}</span>
                  </div>
                </div>

                {/* Actionable Recommendations */}
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '0.05em', marginBottom: '8px', display: 'block' }}>
                    Systemic Interventions & Prevention Actions
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {pat.recommendedActions?.map((act, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#475569' }}>
                        <CheckCircle2 size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Related Cases Footer */}
                {pat.relatedCases && pat.relatedCases.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', fontSize: '12px', flexWrap: 'wrap' }}>
                    <span style={{ color: '#64748b' }}>Correlated Investigations:</span>
                    {pat.relatedCases.map((rc) => (
                      <button
                        key={rc}
                        className="btn btn-ghost btn-sm"
                        style={{ padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#0f172a', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '4px' }}
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
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#0f172a', fontWeight: 700 }}>
                    {prev.id}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '100px',
                      background: prev.status === 'Deployed' || prev.status === 'Active in Production'
                        ? '#dcfce7'
                        : '#fef3c7',
                      color: prev.status === 'Deployed' || prev.status === 'Active in Production'
                        ? '#15803d'
                        : '#b45309',
                      border: `1px solid ${
                        prev.status === 'Deployed' || prev.status === 'Active in Production'
                          ? '#bbf7d0'
                          : '#fde68a'
                      }`
                    }}
                  >
                    {prev.status}
                  </span>
                </div>

                <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                  {prev.title}
                </h4>

                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                  {prev.description}
                </p>
              </div>

              <div>
                <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '11px', marginBottom: '14px' }}>
                  <div style={{ color: '#64748b' }}>Estimated Impact:</div>
                  <div style={{ color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>{prev.impact}</div>
                  <div style={{ color: '#64748b', marginTop: '4px' }}>
                    Triggered by: <span style={{ color: '#0f172a', fontWeight: 500 }}>{prev.triggeredBy}</span>
                  </div>
                </div>

                <button
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
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
                  Institutional Case Memory Index
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Resolved investigations archived into long-term pattern vector memory.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                  <input
                    type="text"
                    placeholder="Search memory by case, root cause..."
                    value={historySearch}
                    onChange={(e) => setHistorySearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 32px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #e2e8f0',
                      background: '#f8fafc',
                      fontSize: '12px'
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Case ID</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Customer</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Verified Root Cause</th>
                    <th style={{ padding: '10px 12px', fontWeight: 600 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((c) => (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#0f172a' }}>
                        {c.id}
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>
                        {c.customer?.name}
                      </td>
                      <td style={{ padding: '12px', color: '#64748b' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '100px', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                          {c.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#475569', maxWidth: '340px' }}>
                        {c.rootCause?.headline || 'Autonomous verification complete'}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: '#0f172a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
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
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '6px' }}>
              Adaptive Evidence Protocols
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
              ARGUS adjusts verification stringency based on case context, dollar exposure, and observed pattern history:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase' }}>
                  Low-Risk Tier (&lt; $50)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '4px', marginBottom: '6px' }}>
                  Normal Autonomous Verification
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  Automated ledger check and tracking confirmation. Instant automated resolution without document request.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase' }}>
                  Medium-Risk Tier ($50 - $300)
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '4px', marginBottom: '6px' }}>
                  Order & Packaging Validation
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  Requests photo of shipping label barcode and packaging condition. Reconciles with carrier WMS scan.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#fefce8', border: '1px solid #fef08a' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#a16207', textTransform: 'uppercase' }}>
                  Recurring Quality Pattern
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '4px', marginBottom: '6px' }}>
                  Vision OCR Batch Verification
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                  Mandates macro photo of manufacturer expiry date stamp. Auto-cross-referenced with seller consignment lot.
                </p>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#fff1f2', border: '1px solid #fecdd3' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#be123c', textTransform: 'uppercase' }}>
                  High Value / Strong Contradiction
                </span>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginTop: '4px', marginBottom: '6px' }}>
                  Physical Scale & Sensor Telemetry
                </h4>
                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
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
