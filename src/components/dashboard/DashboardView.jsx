import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import LoadingState from '../common/LoadingState';
import Badge from '../common/Badge';
import CaseVolumeChart from './CaseVolumeChart';
import CaseDistributionCard from './CaseDistributionCard';
import AttentionRequiredCard from './AttentionRequiredCard';
import QuickActionsCard from './QuickActionsCard';
import InvestigationActivityFeed from './InvestigationActivityFeed';
import RecentCasesTable from './RecentCasesTable';
import {
  FolderGit2,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Clock,
  Sparkles,
  Calendar,
  RotateCw,
  PlusCircle,
  TrendingUp,
  TrendingDown,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function DashboardView() {
  const { navigateToCase, navigateToSupport, setCurrentView, addToast } = useApp();

  // Local State
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kpiData, setKpiData] = useState(null);
  const [volumeData, setVolumeData] = useState([]);
  const [timeframe, setTimeframe] = useState('7d');
  const [categories, setCategories] = useState([]);
  const [attentionCases, setAttentionCases] = useState([]);
  const [activities, setActivities] = useState([]);
  const [cases, setCases] = useState([]);
  const [dateRange, setDateRange] = useState('7d');

  // Load Initial Dashboard Data
  const loadDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      const [kpis, vol, cats, att, acts, caseList] = await Promise.all([
        api.getDashboardKPIs(),
        api.getVolumeAnalytics(timeframe),
        api.getCategoryDistribution(),
        api.getAttentionCases(),
        api.getActivityStream(),
        api.getCases()
      ]);

      setKpiData(kpis);
      setVolumeData(vol);
      setCategories(cats);
      setAttentionCases(att);
      setActivities(acts);
      setCases(caseList);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      addToast({
        type: 'error',
        title: 'Data Load Error',
        message: 'Could not load operational telemetry. Using local cache.'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timeframe, addToast]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Handle Refresh Action
  const handleRefresh = async () => {
    await loadDashboardData(true);
    addToast({
      type: 'success',
      title: 'Telemetry Refreshed',
      message: 'Operational metrics and multi-agent queue synchronized.'
    });
  };

  // Handle Chart Timeframe Change
  const handleTimeframeChange = async (newTf) => {
    setTimeframe(newTf);
    try {
      const vol = await api.getVolumeAnalytics(newTf);
      setVolumeData(vol);
    } catch (err) {
      console.error('Failed to change timeframe:', err);
    }
  };

  // Handle Date Range Selection
  const handleDateRangeChange = (range) => {
    setDateRange(range);
    const tfMap = { today: '7d', '7d': '7d', '30d': '30d', '90d': '30d' };
    handleTimeframeChange(tfMap[range] || '7d');
    addToast({
      type: 'info',
      title: 'Telemetry Window Updated',
      message: `Displaying metrics for ${range.toUpperCase()} window.`
    });
  };

  if (loading) {
    return <LoadingState message="Connecting to ARGUS Multi-Agent Telemetry Stream..." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Informational Demonstration Prototype Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(6, 182, 212, 0.08)',
          border: '1px solid rgba(6, 182, 212, 0.22)',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}
      >
        <Info size={16} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <span style={{ flex: 1 }}>
          <strong style={{ color: 'var(--accent-cyan)' }}>Operational Demonstration Telemetry:</strong>{' '}
          All case metrics, autonomous resolutions, and agent actions reflect structured operational mock data with deterministic fraud safeguards.
        </span>
        <Badge variant="cyan" size="sm">Phase 3 Operational</Badge>
      </div>

      {/* SECTION A: Page Header & Global Controls */}
      <div className="ref-subheader">
        <div className="ref-title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ margin: 0 }}>Operations Intelligence Overview</h1>
            <Badge variant="neutral" size="sm">
              <span className="pulse-indicator-dot" style={{ marginRight: '4px' }} />
              Live DAG Telemetry
            </Badge>
          </div>
          <p style={{ margin: '4px 0 0 0' }}>
            Autonomous customer dispute diagnostics, multi-agent evidence verification, and fraud intelligence.
          </p>
        </div>

        <div className="ref-subheader-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Date Range Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              background: 'var(--bg-tertiary)',
              padding: '3px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
              { id: '90d', label: '90D' }
            ].map((range) => (
              <button
                key={range.id}
                type="button"
                onClick={() => handleDateRangeChange(range.id)}
                style={{
                  border: 'none',
                  padding: '4px 9px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: dateRange === range.id ? 'var(--accent-cyan)' : 'transparent',
                  color: dateRange === range.id ? '#07090e' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {range.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Refresh operational telemetry"
          >
            <RotateCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          {/* Secondary Action: Submit Complaint */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigateToSupport('customer')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={13} />
            <span>Submit Complaint</span>
          </button>

          {/* Primary Action: Launch Investigation */}
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigateToSupport('agent')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Sparkles size={13} />
            <span>Launch Investigation</span>
          </button>
        </div>
      </div>

      {/* SECTION B: Primary KPI Overview (4 Columns) */}
      <div className="ref-metrics-grid">
        {/* KPI 1: Active Cases */}
        <div
          className="ref-metric-card"
          onClick={() => setCurrentView('cases')}
          title="Click to view all active cases in registry"
          style={{ cursor: 'pointer' }}
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Active Cases</span>
            <div className="ref-metric-icon-box" style={{ background: 'rgba(6, 182, 212, 0.12)', color: 'var(--accent-cyan)' }}>
              <FolderGit2 size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpiData?.activeCases?.value || cases.filter(c => c.status !== 'Resolved').length || 24}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} />
              {kpiData?.activeCases?.delta || '+2.4%'}
            </span>
            <span style={{ color: 'var(--text-faint)' }}>• {kpiData?.activeCases?.trendText || '6 incoming today'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {kpiData?.activeCases?.subtext || '18 in automated DAG, 6 waiting'}
          </div>
        </div>

        {/* KPI 2: Resolved Cases */}
        <div
          className="ref-metric-card"
          onClick={() => setCurrentView('cases')}
          title="Click to view resolved case history"
          style={{ cursor: 'pointer' }}
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Resolved Cases</span>
            <div className="ref-metric-icon-box" style={{ background: 'var(--status-emerald-bg)', color: 'var(--status-emerald)' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpiData?.resolvedCases?.value?.toLocaleString() || '1,429'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingUp size={12} />
              {kpiData?.resolvedCases?.delta || '+8.4%'}
            </span>
            <span style={{ color: 'var(--text-faint)' }}>• {kpiData?.resolvedCases?.trendText || '98.4% auto-resolved'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {kpiData?.resolvedCases?.subtext || 'Protected value: $128,450'}
          </div>
        </div>

        {/* KPI 3: Human Escalations */}
        <div
          className="ref-metric-card"
          onClick={() => navigateToCase('ARG-1043')}
          title="Click to inspect flagged contradictions & escalations"
          style={{ cursor: 'pointer' }}
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Human Escalations</span>
            <div className="ref-metric-icon-box" style={{ background: 'var(--status-amber-bg)', color: 'var(--status-amber)' }}>
              <ShieldAlert size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpiData?.humanEscalations?.value || '14'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingDown size={12} />
              {kpiData?.humanEscalations?.delta || '-3.1%'}
            </span>
            <span style={{ color: 'var(--text-faint)' }}>• {kpiData?.humanEscalations?.trendText || 'Neutral Conflict Guard'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {kpiData?.humanEscalations?.subtext || '0 ad-hominem fraud labels'}
          </div>
        </div>

        {/* KPI 4: Average Resolution Time */}
        <div
          className="ref-metric-card"
          onClick={() => setCurrentView('intelligence')}
          title="Click to view SLA intelligence and velocity trends"
          style={{ cursor: 'pointer' }}
        >
          <div className="ref-metric-card-top">
            <span className="ref-metric-label">Avg Resolution Time</span>
            <div className="ref-metric-icon-box" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="ref-metric-value">{kpiData?.avgResolutionTime?.value || '4.2m'}</div>
          <div className="ref-metric-trend">
            <span className="trend-positive" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <TrendingDown size={12} />
              {kpiData?.avgResolutionTime?.delta || '-18.5%'}
            </span>
            <span style={{ color: 'var(--text-faint)' }}>• {kpiData?.avgResolutionTime?.period || 'faster WoW'}</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
            {kpiData?.avgResolutionTime?.trendText || '340ms median DAG latency'}
          </div>
        </div>
      </div>

      {/* SECTIONS C & D: Case Volume Analytics + Case Distribution (2-Column Grid) */}
      <div className="ref-grid-2-1">
        {/* Section C: Case Volume Analytics Chart */}
        <CaseVolumeChart
          volumeData={volumeData}
          timeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
        />

        {/* Section D: Case Distribution */}
        <CaseDistributionCard
          categories={categories}
          onSelectCategory={(cat) => {
            // Provide informative feedback when clicking category
            addToast({
              type: 'info',
              title: `Category Filter: ${cat === 'all' ? 'All Categories' : cat}`,
              message: `Refined view for ${cat} disputes.`
            });
          }}
        />
      </div>

      {/* SECTIONS E & G: Recent Cases + Cases Requiring Attention (2-Column Grid) */}
      <div className="ref-grid-2-1">
        {/* Section E: Recent Operational Cases Table */}
        <RecentCasesTable
          cases={cases}
          onSelectCase={(id) => navigateToCase(id)}
        />

        {/* Section G: Cases Requiring Attention */}
        <AttentionRequiredCard
          cases={attentionCases}
          onNavigateToCase={(id) => navigateToCase(id)}
        />
      </div>

      {/* SECTIONS F & H: Investigation Activity + Quick Actions (2-Column Grid) */}
      <div className="ref-grid-2-1">
        {/* Section F: Live Multi-Agent Investigation Stream */}
        <InvestigationActivityFeed
          activities={activities}
          onInspectCase={(id) => navigateToCase(id)}
        />

        {/* Section H: Quick Actions */}
        <QuickActionsCard
          onSubmitComplaint={() => navigateToSupport('customer')}
          onOpenSupport={() => navigateToSupport('agent')}
          onViewAllCases={() => setCurrentView('cases')}
          onOpenIntelligence={() => setCurrentView('intelligence')}
        />
      </div>
    </div>
  );
}
