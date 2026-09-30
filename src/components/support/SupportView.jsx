import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
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
  ExternalLink,
  ChevronRight
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
        title: 'Complaint Description Required',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Support Hero Header */}
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto', width: '100%' }}>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: '9999px',
            background: '#e0f2fe',
            color: '#0284c7',
            border: '1px solid #bae6fd',
            letterSpacing: '0.06em',
            display: 'inline-block',
            marginBottom: '8px'
          }}
        >
          ARGUS SUPPORT INTELLIGENCE HUB
        </span>

        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
          Support Knowledge & Autonomous Investigation
        </h2>

        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>
          Search approved policies in our Knowledge Base for immediate answers, or mobilize specialized
          autonomous agents to investigate complex discrepancies across billing, fulfillment, and carrier systems.
        </p>
      </div>

      {/* 2. Dual Mode Selector: FAQ vs ARGUS AGENT */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
          maxWidth: '840px',
          margin: '0 auto',
          width: '100%'
        }}
      >
        {/* Option A: FAQ Knowledge Base */}
        <div
          onClick={() => setSupportMode('faq')}
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            background: supportMode === 'faq' ? '#f0fdf4' : '#ffffff',
            border: `1px solid ${supportMode === 'faq' ? '#16a34a' : 'var(--border)'}`,
            boxShadow: supportMode === 'faq' ? '0 4px 12px rgba(22, 163, 74, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: supportMode === 'faq' ? '#dcfce7' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: supportMode === 'faq' ? '#15803d' : '#64748b'
              }}
            >
              <BookOpen size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                FAQ & Knowledge Base
              </h3>
              <span style={{ fontSize: '10px', color: supportMode === 'faq' ? '#15803d' : '#64748b', fontWeight: 700 }}>
                INSTANT INFORMATION RETRIEVAL
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
            Direct answers for return policies, delivery times, payment methods, and password recovery.
          </p>
        </div>

        {/* Option B: ARGUS Agent Investigation */}
        <div
          onClick={() => setSupportMode('agent')}
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            background: supportMode === 'agent' ? '#eff6ff' : '#ffffff',
            border: `1px solid ${supportMode === 'agent' ? '#0284c7' : 'var(--border)'}`,
            boxShadow: supportMode === 'agent' ? '0 4px 12px rgba(2, 132, 199, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: supportMode === 'agent' ? '#e0f2fe' : '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: supportMode === 'agent' ? '#0284c7' : '#64748b'
              }}
            >
              <Cpu size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
                ARGUS Agent Investigation
              </h3>
              <span style={{ fontSize: '10px', color: supportMode === 'agent' ? '#0284c7' : '#64748b', fontWeight: 700 }}>
                MULTI-AGENT ROOT CAUSE DIAGNOSIS
              </span>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
            Dispute or discrepancy? Mobilize Billing, Order, and Technical agents to cross-verify verifiable evidence.
          </p>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: FAQ KNOWLEDGE BASE EXPERIENCE
          ========================================================================= */}
      {supportMode === 'faq' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} className="animate-fade-in">
          {/* FAQ Search Bar Card */}
          <div className="ref-card" style={{ padding: '14px 18px', maxWidth: '840px', margin: '0 auto', width: '100%' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search
                  size={15}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8'
                  }}
                />
                <input
                  type="text"
                  className="ref-search-input"
                  placeholder="Search policy (e.g., 'Return window policy', 'Delivery time', 'Payment methods')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', height: '40px', borderRadius: '8px', paddingLeft: '36px' }}
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ padding: '0 18px', height: '40px', borderRadius: '8px' }}>
                Search Policy
              </button>
            </form>
          </div>

          {/* Categories Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '6px' }}>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: selectedCategory === cat.id ? '1px solid #0f172a' : '1px solid var(--border)',
                  background: selectedCategory === cat.id ? '#0f172a' : '#ffffff',
                  color: selectedCategory === cat.id ? '#ffffff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: selectedCategory === cat.id ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
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
                gap: '14px'
              }}
            >
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="ref-card"
                  onClick={() => setActiveFaqDetail(faq)}
                  style={{
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '180px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 6px 16px -2px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#0284c7';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.03)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: '#f1f5f9',
                          color: '#475569'
                        }}
                      >
                        {faq.category}
                      </span>
                      <span style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={11} /> Verified Policy
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '6px', lineHeight: 1.35 }}>
                      {faq.question}
                    </h4>

                    <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45 }}>
                      {faq.shortAnswer}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid #f1f5f9',
                      fontSize: '11px',
                      color: '#64748b',
                      marginTop: '10px'
                    }}
                  >
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                      {faq.source}
                    </span>
                    <span style={{ color: '#0284c7', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                      Read Article <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
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
          <div className="ref-card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0284c7'
                }}
              >
                <Sparkles size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  Submit Complaint & Launch Autonomous Investigation
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Provide the details of your issue. Billing, Order, and Technical agents will cross-verify orders, financial ledgers, and telemetry.
                </p>
              </div>
            </div>

            <form onSubmit={handleLaunchInvestigation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Complaint Verbatim Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Describe what happened (Customer Statement) *
                </label>
                <textarea
                  className="ref-search-input"
                  rows={4}
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  placeholder="e.g. My payment was successful via corporate card, but my order is still showing pending and I haven't received my refund..."
                  style={{ width: '100%', height: '90px', borderRadius: '8px', padding: '10px 12px', fontSize: '13px', lineHeight: 1.5, resize: 'vertical' }}
                />
              </div>

              {/* Order ID & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Associated Order / Reference ID
                  </label>
                  <input
                    type="text"
                    className="ref-search-input"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g. ORD-88291 or TXN-4412"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Complaint Category
                  </label>
                  <select
                    className="ref-search-input"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', borderRadius: '8px', cursor: 'pointer', background: '#ffffff' }}
                  >
                    <option value="Billing & Order Sync">Billing & Order Sync</option>
                    <option value="Logistics & Delivery Dispute">Logistics & Delivery Dispute</option>
                    <option value="Product Quality & Seller Compliance">Product Quality & Seller Compliance</option>
                    <option value="Returns & Asset Verification">Returns & Asset Verification</option>
                  </select>
                </div>
              </div>

              {/* Customer Info & Priority */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    className="ref-search-input"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Customer Email
                  </label>
                  <input
                    type="email"
                    className="ref-search-input"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Priority Level
                  </label>
                  <select
                    className="ref-search-input"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', borderRadius: '8px', cursor: 'pointer', background: '#ffffff' }}
                  >
                    <option value="Urgent">Critical / Urgent</option>
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                  </select>
                </div>
              </div>

              {/* Upload Proof Mock */}
              <div
                style={{
                  border: '1px dashed #cbd5e1',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center',
                  background: '#f8fafc'
                }}
              >
                <FileUp size={20} color="#0284c7" style={{ marginBottom: '4px' }} />
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a' }}>
                  Attach Supporting Evidence (Optional)
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                  Bank statement receipt, courier door photo, or product barcode image
                </div>
              </div>

              {/* Submit CTA */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', flexWrap: 'wrap', gap: '10px' }}>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Deploys Billing, Order, & Technical Agents immediately
                </span>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ minWidth: '220px', height: '40px', borderRadius: '8px' }}
                >
                  <Sparkles size={16} />
                  <span>{isSubmitting ? 'Mobilizing Agents...' : 'Investigate with ARGUS'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
