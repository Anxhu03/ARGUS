import React from 'react';
import { Search } from 'lucide-react';
import GlassCard from './GlassCard';

export default function EmptyState({
  icon: Icon = Search,
  title = 'No Records Found',
  description = 'Try adjusting your search query, filters, or category criteria.',
  actionLabel,
  onAction
}) {
  return (
    <GlassCard
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 24px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--glass-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          marginBottom: '16px'
        }}
      >
        <Icon size={24} />
      </div>
      <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
        {title}
      </h4>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: actionLabel ? '20px' : '0' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button className="btn btn-secondary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </GlassCard>
  );
}
