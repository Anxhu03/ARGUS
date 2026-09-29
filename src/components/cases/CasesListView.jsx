import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import {
  Search,
  Filter,
  ArrowRight,
  PlusCircle,
  RefreshCw,
  FolderGit2,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function CasesListView() {
  const { navigateToCase, navigateToSupport, addToast } = useApp();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const fetchCases = () => {
    setLoading(true);
    api.getCases({
      query: searchQuery,
      status: statusFilter,
      category: categoryFilter,
      priority: priorityFilter
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

  useEffect(() => {
    fetchCases();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCases();
  };

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'contradiction detected', label: 'Contradiction Detected' },
    { value: 'evidence required', label: 'Evidence Required' },
    { value: 'human review', label: 'Human Review' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'billing', label: 'Billing & Payments' },
    { value: 'logistics', label: 'Logistics & Delivery' },
    { value: 'product', label: 'Product Quality' },
    { value: 'returns', label: 'Returns & Assets' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header with Title and Create Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Case Management Repository
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Comprehensive directory of customer complaints under autonomous agent investigation and human review
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchCases}
            title="Refresh case database"
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigateToSupport('agent')}
          >
            <PlusCircle size={14} />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <GlassCard style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 260px', position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="input-field"
              placeholder="Search by Case ID, customer, order, or complaint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '38px', fontSize: '13px' }}
            />
          </form>

          {/* Status Dropdown */}
          <select
            className="input-field"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '170px', height: '38px', fontSize: '12px', cursor: 'pointer' }}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ background: '#0b101b' }}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            className="input-field"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '170px', height: '38px', fontSize: '12px', cursor: 'pointer' }}
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ background: '#0b101b' }}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            className="input-field"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: '140px', height: '38px', fontSize: '12px', cursor: 'pointer' }}
          >
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value} style={{ background: '#0b101b' }}>
                {opt.label}
              </option>
            ))}
          </select>

          <button className="btn btn-secondary btn-sm" onClick={fetchCases} style={{ height: '38px' }}>
            Apply Filter
          </button>
        </div>
      </GlassCard>

      {/* Cases List */}
      {loading ? (
        <LoadingState message="Filtering case database..." />
      ) : cases.length === 0 ? (
        <EmptyState
          title="No Matching Cases Found"
          description="We couldn't find any cases matching your current filter criteria. Try resetting your search or status filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setCategoryFilter('all');
            setPriorityFilter('all');
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cases.map((c) => (
            <GlassCard
              key={c.id}
              interactive
              onClick={() => navigateToCase(c.id)}
              style={{
                padding: '22px 24px',
                borderLeft: `4px solid ${
                  c.status === 'Contradiction Detected'
                    ? 'var(--status-rose)'
                    : c.status === 'Human Review'
                    ? 'var(--status-amber)'
                    : c.status === 'Resolved'
                    ? 'var(--status-emerald)'
                    : 'var(--accent-cyan)'
                }`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} />
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {c.category}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: c.priority === 'Urgent' ? 'var(--status-rose)' : c.priority === 'High' ? 'var(--status-amber)' : 'var(--text-secondary)'
                      }}
                    >
                      {c.priority} Priority
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      • Order: {c.orderId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {c.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '13px' }}>
                    {c.customer.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Reliability: <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{c.customer.reliabilityScore}%</span> ({c.customer.reliabilityBand})
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: '2px' }}>
                    Amount: {c.amount}
                  </div>
                </div>
              </div>

              {/* Verbatim Complaint */}
              <p
                style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '14px',
                  borderLeft: '2px solid rgba(0, 242, 254, 0.2)'
                }}
              >
                "{c.complaintText}"
              </p>

              {/* Agent Status Indicators & Meta */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '12px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                    ASSIGNED AGENTS:
                  </span>
                  {c.activeAgents.map(ag => (
                    <span
                      key={ag.id}
                      style={{
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--glass-border)',
                        color: ag.status === 'completed' ? 'var(--status-emerald)' : 'var(--accent-cyan)',
                        fontSize: '11px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: ag.status === 'completed' ? 'var(--status-emerald)' : 'var(--accent-cyan)'
                        }}
                      />
                      {ag.name} ({ag.status})
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Created: {c.createdAt}
                  </span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Investigation <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
