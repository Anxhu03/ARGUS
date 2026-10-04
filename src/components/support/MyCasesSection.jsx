import React, { useState, useEffect, useMemo } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import SearchInput from '../common/SearchInput';
import EmptyState from '../common/EmptyState';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  Search,
  ExternalLink,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderGit2
} from 'lucide-react';

export default function MyCasesSection({
  onNavigateToCase,
  onSubmitNewComplaint
}) {
  const { addToast } = useApp();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getCases()
      .then((data) => {
        if (isMounted) {
          setCases(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = c.id.toLowerCase().includes(q);
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesCategory = (c.category || '').toLowerCase().includes(q);
        const matchesOrder = (c.orderId || '').toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesCategory && !matchesOrder) return false;
      }

      if (statusFilter !== 'all') {
        const statNorm = (c.status || '').toLowerCase();
        if (statusFilter === 'investigating' && !statNorm.includes('investigat')) return false;
        if (statusFilter === 'contradiction' && !statNorm.includes('contradict')) return false;
        if (statusFilter === 'human' && !statNorm.includes('human') && !statNorm.includes('escalat')) return false;
        if (statusFilter === 'resolved' && !statNorm.includes('resolv')) return false;
        if (statusFilter === 'evidence' && !statNorm.includes('evidence')) return false;
      }

      return true;
    });
  }, [cases, searchQuery, statusFilter]);

  const activeCount = cases.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = cases.filter(c => c.status === 'Resolved').length;
  const reviewCount = cases.filter(c => c.status === 'Human Review' || c.status === 'Contradiction Detected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Top Overview Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Total Case Records
            </span>
            <FolderGit2 size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
            {cases.length}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Including current session complaints
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Active Investigations
            </span>
            <Clock size={16} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-display)' }}>
            {activeCount}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Autonomous DAGs verifying evidence
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Resolved Cases
            </span>
            <CheckCircle2 size={16} color="var(--status-emerald)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-emerald)', fontFamily: 'var(--font-display)' }}>
            {resolvedCount}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Fully reconciled & authorized
          </div>
        </div>

        <div style={{ padding: '16px', borderRadius: 'var(--radius-lg)', background: 'var(--bg-surface)', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
              Human Reviews
            </span>
            <AlertTriangle size={16} color="var(--status-amber)" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--status-amber)', fontFamily: 'var(--font-display)' }}>
            {reviewCount}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '4px' }}>
            Neutral specialist evaluation
          </div>
        </div>
      </div>

      {/* Main Cases Table Card */}
      <Card variant="default" style={{ padding: '20px' }}>
        <div className="ref-card-header" style={{ marginBottom: '16px' }}>
          <div>
            <div className="ref-card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Inbox size={16} color="var(--accent-cyan)" />
              <span>My Cases & Dispute History</span>
            </div>
            <div className="ref-card-subtitle" style={{ marginTop: '2px' }}>
              Track complaints filed during this session alongside historical records
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onSubmitNewComplaint}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlusCircle size={13} />
            <span>Submit New Complaint</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '16px',
            paddingBottom: '14px',
            borderBottom: '1px solid var(--glass-border)'
          }}
        >
          <div style={{ flex: '1 1 260px' }}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
              placeholder="Search by case ID, title, or order reference..."
            />
          </div>

          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-tertiary)', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Cases' },
              { id: 'investigating', label: 'Investigating' },
              { id: 'evidence', label: 'Evidence Needed' },
              { id: 'contradiction', label: 'Contradictions' },
              { id: 'human', label: 'Human Review' },
              { id: 'resolved', label: 'Resolved' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: statusFilter === tab.id ? 'var(--accent-cyan)' : 'transparent',
                  color: statusFilter === tab.id ? '#07090e' : 'var(--text-muted)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Retrieving case records...
          </div>
        ) : filteredCases.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="No Cases Found"
            description={
              searchQuery || statusFilter !== 'all'
                ? 'No case records matched your current query or filter criteria.'
                : 'You have not submitted any complaints during this session yet.'
            }
            actionLabel={searchQuery || statusFilter !== 'all' ? 'Reset Filters' : 'Submit First Complaint'}
            onAction={
              searchQuery || statusFilter !== 'all'
                ? () => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }
                : onSubmitNewComplaint
            }
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Case ID</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Issue Title</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Category</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Disputed Sum</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600 }}>Updated</th>
                  <th style={{ padding: '10px 12px', fontWeight: 600, textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCases.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onNavigateToCase && onNavigateToCase(c.id)}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      cursor: 'pointer',
                      transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {c.id}
                    </td>

                    <td style={{ padding: '12px', maxWidth: '280px' }}>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                        title={c.title}
                      >
                        {c.title}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-faint)', marginTop: '2px' }}>
                        Ref: {c.orderId || 'Direct Inquiry'}
                      </div>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--bg-tertiary)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--glass-border)'
                        }}
                      >
                        {c.category}
                      </span>
                    </td>

                    <td style={{ padding: '12px' }}>
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    <td style={{ padding: '12px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {c.amount}
                    </td>

                    <td style={{ padding: '12px', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {c.updatedAt ? c.updatedAt.split(' ')[0] : 'Today'}
                    </td>

                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '3px 8px', height: '26px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onNavigateToCase) onNavigateToCase(c.id);
                        }}
                      >
                        <span>Inspect</span>
                        <ExternalLink size={10} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
