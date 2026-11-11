import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X, Loader2 } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map(toast => {
        let Icon = Info;
        let iconColor = 'var(--accent-cyan)';
        let borderColor = 'var(--glass-border-cyan)';

        if (toast.type === 'loading') {
          Icon = Loader2;
          iconColor = 'var(--accent-cyan)';
          borderColor = 'var(--glass-border-cyan)';
        } else if (toast.type === 'success') {
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
            className="toast"
            style={{
              borderColor,
              borderLeft: `3px solid ${iconColor}`
            }}
          >
            <div style={{ color: iconColor, flexShrink: 0, marginTop: '1px' }}>
              <Icon size={18} className={toast.type === 'loading' ? 'animate-spin' : ''} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {toast.title && (
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.3 }}>
                  {toast.title}
                </div>
              )}
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.45, wordBreak: 'break-word' }}>
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="toast-close-btn"
              aria-label="Dismiss notification"
              title="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
