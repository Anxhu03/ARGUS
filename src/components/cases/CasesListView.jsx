import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
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
  ChevronDown,
  Clock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles
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

  const statusPills = [
    { value: 'all', label: 'All Cases' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'contradiction detected', label: 'Contradictions' },
    { value: 'evidence required', label: 'Evidence Needed' },
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
    { value: 'urgent', label: 'Critical / Urgent' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Header with Title and Create Action */}
      <div className="ref-subheader">
        <div className="ref-title-group">
          <h1>Case Management Repository</h1>
          <p>Comprehensive queue of customer complaints under autonomous agent investigation and human review.</p>
        </div>

        <div className="ref-subheader-actions">
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchCases}
            title="Refresh case database"
            style={{ height: '36px', borderRadius: '6px' }}
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigateToSupport('agent')}
            style={{ height: '36px', borderRadius: '6px' }}
          >
            <PlusCircle size={14} />
            <span>New Investigation</span>
          </button>
        </div>
      </div>

      {/* 2. Status Quick-Pill Bar matching reference */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
        {statusPills.map(sp => (
          <button
            key={sp.value}
            onClick={() => setStatusFilter(sp.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: 600,
              border: statusFilter === sp.value ? '1px solid #0f172a' : '1px solid var(--border)',
              background: statusFilter === sp.value ? '#0f172a' : '#ffffff',
              color: statusFilter === sp.value ? '#ffffff' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
              boxShadow: statusFilter === sp.value ? '0 1px 3px rgba(15,23,42,0.15)' : 'none'
            }}
          >
            {sp.label}
          </button>
        ))}
      </div>

      {/* 3. Filter and Search Bar Card */}
      <div className="ref-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} style={{ flex: '1 1 280px', position: 'relative' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#94a3b8'
              }}
            />
            <input
              type="text"
              className="ref-search-input"
              placeholder="Search by Case ID (ARG-...), customer name, order ID, or complaint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', height: '38px', borderRadius: '8px', paddingLeft: '36px' }}
            />
          </form>

          {/* Category Dropdown */}
          <select
            className="ref-search-input"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: '180px', height: '38px', borderRadius: '8px', cursor: 'pointer', background: '#ffffff' }}
          >
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Priority Dropdown */}
          <select
            className="ref-search-input"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={{ width: '160px', height: '38px', borderRadius: '8px', cursor: 'pointer', background: '#ffffff' }}
          >
            {priorityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchCases}
            style={{ height: '38px', borderRadius: '8px' }}
          >
            Apply Filter
          </button>
        </div>
      </div>

      {/* 4. Cases Repository List */}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cases.map((c) => (
            <div
              key={c.id}
              className="ref-card"
              onClick={() => navigateToCase(c.id)}
              style={{
                padding: '20px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderLeft: `4px solid ${
                  c.status === 'Contradiction Detected'
                    ? '#ea580c'
                    : c.status === 'Human Review'
                    ? '#7e22ce'
                    : c.status === 'Resolved'
                    ? '#16a34a'
                    : '#0284c7'
                }`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 700, color: '#0284c7' }}>
                      {c.id}
                    </span>
                    <StatusBadge status={c.status} size="sm" />
                    <span
                      style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        color: '#475569',
                        fontWeight: 500
                      }}
                    >
                      {c.category}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: c.priority === 'Critical' || c.priority === 'Urgent'
                          ? '#dc2626'
                          : c.priority === 'High'
                            ? '#ea580c'
                            : '#64748b'
                      }}
                    >
                      {c.priority} Priority
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      • Order: {c.orderId}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a' }}>
                    {c.title}
                  </h3>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                    {c.customer.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>
                    Reliability: <span style={{ color: '#0284c7', fontWeight: 600 }}>{c.customer.reliabilityScore}%</span> ({c.customer.reliabilityBand})
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#0f172a', fontWeight: 600, marginTop: '2px' }}>
                    Amount: {c.amount}
                  </div>
                </div>
              </div>

              {/* Verbatim Complaint Excerpt */}
              <p
                style={{
                  fontSize: '12px',
                  color: '#334155',
                  lineHeight: 1.5,
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  marginBottom: '12px',
                  borderLeft: '2px solid #cbd5e1'
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
                  fontSize: '11px',
                  paddingTop: '10px',
                  borderTop: '1px solid #f1f5f9'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>
                    ASSIGNED AGENTS:
                  </span>
                  {c.activeAgents.map(ag => (
                    <span
                      key={ag.id}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: ag.status === 'completed' ? '#dcfce7' : ag.status === 'investigating' ? '#e0f2fe' : '#f1f5f9',
                        color: ag.status === 'completed' ? '#15803d' : ag.status === 'investigating' ? '#0284c7' : '#64748b',
                        fontWeight: 600,
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
                          background: ag.status === 'completed' ? '#16a34a' : ag.status === 'investigating' ? '#0284c7' : '#94a3b8'
                        }}
                      />
                      {ag.name} ({ag.status})
                    </span>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ color: '#94a3b8' }}>
                    Created: {c.createdAt}
                  </span>
                  <span style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Investigation <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
