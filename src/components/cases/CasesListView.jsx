import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import PageHeader from '../common/PageHeader';
import Card from '../common/Card';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import SearchInput from '../common/SearchInput';
import MetricCard from '../common/MetricCard';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import {
  FolderGit2,
  Filter,
  ArrowUpDown,
  Search,
  PlusCircle,
  RefreshCw,
  Table as TableIcon,
  LayoutGrid,
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Users,
  AlertTriangle,
  User,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function CasesListView() {
  const { navigateToCase, navigateToSupport, addToast } = useApp();

  const [cases, setCases] = useState([]);
  const [allCasesCount, setAllCasesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Fetch cases from API with current filter set
  const fetchCases = () => {
    setLoading(true);
    api.getCases({
      query: searchQuery,
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter,
      dateRange: dateFilter,
      sortBy
    })
      .then(data => {
        setCases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  // Initial load & overall count
  useEffect(() => {
    api.getCases({ status: 'all', category: 'all', priority: 'all' })
      .then(allData => {
        setAllCasesCount(allData.length);
      })
      .catch(console.error);
  }, []);

  // Re-fetch whenever filters change
  useEffect(() => {
    fetchCases();
  }, [statusFilter, categoryFilter, priorityFilter, dateFilter, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCases();
  };

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    priorityFilter !== 'all' ||
    dateFilter !== 'all' ||
    sortBy !== 'date_desc'
  );

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setPriorityFilter('all');
    setSortBy('date_desc');
  };

  // Metrics calculations for the top summary cards
  const metrics = useMemo(() => {
    const total = cases.length;
    const open = cases.filter(c => {
      const s = (c.status || '').toLowerCase();
      return !s.includes('resolv');
    }).length;
    const inProgress = cases.filter(c => (c.status || '').toLowerCase().includes('investigat')).length;
    const resolved = cases.filter(c => (c.status || '').toLowerCase().includes('resolv')).length;
    const escalated = cases.filter(c => {
      const s = (c.status || '').toLowerCase();
      return s.includes('human') || s.includes('escalat') || s.includes('contradict');
    }).length;

    return { total, open, inProgress, resolved, escalated };
  }, [cases]);

  // Priority badge styling helper
  const renderPriorityBadge = (prio) => {
    const p = (prio || 'Medium').toLowerCase();
    if (p === 'urgent' || p === 'critical') {
      return (
        <Badge variant="danger" size="sm" dot>
          {prio || 'Critical'}
        </Badge>
      );
    }
    if (p === 'high') {
      return (
        <Badge variant="warning" size="sm" dot>
          High
        </Badge>
      );
    }
    if (p === 'medium') {
      return (
        <Badge variant="cyan" size="sm">
          Medium
        </Badge>
      );
    }
    return (
      <Badge variant="neutral" size="sm">
        Low
      </Badge>
    );
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'contradiction', label: 'Contradiction Detected' },
    { value: 'evidence', label: 'Evidence Required' },
    { value: 'human', label: 'Human Review' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'logistics', label: 'Logistics & Delivery' },
    { value: 'product', label: 'Product Quality' },
    { value: 'return', label: 'Returns & Assets' },
    { value: 'warehouse', label: 'Warehouse & Picking' },
    { value: 'technical', label: 'Technical & Systems' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Critical / Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today (24h)' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' }
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'priority_desc', label: 'Priority: High → Low' },
    { value: 'amount_desc', label: 'Disputed Amount: High → Low' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. Page Header */}
      <PageHeader
        title="Case Management"
        subtitle="Operational dispute triage repository, autonomous multi-agent audit files, and human specialist escalation queues."
        badge={
          <Badge variant="primary" size="sm">
            {allCasesCount} Ingested Cases
          </Badge>
        }
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={fetchCases}
              title="Refresh case repository"
            >
              <RefreshCw size={14} />
              <span>Refresh</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => navigateToSupport('agent')}
              title="Open complaint intake form"
            >
              <PlusCircle size={14} />
              <span>New Investigation</span>
            </button>
          </div>
        }
      />

      {/* 2. KPI Summary Metric Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px'
        }}
      >
        <div onClick={() => setStatusFilter('all')} style={{ cursor: 'pointer' }} title="Show all cases">
          <MetricCard
            title="Total Cases"
            value={metrics.total}
            subtext="Current filter scope"
            icon={Layers}
            accentColor="var(--accent-cyan)"
          />
        </div>

        <div onClick={() => setStatusFilter('investigating')} style={{ cursor: 'pointer' }} title="Filter by investigating">
          <MetricCard
            title="Open / Active"
            value={metrics.open}
            subtext={`${metrics.inProgress} undergoing agent diagnostics`}
            icon={Activity}
            accentColor="var(--status-cyan)"
            delta={statusFilter === 'investigating' ? 'Filtered' : null}
            deltaType="neutral"
          />
        </div>

        <div onClick={() => setStatusFilter('investigating')} style={{ cursor: 'pointer' }} title="Filter by in-progress">
          <MetricCard
            title="In-Progress"
            value={metrics.inProgress}
            subtext="Parallel DAG active"
            icon={Clock}
            accentColor="var(--accent-sky)"
          />
        </div>

        <div onClick={() => setStatusFilter('resolved')} style={{ cursor: 'pointer' }} title="Filter by resolved">
          <MetricCard
            title="Resolved Cases"
            value={metrics.resolved}
            subtext="Remediation finalized"
            icon={CheckCircle2}
            accentColor="var(--status-emerald)"
            delta={statusFilter === 'resolved' ? 'Filtered' : null}
            deltaType="positive"
          />
        </div>

        <div onClick={() => setStatusFilter('human')} style={{ cursor: 'pointer' }} title="Filter by human review">
          <MetricCard
            title="Escalated / Review"
            value={metrics.escalated}
            subtext="Specialist sign-off required"
            icon={ShieldAlert}
            accentColor="var(--status-rose)"
            delta={metrics.escalated > 0 ? `${metrics.escalated} Pending` : null}
            deltaType={metrics.escalated > 0 ? 'negative' : 'neutral'}
          />
        </div>
      </div>

      {/* 3. Search and Multi-Filter Toolbar Card */}
      <Card variant="default" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Top row: Search input + View mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 300px', minWidth: '240px' }}>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => {
                  setSearchQuery('');
                  api.getCases({
                    query: '',
                    status: statusFilter,
                    category: categoryFilter,
                    priority: priorityFilter,
                    dateRange: dateFilter,
                    sortBy
                  }).then(setCases);
                }}
                placeholder="Search by Case ID (ARG-...), customer, order #, category, or claim..."
              />
            </form>

            {/* View Mode Toggle */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--bg-tertiary)',
                padding: '3px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--glass-border)'
              }}
              role="group"
              aria-label="View Mode Toggle"
            >
              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'table' ? 'var(--bg-elevated)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <TableIcon size={14} />
                <span>Table</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('cards')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'cards' ? 'var(--bg-elevated)' : 'transparent',
                  color: viewMode === 'cards' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <LayoutGrid size={14} />
                <span>Cards</span>
              </button>
            </div>
          </div>

          {/* Bottom row: Filter dropdowns + Sort + Clear Filters */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexWrap: 'wrap',
              paddingTop: '8px',
              borderTop: '1px solid var(--glass-border)'
            }}
          >
            {/* Status Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 26px 0 10px',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
                aria-label="Filter by Status"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 26px 0 10px',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
                aria-label="Filter by Category"
              >
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="input-field"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 26px 0 10px',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
                aria-label="Filter by Priority"
              >
                {priorityOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input-field"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 26px 0 10px',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
                aria-label="Filter by Date Range"
              >
                {dateOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  padding: '0 26px 0 10px',
                  cursor: 'pointer',
                  appearance: 'none',
                  backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 8px center'
                }}
                aria-label="Sort Cases"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Action */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="btn btn-secondary btn-sm"
                style={{
                  height: '34px',
                  fontSize: '12px',
                  color: 'var(--accent-cyan)',
                  borderColor: 'var(--accent-cyan)'
                }}
                title="Reset all search queries and filters"
              >
                <RotateCcw size={12} />
                <span>Clear Filters</span>
              </button>
            )}

            <div style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--text-muted)' }}>
              Showing <strong style={{ color: 'var(--text-primary)' }}>{cases.length}</strong> matching cases
            </div>
          </div>
        </div>
      </Card>

      {/* 4. Main Case Presentation (Table or Card View) */}
      {loading ? (
        <LoadingState message="Retrieving and filtering ARGUS case records..." />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No Matching Cases Located"
          description="We couldn't find any investigation records matching your active filter criteria. Try resetting your search terms or clearing status filters."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      ) : viewMode === 'table' ? (
        /* TABLE VIEW */
        <Card variant="default" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '13px'
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--glass-border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-muted)',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Case ID</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, minWidth: '260px' }}>Issue & Context</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Priority</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600 }}>Assigned Team / Agent</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>Dates</th>
                  <th style={{ padding: '14px 16px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => navigateToCase(c.id)}
                    style={{
                      borderBottom: '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-surface-hover)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Case ID */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          fontSize: '12px',
                          color: 'var(--accent-cyan)',
                          background: 'var(--accent-cyan-muted)',
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--glass-border-cyan)'
                        }}
                      >
                        {c.id}
                      </span>
                    </td>

                    {/* Title & Preview */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px', lineHeight: 1.35 }}>
                        {c.title}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--text-muted)',
                          lineHeight: 1.4,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {c.complaintText}
                      </div>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--glass-border)',
                            color: 'var(--text-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '11px',
                            flexShrink: 0
                          }}
                        >
                          {c.customer?.avatar || 'CU'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '12px' }}>
                            {c.customer?.name}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Rel: <strong style={{ color: 'var(--accent-cyan)' }}>{c.customer?.reliabilityScore || 90}%</strong> • {c.customer?.tier}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category & Order */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {c.category}
                      </div>
                      {c.orderId && (
                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                          Ref: {c.orderId}
                        </div>
                      )}
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      {renderPriorityBadge(c.priority)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Assigned Team / Agent */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {c.assignedTeam || 'Autonomous Swarm'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        Lead: {c.assignedAgent || 'Coordinator'}
                      </div>
                    </td>

                    {/* Dates */}
                    <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {c.createdAt ? c.createdAt.split(' ')[0] : 'Recent'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                        Updated: {c.updatedAt ? c.updatedAt.split(' ')[1] || c.updatedAt : 'Just now'}
                      </div>
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ height: '30px', padding: '4px 10px', fontSize: '11px', gap: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigateToCase(c.id);
                        }}
                      >
                        <span>Investigate</span>
                        <ArrowRight size={12} color="var(--accent-cyan)" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* CARD VIEW */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cases.map((c) => (
            <Card
              key={c.id}
              variant="default"
              onClick={() => navigateToCase(c.id)}
              style={{
                padding: '20px',
                cursor: 'pointer',
                borderLeft: `4px solid ${
                  (c.status || '').toLowerCase().includes('contradict')
                    ? 'var(--status-amber)'
                    : (c.status || '').toLowerCase().includes('human')
                    ? 'var(--status-purple)'
                    : (c.status || '').toLowerCase().includes('resolv')
                    ? 'var(--status-emerald)'
                    : 'var(--accent-cyan)'
                }`
              }}
            >
              {/* Header inside card */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ flex: '1 1 320px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: 'var(--accent-cyan)',
                        background: 'var(--accent-cyan-muted)',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--glass-border-cyan)'
                      }}
                    >
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                    {renderPriorityBadge(c.priority)}
                    <Badge variant="neutral" size="sm">
                      {c.category}
                    </Badge>
                    {c.orderId && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                        Order: {c.orderId}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                    {c.title}
                  </h3>
                </div>

                {/* Customer right pill */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                    {c.customer?.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Reliability: <strong style={{ color: 'var(--accent-cyan)' }}>{c.customer?.reliabilityScore || 90}%</strong> ({c.customer?.reliabilityBand})
                  </div>
                  {c.amount && (
                    <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600, marginTop: '2px' }}>
                      Disputed: {c.amount}
                    </div>
                  )}
                </div>
              </div>

              {/* Verbatim snippet */}
              <p
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  background: 'var(--bg-tertiary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '14px',
                  borderLeft: '2px solid var(--glass-border-light)'
                }}
              >
                "{c.complaintText}"
              </p>

              {/* Footer row: Assigned team, agent badges, timestamps, Open action */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '11px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--glass-border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                    ASSIGNED: <strong style={{ color: 'var(--text-primary)' }}>{c.assignedTeam || 'Investigation Swarm'}</strong>
                  </span>
                  <span style={{ color: 'var(--glass-border-light)' }}>•</span>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Lead: {c.assignedAgent || 'Coordinator'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Created: {c.createdAt ? c.createdAt.split(' ')[0] : 'Recent'}
                  </span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Investigation <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
