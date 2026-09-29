import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import GlassCard from '../common/GlassCard';
import FAQDetailModal from './FAQDetailModal';
import LoadingState from '../common/LoadingState';
import EmptyState from '../common/EmptyState';
import {
  Search,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Send,
  Cpu,
  Layers,
  CheckCircle2,
  FileQuestion,
  FileUp,
  CreditCard,
  Package,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

export default function SupportView() {
  const { supportMode, setSupportMode, startInvestigationFromSupport, addToast } = useApp();
  
  // FAQ State
  const [faqs, setFaqs] = useState([]);
  const [faqLoading, setFaqLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFaqDetail, setActiveFaqDetail] = useState(null);

  // ARGUS Agent Launch Form State
  const [complaintText, setComplaintText] = useState(
    'My payment was successful via corporate card, but my order is still showing pending and I haven\'t received my refund.'
  );
  const [orderId, setOrderId] = useState('ORD-88291');
  const [category, setCategory] = useState('Billing & Order Sync');
  const [priority, setPriority] = useState('High');
  const [customerName, setCustomerName] = useState('Jordan Taylor');
  const [customerEmail, setCustomerEmail] = useState('jordan.taylor@enterprise.org');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Knowledge Topics' },
    { id: 'Orders & Shipping', label: 'Orders & Shipping' },
    { id: 'Payments & Refunds', label: 'Payments & Refunds' },
    { id: 'Returns & Exchanges', label: 'Returns & Exchanges' },
    { id: 'Account & Security', label: 'Account & Security' }
  ];

  const fetchFaqs = () => {
    setFaqLoading(true);
    api.getFaqItems(searchQuery, selectedCategory)
      .then(items => {
        setFaqs(items);
        setFaqLoading(false);
      })
      .catch(err => {
        console.error(err);
        setFaqLoading(false);
      });
  };

  useEffect(() => {
    fetchFaqs();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFaqs();
  };

  const handleLaunchInvestigation = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) {
      addToast({
        type: 'warning',
        title: 'Complaint Required',
        message: 'Please provide a description of the issue for the ARGUS agents to investigate.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await startInvestigationFromSupport({
        complaintText,
        orderId,
        category,
        priority,
        customerName,
        customerEmail,
        amount: '$249.00'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Support Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 242, 254, 0.1)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(0, 242, 254, 0.25)',
            letterSpacing: '0.06em',
            display: 'inline-block',
            marginBottom: '10px'
          }}
        >
          ARGUS SUPPORT INTELLIGENCE HUB
        </span>

        <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          How can we help you today?
        </h2>

        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>
          Search approved policies in our Knowledge Base, or initiate an autonomous multi-agent
          investigation for complex delivery, billing, or warehouse discrepancies.
        </p>
      </div>

      {/* Mode Selector: FAQ vs ARGUS AGENT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          maxWidth: '840px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Option A: FAQ Knowledge Base */}
        <div
          onClick={() => setSupportMode('faq')}
          style={{
            padding: '20px 24px',
            borderRadius: 'var(--radius-lg)',
            background: supportMode === 'faq' ? 'rgba(0, 242, 254, 0.08)' : 'rgba(14, 21, 37, 0.6)',
            border: `1px solid ${supportMode === 'faq' ? 'var(--accent-cyan)' : 'var(--glass-border)'}`,
            boxShadow: supportMode === 'faq' ? '0 0 25px rgba(0, 242, 254, 0.2)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          className="glow-on-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 242, 254, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                FAQ & Knowledge Base
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                INFORMATION RETRIEVAL
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Common questions with verified, approved policy answers from the corporate knowledge base.
          </p>
        </div>

        {/* Option B: ARGUS Agent Investigation */}
        <div
          onClick={() => setSupportMode('agent')}
          style={{
            padding: '20px 24px',
            borderRadius: 'var(--radius-lg)',
            background: supportMode === 'agent' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(14, 21, 37, 0.6)',
            border: `1px solid ${supportMode === 'agent' ? 'var(--status-purple)' : 'var(--glass-border)'}`,
            boxShadow: supportMode === 'agent' ? '0 0 25px rgba(139, 92, 246, 0.2)' : 'none',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
          className="glow-on-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--status-purple)'
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ARGUS Agent Investigation
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--status-purple)', fontWeight: 600 }}>
                INVESTIGATION & DIAGNOSIS
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Complex complaint? Mobilize Billing, Order, and Technical agents to audit evidence and identify root cause.
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: FAQ KNOWLEDGE BASE EXPERIENCE
          ========================================================================= */}
      {supportMode === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
          {/* FAQ Search Bar */}
          <GlassCard style={{ padding: '16px 20px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)'
                  }}
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Search your question (e.g., 'How long does delivery take?')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ paddingLeft: '40px', height: '42px', fontSize: '13px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>
                Search Policy
              </button>
            </form>
          </GlassCard>

          {/* Categories Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat.id ? 'var(--accent-cyan)' : 'var(--glass-border)',
                  background: selectedCategory === cat.id ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedCategory === cat.id ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Cards Grid */}
          {faqLoading ? (
            <LoadingState message="Indexing knowledge base articles..." />
          ) : faqs.length === 0 ? (
            <EmptyState
              title="No Matching Knowledge Base Articles"
              description="No approved FAQ documents match your query. If you have an active dispute or issue, launch an ARGUS investigation."
              actionLabel="Launch ARGUS Investigation"
              onAction={() => setSupportMode('agent')}
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '16px'
              }}
            >
              {faqs.map((faq) => (
                <GlassCard
                  key={faq.id}
                  interactive
                  onClick={() => setActiveFaqDetail(faq)}
                  style={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '190px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {faq.category}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Verified Policy
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px', lineHeight: 1.4 }}>
                      {faq.question}
                    </h4>

                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {faq.shortAnswer}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '11px',
                      color: 'var(--text-muted)',
                      marginTop: '12px'
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {faq.source}
                    </span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Read Article <ArrowRight size={12} />
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}

          {/* FAQ Detail Modal */}
          <FAQDetailModal
            faq={activeFaqDetail}
            onClose={() => setActiveFaqDetail(null)}
            onSelectRelated={(q) => {
              setSearchQuery(q);
              setActiveFaqDetail(null);
              fetchFaqs();
            }}
          />
        </div>
      )}

      {/* =========================================================================
          SECTION 2: ARGUS AGENT SUPPORT EXPERIENCE (INVESTIGATION LAUNCHER)
          ========================================================================= */}
      {supportMode === 'agent' && (
        <div style={{ maxWidth: '840px', margin: '0 auto', width: '100%' }} className="animate-fade-in">
          <GlassCard style={{ padding: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  border: '1px solid rgba(0, 242, 254, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-cyan)'
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Start an Autonomous ARGUS Investigation
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Provide the details of your issue. Specialized agents will cross-verify orders, financial ledgers, and telemetry.
                </p>
              </div>
            </div>

            <form onSubmit={handleLaunchInvestigation} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Complaint Verbatim Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Describe what happened (Verbatim Statement) *
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="e.g. My payment was successful but my order is still pending and I haven't received my refund..."
                  style={{ width: '100%', fontSize: '13px', lineHeight: 1.5 }}
                />
              </div>

              {/* Order ID & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Associated Order / Reference ID
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-88291 or TXN-4412"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Complaint Category
                  </label>
                  <select
                    className="input-field"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Billing & Order Sync" style={{ background: '#0b101b' }}>Billing & Order Sync</option>
                    <option value="Logistics & Delivery Dispute" style={{ background: '#0b101b' }}>Logistics & Delivery Dispute</option>
                    <option value="Product Quality & Seller Compliance" style={{ background: '#0b101b' }}>Product Quality & Seller Compliance</option>
                    <option value="Returns & Asset Verification" style={{ background: '#0b101b' }}>Returns & Asset Verification</option>
                  </select>
                </div>
              </div>

              {/* Customer Info & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Customer Email
                  </label>
                  <input
                    type="email"
                    className="input-field"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Priority Level
                  </label>
                  <select
                    className="input-field"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="Urgent" style={{ background: '#0b101b' }}>Urgent</option>
                    <option value="High" style={{ background: '#0b101b' }}>High</option>
                    <option value="Medium" style={{ background: '#0b101b' }}>Medium</option>
                  </select>
                </div>
              </div>

              {/* Upload Proof Mock */}
              <div
                style={{
                  border: '1px dashed var(--glass-border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.01)'
                }}
              >
                <FileUp size={20} color="var(--accent-cyan)" style={{ marginBottom: '6px' }} />
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Attach Supporting Evidence (Optional)
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Bank statement receipt, courier door photo, or product barcode
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Deploys Billing, Order, & Technical Agents immediately
                </span>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={isSubmitting}
                  style={{ minWidth: '220px' }}
                >
                  <Sparkles size={18} />
                  <span>{isSubmitting ? 'Mobilizing Agents...' : 'Investigate with ARGUS'}</span>
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
}
