import React from 'react';
import Modal from '../common/Modal';
import { BookOpen, Calendar, HelpCircle, ArrowRight, ThumbsUp } from 'lucide-react';

export default function FAQDetailModal({ faq, onClose, onSelectRelated }) {
  if (!faq) return null;

  return (
    <Modal
      isOpen={Boolean(faq)}
      onClose={onClose}
      title={faq.question}
      subtitle={`Category: ${faq.category} • Knowledge Base Entry`}
      maxWidth="640px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Knowledge Source Header */}
        <div
          style={{
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
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
            <strong style={{ color: 'var(--accent-cyan)' }}>{faq.source}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
            <Calendar size={13} />
            <span>Updated: {faq.lastUpdated}</span>
          </div>
        </div>

        {/* Full Comprehensive Answer */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Detailed Knowledge-Base Response
          </h4>
          <div
            style={{
              fontSize: '14px',
              color: 'var(--text-primary)',
              lineHeight: 1.7,
              background: 'rgba(10, 16, 28, 0.6)',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--glass-border)'
            }}
          >
            {faq.fullAnswer}
          </div>
        </div>

        {/* Helpful Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
            <ThumbsUp size={14} color="var(--status-emerald)" />
            <span>{faq.helpfulCount || 412} customers found this policy guidance helpful</span>
          </div>
          <span style={{ color: 'var(--status-emerald)', fontWeight: 600 }}>Verified Policy</span>
        </div>

        {/* Related Questions */}
        {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
              Related Inquiries
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {faq.relatedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectRelated && onSelectRelated(q)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-secondary)',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 242, 254, 0.05)';
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
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
