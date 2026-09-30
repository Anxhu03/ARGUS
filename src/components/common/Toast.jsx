import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = 'var(--accent-cyan)';
        let borderColor = 'var(--glass-border-cyan)';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          iconColor = 'var(--status-emerald)';
          borderColor = 'var(--status-emerald-border)';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          iconColor = 'var(--status-amber)';
          borderColor = 'var(--status-amber-border)';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'var(--status-rose)';
          borderColor = 'var(--status-rose-border)';
        }

        return (
          <div
            key={toast.id}
            className="toast animate-fade-in"
            style={{ borderColor }}
          >
            <div style={{ color: iconColor, flexShrink: 0 }}>
              <Icon size={20} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px' }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
