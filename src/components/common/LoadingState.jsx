import React from 'react';

export default function LoadingState({ message = 'Querying ARGUS Intelligence Layer...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 20px',
        textAlign: 'center'
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          border: '2px solid rgba(0, 242, 254, 0.15)',
          borderTopColor: 'var(--accent-cyan)',
          animation: 'pulse-ring 1.2s infinite linear',
          marginBottom: '16px'
        }}
      />
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {message}
      </p>
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
        Synthesizing agent telemetry and cryptographic proofs
      </span>
    </div>
  );
}
