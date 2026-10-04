import React from 'react';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { BookOpen, Calendar, ArrowRight, ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';

export default function FAQDetailModal({
  faq,
  onClose,
  onSelectRelated,
  onVote
}) {
  if (!faq) return null;

  return (
    <Modal
      isOpen={Boolean(faq)}
      onClose={onClose}
      title={faq.question}
      subtitle={`Category: ${faq.category} • Knowledge Base Policy`}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Knowledge Source Header */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <BookOpen size={16} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-muted)' }}>Approved Policy Source:</span>
            <strong style={{ color: 'var(--text-primary)' }}>{faq.source}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-faint)' }}>
            <Calendar size={13} />
            <span>Updated: {faq.lastUpdated}</span>
          </div>
        </div>

        {/* Full Comprehensive Answer */}
        <div>
          <h4
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
              marginBottom: '8px'
            }}
          >
            Detailed Knowledge-Base Policy
          </h4>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              background: 'var(--bg-tertiary)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {faq.fullAnswer}
          </div>
        </div>

        {/* Helpful Count & Feedback */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--glass-border)',
            fontSize: '12px',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            <ThumbsUp size={14} color="var(--status-emerald)" />
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>{faq.helpfulCount || 428}</strong> customers found this helpful
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Was this helpful?</span>
            <button
              type="button"
              onClick={() => onVote && onVote(faq.id, true)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px', height: '26px' }}
              title="Yes, this was helpful"
            >
              <ThumbsUp size={12} />
              <span>Yes</span>
            </button>
            <button
              type="button"
              onClick={() => onVote && onVote(faq.id, false)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '3px 8px', height: '26px' }}
              title="No, this was not helpful"
            >
              <ThumbsDown size={12} />
              <span>No</span>
            </button>
          </div>
        </div>

        {/* Related Inquiries */}
        {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                letterSpacing: '0.05em',
                marginBottom: '8px'
              }}
            >
              Related Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {faq.relatedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectRelated && onSelectRelated(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '9px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={13} color="var(--accent-cyan)" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--glass-border)' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Knowledge Article
          </button>
        </div>
      </div>
    </Modal>
  );
}
