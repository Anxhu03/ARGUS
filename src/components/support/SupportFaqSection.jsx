import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import SearchInput from '../common/SearchInput';
import EmptyState from '../common/EmptyState';
import FAQDetailModal from './FAQDetailModal';
import { api } from '../../services/api';
import { FAQ_CATEGORIES } from '../../mock/supportData';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  FilePlus,
  HelpCircle
} from 'lucide-react';

export default function SupportFaqSection({
  onNavigateToAsk,
  onNavigateToComplaint
}) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFaqId, setExpandedFaqId] = useState('faq-1');
  const [modalFaq, setModalFaq] = useState(null);
  const [userVotes, setUserVotes] = useState({}); // { [faqId]: 'helpful' | 'not_helpful' }

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api.getFaqItems(searchQuery, selectedCategory)
      .then((items) => {
        if (isMounted) {
          setFaqs(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id) => {
    setExpandedFaqId(prev => prev === id ? null : id);
  };

  const handleVote = async (faqId, isHelpful) => {
    if (userVotes[faqId]) return; // already voted in this session
    setUserVotes(prev => ({ ...prev, [faqId]: isHelpful ? 'helpful' : 'not_helpful' }));
    try {
      const updated = await api.voteFaqHelpful(faqId, isHelpful);
      if (updated) {
        setFaqs(prev => prev.map(f => f.id === faqId ? updated : f));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Header and Search Box */}
      <Card variant="default" style={{ padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 20px auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Badge variant="cyan" size="sm">
              <BookOpen size={12} style={{ marginRight: '4px' }} />
              Demonstration Knowledge Base
            </Badge>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Frequently Asked Questions
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            Direct answers on shipping SLAs, payment holds, return procedures, and account security.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            placeholder="Search approved policies (e.g., 'return window', 'duplicate charge', 'delivery tracking')..."
            autoFocus={false}
          />
        </div>

        {/* Category Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: '16px'
          }}
        >
          {FAQ_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                  background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-tertiary)',
                  color: isSelected ? '#07090e' : 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* FAQ Questions List */}
      {loading ? (
        <Card variant="default" style={{ padding: '40px', textAlign: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Searching policy database...</span>
        </Card>
      ) : faqs.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Matching Policy Articles"
          description={`No approved FAQ entries matched "${searchQuery}". Try a broader term or explore conversational guidance with Ask ARGUS.`}
          actionLabel="Clear Search"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            const voteStatus = userVotes[faq.id];

            return (
              <div
                key={faq.id}
                style={{
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-surface)',
                  border: isExpanded ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                  boxShadow: isExpanded ? 'var(--glass-shadow), 0 0 16px rgba(6, 182, 212, 0.08)' : 'var(--glass-shadow)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)'
                }}
              >
                {/* Accordion Question Header */}
                <div
                  onClick={() => toggleExpand(faq.id)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: isExpanded ? 'var(--bg-tertiary)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isExpanded) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, paddingRight: '12px' }}>
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(6, 182, 212, 0.12)',
                        color: 'var(--accent-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <HelpCircle size={15} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 'var(--radius-xs)',
                            background: 'var(--bg-elevated)',
                            color: 'var(--accent-cyan)',
                            border: '1px solid var(--glass-border)'
                          }}
                        >
                          {faq.category}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--status-emerald)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckCircle2 size={10} /> Verified Standard
                        </span>
                      </div>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4 }}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
                    {isExpanded ? <ChevronUp size={18} color="var(--accent-cyan)" /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '0 20px 20px 20px',
                      background: 'var(--bg-tertiary)',
                      borderTop: '1px solid var(--glass-border)',
                      paddingTop: '16px'
                    }}
                    className="animate-fade-in"
                  >
                    {/* Full Answer */}
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '14px' }}>
                      {faq.fullAnswer}
                    </div>

                    {/* Metadata & Source Tag */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--glass-border)',
                        marginBottom: '14px',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Policy Document: <strong style={{ color: 'var(--text-primary)' }}>{faq.source}</strong> (Rev {faq.lastUpdated})
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalFaq(faq);
                        }}
                        className="btn btn-ghost btn-sm"
                        style={{ fontSize: '11px', height: '24px', padding: '0 6px', color: 'var(--accent-cyan)' }}
                      >
                        <span>View Full Article</span>
                        <ExternalLink size={11} />
                      </button>
                    </div>

                    {/* Helpful Vote Section */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingTop: '12px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <ThumbsUp size={12} color="var(--status-emerald)" />
                        <span>
                          <strong style={{ color: 'var(--text-primary)' }}>{faq.helpfulCount}</strong> users found this policy guidance helpful
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {voteStatus ? (
                          <span style={{ fontSize: '11px', color: 'var(--status-emerald)', fontWeight: 600 }}>
                            ✓ Thank you for your feedback!
                          </span>
                        ) : (
                          <>
                            <span style={{ fontSize: '11px', color: 'var(--text-faint)' }}>Was this helpful?</span>
                            <button
                              type="button"
                              onClick={() => handleVote(faq.id, true)}
                              className="btn btn-secondary btn-sm"
                              style={{ height: '24px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ThumbsUp size={11} />
                              <span>Yes</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleVote(faq.id, false)}
                              className="btn btn-secondary btn-sm"
                              style={{ height: '24px', padding: '0 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <ThumbsDown size={11} />
                              <span>No</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Related Questions Inline Links */}
                    {faq.relatedQuestions && faq.relatedQuestions.length > 0 && (
                      <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
                          Related inquiries:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {faq.relatedQuestions.map((rq, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSearchQuery(rq)}
                              style={{
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                borderRadius: 'var(--radius-xs)',
                                padding: '3px 8px',
                                fontSize: '11px',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all var(--transition-fast)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                              }}
                            >
                              {rq}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Unresolved Inquiry Helper Banner */}
      <Card variant="elevated" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              <span>Did not find what you were looking for?</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Ask ARGUS for simulated conversational assistance, or file a formal complaint to mobilize investigation agents.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onNavigateToAsk}
            >
              <Sparkles size={13} />
              <span>Ask ARGUS AI</span>
            </button>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onNavigateToComplaint}
            >
              <FilePlus size={13} />
              <span>Submit Complaint</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Full Modal View */}
      <FAQDetailModal
        faq={modalFaq}
        onClose={() => setModalFaq(null)}
        onSelectRelated={(q) => {
          setSearchQuery(q);
          setModalFaq(null);
        }}
        onVote={handleVote}
      />
    </div>
  );
}
