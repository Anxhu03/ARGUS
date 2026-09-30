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
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <BookOpen size={16} color="#16a34a" />
            <span style={{ color: '#475569' }}>Approved Policy Source:</span>
            <strong style={{ color: '#15803d' }}>{faq.source}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
            <Calendar size={13} />
            <span>Updated: {faq.lastUpdated}</span>
          </div>
        </div>

        {/* Full Comprehensive Answer */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
            Detailed Knowledge-Base Response
          </h4>
          <div
            style={{
              fontSize: '14px',
              color: '#1e293b',
              lineHeight: 1.7,
              background: '#f8fafc',
              padding: '16px 18px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0'
            }}
          >
            {faq.fullAnswer}
          </div>
        </div>

        {/* Helpful Count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #f1f5f9', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
            <ThumbsUp size={14} color="#10b981" />
            <span>{faq.helpfulCount || 412} customers found this policy guidance helpful</span>
          </div>
          <span style={{ color: '#16a34a', fontWeight: 600 }}>Verified Policy</span>
        </div>

        {/* Related Questions */}
        {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>
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
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#334155',
                    fontSize: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.color = '#0f172a';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.color = '#334155';
                  }}
                >
                  <span>{q}</span>
                  <ArrowRight size={13} color="#0f172a" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close Knowledge Article
          </button>
        </div>
      </div>
    </Modal>
  );
}
