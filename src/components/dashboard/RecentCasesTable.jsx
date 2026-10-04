import React, { useState, useMemo } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import SearchInput from '../common/SearchInput';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';
import {
  FolderGit2,
  Filter,
  ArrowUpDown,
  Search,
  ExternalLink,
  ChevronDown,
  RotateCcw
} from 'lucide-react';

export default function RecentCasesTable({
  cases = [],
  onSelectCase
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Filter & Search Logic
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesCustomer = c.customer?.name?.toLowerCase().includes(q);
        const matchesCategory = c.category?.toLowerCase().includes(q);
        const matchesOrderId = c.orderId?.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesCustomer && !matchesCategory && !matchesOrderId) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        const catNorm = (c.category || '').toLowerCase();
        if (!catNorm.includes(selectedCategory.toLowerCase())) {
          return false;
        }
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const statNorm = (c.status || '').toLowerCase();
        if (selectedStatus === 'investigating' && !statNorm.includes('investigat')) return false;
        if (selectedStatus === 'contradiction' && !statNorm.includes('contradict')) return false;
        if (selectedStatus === 'human' && (!statNorm.includes('human') && !statNorm.includes('escalat'))) return false;
        if (selectedStatus === 'resolved' && !statNorm.includes('resolv')) return false;
        if (selectedStatus === 'evidence' && !statNorm.includes('evidence')) return false;
      }

      // Priority filter
      if (selectedPriority !== 'all') {
        const prioNorm = (c.priority || '').toLowerCase();
        if (selectedPriority === 'urgent' && (prioNorm !== 'urgent' && prioNorm !== 'critical')) return false;
        if (selectedPriority === 'high' && prioNorm !== 'high') return false;
        if (selectedPriority === 'medium' && prioNorm !== 'medium') return false;
        if (selectedPriority === 'low' && prioNorm !== 'low') return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
      }
      if (sortBy === 'date_asc') {
        return new Date(a.updatedAt || a.createdAt || 0) - new Date(b.updatedAt || b.createdAt || 0);
      }
      if (sortBy === 'amount_desc') {
        const aAmt = parseFloat(String(a.amount || '0').replace(/[^0-9.]/g, '')) || 0;
        const bAmt = parseFloat(String(b.amount || '0').replace(/[^0-9.]/g, '')) || 0;
        return bAmt - aAmt;
      }
      if (sortBy === 'priority_desc') {
        const score = { Critical: 4, Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (score[b.priority] || 0) - (score[a.priority] || 0);
      }
      return 0;
    });
  }, [cases, searchQuery, selectedCategory, selectedStatus, selectedPriority, sortBy]);

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortBy('date_desc');
  };

  const getPriorityStyle = (priority) => {
    switch ((priority || '').toLowerCase()) {
      case 'critical':
      case 'urgent':
        return { color: 'var(--status-rose)', bg: 'var(--status-rose-bg)', border: 'var(--status-rose-border)' };
      case 'high':
        return { color: 'var(--status-amber)', bg: 'var(--status-amber-bg)', border: 'var(--status-amber-border)' };
      case 'medium':
        return { color: 'var(--accent-sky)', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.25)' };
      default:
        return { color: 'var(--text-muted)', bg: 'rgba(255, 255, 255, 0.05)', border: 'var(--glass-border)' };
    }
  };

  return (
    <Card variant="default" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div className="ref-card-header" style={{ marginBottom: '16px' }}>
        <div>
          <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FolderGit2 size={16} color="var(--accent-cyan)" />
            <span>Recent Operational Cases</span>
          </div>
          <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
            Multi-agent customer dispute cases, evidence audits & diagnostic verdicts
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Badge variant="neutral" size="sm">
            {filteredCases.length} of {cases.length} Cases
          </Badge>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="btn btn-ghost btn-sm"
              style={{ fontSize: '11px', height: '26px', display: 'flex', alignItems: 'center', gap: '4px' }}
              title="Reset all search filters"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '16px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--glass-border)'
        }}
      >
        {/* Search Input */}
        <div style={{ flex: '1 1 240px', minWidth: '220px' }}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search by case ID, customer, order #, or issue..."
          />
        </div>

        {/* Category Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-field"
            style={{
              height: '36px',
              fontSize: '12px',
              padding: '0 28px 0 10px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center'
            }}
            aria-label="Filter by Category"
          >
            <option value="all">All Categories</option>
            <option value="billing">Billing & Payment Sync</option>
            <option value="logistics">Order & Logistics</option>
            <option value="delivery">Delivery Disputes</option>
            <option value="product">Product Quality</option>
            <option value="return">Returns & Verification</option>
            <option value="account">Account & Other</option>
          </select>
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
            style={{
              height: '36px',
              fontSize: '12px',
              padding: '0 28px 0 10px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center'
            }}
            aria-label="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="investigating">Investigating</option>
            <option value="contradiction">Contradiction Detected</option>
            <option value="human">Human Review</option>
            <option value="resolved">Resolved</option>
            <option value="evidence">Evidence Required</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="input-field"
            style={{
              height: '36px',
              fontSize: '12px',
              padding: '0 28px 0 10px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center'
            }}
            aria-label="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent / Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
            style={{
              height: '36px',
              fontSize: '12px',
              padding: '0 28px 0 10px',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center'
            }}
            aria-label="Sort Cases"
          >
            <option value="date_desc">Newest Updated</option>
            <option value="date_asc">Oldest Updated</option>
            <option value="priority_desc">Highest Priority</option>
            <option value="amount_desc">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Table / Empty State Content */}
      {filteredCases.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Cases Found"
          description="None of the cases matched your search query or active filter combination."
          actionLabel="Clear All Filters"
          onAction={resetFilters}
        />
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Case ID</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Customer</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Issue Title</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                <th style={{ padding: '10px 12px', fontWeight: 600 }}>Amount</th>
                <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.map((c) => {
                const prioStyle = getPriorityStyle(c.priority);
                const updatedDisplay = c.updatedAt
                  ? c.updatedAt.includes(' ') ? c.updatedAt.split(' ')[1] : c.updatedAt
                  : 'Recent';

                return (
                  <tr
                    key={c.id}
                    onClick={() => onSelectCase && onSelectCase(c.id)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {/* Case ID */}
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.id}
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.customer?.name || 'Customer'}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                        {c.customer?.tier || 'Standard'}
                      </div>
                    </td>

                    {/* Issue Title */}
                    <td style={{ padding: '12px', maxWidth: '280px' }}>
                      <div
                        style={{
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          color: 'var(--text-secondary)',
                          fontWeight: 500
                        }}
                        title={c.title}
                      >
                        {c.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>
                        Ref: {c.orderId || 'Direct Dispute'}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          background: 'var(--bg-tertiary)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--glass-border)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {c.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 7px',
                          borderRadius: 'var(--radius-xs)',
                          background: prioStyle.bg,
                          color: prioStyle.color,
                          border: `1px solid ${prioStyle.border}`
                        }}
                      >
                        {c.priority}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Disputed Amount */}
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.amount}
                    </td>

                    {/* Action button */}
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '3px 9px',
                          height: '26px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCase && onSelectCase(c.id);
                        }}
                        title={`Inspect Case ${c.id}`}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
