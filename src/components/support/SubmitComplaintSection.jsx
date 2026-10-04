import React, { useState } from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { COMPLAINT_CATEGORIES, PREFERRED_RESOLUTIONS } from '../../mock/supportData';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Package,
  Truck,
  RotateCcw,
  Sparkles,
  Cpu,
  HelpCircle,
  UploadCloud,
  FileText,
  FileCheck,
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  ShieldCheck,
  Inbox
} from 'lucide-react';

export default function SubmitComplaintSection({
  initialCategory = null,
  initialDescription = '',
  onViewCase,
  onViewMyCases
}) {
  const { addToast, triggerRefresh } = useApp();

  // Current wizard step: 1 (Category), 2 (Details), 3 (Evidence), 4 (Review), 5 (Confirmed)
  const [step, setStep] = useState(1);

  // Form State
  const [category, setCategory] = useState(initialCategory || 'Billing / Payment');
  const [orderId, setOrderId] = useState('ORD-88291');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(initialDescription || '');
  const [incidentDate, setIncidentDate] = useState(new Date().toISOString().split('T')[0]);
  const [resolutionPreference, setResolutionPreference] = useState(PREFERRED_RESOLUTIONS[0]);
  const [customerName, setCustomerName] = useState('David Kim');
  const [customerEmail, setCustomerEmail] = useState('david.kim@enterprise.org');
  const [priority, setPriority] = useState('High');
  const [disputedAmount, setDisputedAmount] = useState('$389.00');

  // Evidence Attachments State (Local prototype only)
  const [attachments, setAttachments] = useState([]);
  const [fileError, setFileError] = useState('');

  // Validation Errors State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCase, setSubmittedCase] = useState(null);

  // Category Icons Mapping
  const getCategoryIcon = (catId) => {
    switch (catId) {
      case 'billing':
        return CreditCard;
      case 'order_status':
        return Package;
      case 'delivery':
        return Truck;
      case 'return_refund':
        return RotateCcw;
      case 'product_quality':
        return Sparkles;
      case 'technical':
        return Cpu;
      default:
        return HelpCircle;
    }
  };

  const selectedCategoryObj = COMPLAINT_CATEGORIES.find(c => c.label === category) || COMPLAINT_CATEGORIES[0];

  // Validation functions
  const validateStep2 = () => {
    const errs = {};
    if (selectedCategoryObj.requiresOrderId && !orderId.trim()) {
      errs.orderId = 'Order ID or transaction reference is required for this category';
    }
    if (!title.trim() || title.trim().length < 5) {
      errs.title = 'Please provide a clear issue title (minimum 5 characters)';
    }
    if (!description.trim() || description.trim().length < 20) {
      errs.description = `Detailed description is required (minimum 20 characters, currently ${description.trim().length})`;
    } else if (description.trim().length > 1000) {
      errs.description = 'Description exceeds 1000 character maximum limit';
    }
    if (!incidentDate) {
      errs.incidentDate = 'Date of incident is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFromDetails = () => {
    if (validateStep2()) {
      setStep(3);
    }
  };

  // File Handling (Local prototype state)
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setFileError('');

    const maxSizeBytes = 10 * 1024 * 1024; // 10MB
    const validFiles = [];

    for (const f of files) {
      if (f.size > maxSizeBytes) {
        setFileError(`File "${f.name}" exceeds the maximum 10MB limit.`);
        return;
      }
      validFiles.push({
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        lastModified: f.lastModified
      });
    }

    setAttachments(prev => [...prev, ...validFiles]);
  };

  const handleRemoveFile = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Submit Complaint Handler
  const handleSubmitComplaint = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        complaintText: description.trim(),
        orderId: orderId.trim(),
        category,
        priority,
        incidentDate,
        resolutionPreference,
        customerName,
        customerEmail,
        amount: disputedAmount || '$199.00',
        attachments
      };

      const newCase = await api.createCaseFromSupport(payload);
      setSubmittedCase(newCase);
      triggerRefresh();
      setStep(5);

      addToast({
        type: 'success',
        title: `Complaint Submitted: ${newCase.id}`,
        message: 'Case registered in local session. Autonomous investigation initialized.'
      });
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Could not register complaint.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setStep(1);
    setTitle('');
    setDescription('');
    setOrderId('ORD-88291');
    setCategory('Billing / Payment');
    setAttachments([]);
    setErrors({});
    setSubmittedCase(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} className="animate-fade-in">
      {/* Header & Multi-Step Progress Tracker */}
      <Card variant="default" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Formal Complaint Intake
              </h2>
              <Badge variant="cyan" size="sm">
                Autonomous Case Intake
              </Badge>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Submit verified issue details to mobilize Billing, Order, and Technical agents in parallel.
            </p>
          </div>

          <span style={{ fontSize: '11px', color: 'var(--text-faint)', fontFamily: 'var(--font-mono)' }}>
            Step {step} of 5
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '8px',
            position: 'relative'
          }}
        >
          {[
            { num: 1, label: 'Category' },
            { num: 2, label: 'Details' },
            { num: 3, label: 'Evidence' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Confirmed' }
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (s.num < step && step !== 5) setStep(s.num);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'rgba(6, 182, 212, 0.12)' : isCompleted ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-tertiary)',
                  border: isActive ? '1px solid var(--accent-cyan)' : isCompleted ? '1px solid var(--status-emerald)' : '1px solid var(--glass-border)',
                  cursor: s.num < step && step !== 5 ? 'pointer' : 'default',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: isActive ? 'var(--accent-cyan)' : isCompleted ? 'var(--status-emerald)' : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? '#07090e' : '#ffffff',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: isActive || isCompleted ? 600 : 500,
                    color: isActive ? 'var(--accent-cyan)' : isCompleted ? 'var(--status-emerald)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* =========================================================================
          STEP 1: ISSUE CATEGORY SELECTION
          ========================================================================= */}
      {step === 1 && (
        <Card variant="default" style={{ padding: '24px' }} className="animate-fade-in">
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Step 1: Select Dispute Category
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Choose the primary classification for this dispute. This determines the initial multi-agent diagnostic DAG.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {COMPLAINT_CATEGORIES.map((cat) => {
              const IconComp = getCategoryIcon(cat.id);
              const isSelected = category === cat.label;

              return (
                <div
                  key={cat.id}
                  onClick={() => setCategory(cat.label)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-tertiary)',
                    border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--glass-border)',
                    boxShadow: isSelected ? '0 0 14px rgba(6, 182, 212, 0.15)' : 'none',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--glass-border-light)';
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = 'var(--glass-border)';
                      e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                    }
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      background: isSelected ? 'rgba(6, 182, 212, 0.15)' : 'var(--bg-surface)',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconComp size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {cat.label}
                      </span>
                      <input
                        type="radio"
                        checked={isSelected}
                        onChange={() => setCategory(cat.label)}
                        style={{ accentColor: 'var(--accent-cyan)' }}
                      />
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.35 }}>
                      {cat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Continue to Details</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 2: COMPLAINT DETAILS
          ========================================================================= */}
      {step === 2 && (
        <Card variant="default" style={{ padding: '24px' }} className="animate-fade-in">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Step 2: Complaint Details & Narrative
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Category: <strong style={{ color: 'var(--accent-cyan)' }}>{category}</strong>. Provide specific references and statement narrative.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Issue Title */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Issue Summary Title *
              </label>
              <input
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors(prev => ({ ...prev, title: null }));
                }}
                placeholder="e.g. Payment debited twice without order confirmation"
                style={{
                  width: '100%',
                  borderColor: errors.title ? 'var(--status-rose)' : undefined
                }}
              />
              {errors.title && (
                <div style={{ fontSize: '11px', color: 'var(--status-rose)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={11} />
                  <span>{errors.title}</span>
                </div>
              )}
            </div>

            {/* Order ID & Incident Date */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Associated Order / Tracking ID {selectedCategoryObj.requiresOrderId ? '*' : '(Optional)'}
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    if (errors.orderId) setErrors(prev => ({ ...prev, orderId: null }));
                  }}
                  placeholder="e.g. ORD-88291 or TXN-9914"
                  style={{
                    width: '100%',
                    fontFamily: 'var(--font-mono)',
                    borderColor: errors.orderId ? 'var(--status-rose)' : undefined
                  }}
                />
                {errors.orderId && (
                  <div style={{ fontSize: '11px', color: 'var(--status-rose)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={11} />
                    <span>{errors.orderId}</span>
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Date of Incident *
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Disputed Amount (USD)
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={disputedAmount}
                  onChange={(e) => setDisputedAmount(e.target.value)}
                  placeholder="$389.00"
                  style={{ width: '100%', fontFamily: 'var(--font-mono)' }}
                />
              </div>
            </div>

            {/* Detailed Description */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Detailed Description (Customer Statement) *
                </label>
                <span style={{ fontSize: '11px', color: description.length > 1000 ? 'var(--status-rose)' : 'var(--text-faint)' }}>
                  {description.length} / 1000 characters (min 20)
                </span>
              </div>
              <textarea
                className="input-field"
                rows={4}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => ({ ...prev, description: null }));
                }}
                placeholder="Provide a comprehensive timeline of events, bank notifications, courier interactions, or observed defects..."
                style={{
                  width: '100%',
                  height: '110px',
                  lineHeight: 1.5,
                  resize: 'vertical',
                  borderColor: errors.description ? 'var(--status-rose)' : undefined
                }}
              />
              {errors.description && (
                <div style={{ fontSize: '11px', color: 'var(--status-rose)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={11} />
                  <span>{errors.description}</span>
                </div>
              )}
            </div>

            {/* Preferred Resolution */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Preferred Resolution
              </label>
              <select
                className="input-field"
                value={resolutionPreference}
                onChange={(e) => setResolutionPreference(e.target.value)}
                style={{ width: '100%', cursor: 'pointer' }}
              >
                {PREFERRED_RESOLUTIONS.map((res, i) => (
                  <option key={i} value={res}>{res}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(1)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextFromDetails}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Continue to Evidence</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 3: EVIDENCE SELECTION
          ========================================================================= */}
      {step === 3 && (
        <Card variant="default" style={{ padding: '24px' }} className="animate-fade-in">
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Step 3: Attach Supporting Evidence (Optional)
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Supporting documentation accelerates autonomous cross-verification (bank receipts, damaged photos, e-POD signatures).
            </p>
          </div>

          {/* File Picker Dropzone */}
          <div
            style={{
              border: '2px dashed var(--glass-border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px 20px',
              textAlign: 'center',
              background: 'var(--bg-tertiary)',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'all var(--transition-fast)'
            }}
            onClick={() => document.getElementById('evidence-file-input')?.click()}
          >
            <input
              id="evidence-file-input"
              type="file"
              multiple
              accept=".png,.jpg,.jpeg,.pdf,.csv,.txt"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />

            <UploadCloud size={32} color="var(--accent-cyan)" style={{ marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Click to select proof documents or images
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Supported formats: PNG, JPG, PDF, CSV, TXT (Maximum 10MB per file)
            </p>
          </div>

          {/* Prototype disclaimer */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={14} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
            <span>
              <strong>Local Prototype Note:</strong> Selected files are processed in local session memory and are not uploaded to remote servers during this phase.
            </span>
          </div>

          {/* File Error Alert */}
          {fileError && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--status-rose-bg)',
                border: '1px solid var(--status-rose-border)',
                color: 'var(--status-rose)',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <AlertCircle size={14} />
              <span>{fileError}</span>
            </div>
          )}

          {/* Attached Files List */}
          {attachments.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Selected Evidence Files ({attachments.length}):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {attachments.map((file, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FileCheck size={16} color="var(--accent-cyan)" />
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {file.name}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>
                          {(file.size / 1024).toFixed(1)} KB • {file.type || 'Document'}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-xs)',
                          background: 'rgba(16, 185, 129, 0.1)',
                          color: 'var(--status-emerald)',
                          fontWeight: 600
                        }}
                      >
                        Valid Prototype Proof
                      </span>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-faint)',
                          cursor: 'pointer',
                          padding: '2px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title="Remove file"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(2)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Back to Details</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setStep(4)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Continue to Review</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 4: REVIEW & CONFIRM
          ========================================================================= */}
      {step === 4 && (
        <Card variant="default" style={{ padding: '24px' }} className="animate-fade-in">
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Step 4: Review Complaint Details
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Verify all entered statements before dispatching to the multi-agent investigation queue.
            </p>
          </div>

          {/* Review Summary Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
            {/* Category Card */}
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Dispute Category
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(1)}
                  style={{ fontSize: '11px', height: '22px', padding: '0 6px', color: 'var(--accent-cyan)' }}
                >
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {category}
              </div>
            </div>

            {/* Issue Title & Reference */}
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Issue & References
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(2)}
                  style={{ fontSize: '11px', height: '22px', padding: '0 6px', color: 'var(--accent-cyan)' }}
                >
                  Edit
                </button>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                {title}
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>Order ID: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{orderId || 'N/A'}</strong></span>
                <span>Date: <strong>{incidentDate}</strong></span>
                <span>Amount: <strong style={{ fontFamily: 'var(--font-mono)' }}>{disputedAmount}</strong></span>
              </div>
            </div>

            {/* Description Narrative */}
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Customer Narrative
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(2)}
                  style={{ fontSize: '11px', height: '22px', padding: '0 6px', color: 'var(--accent-cyan)' }}
                >
                  Edit
                </button>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                {description}
              </p>
            </div>

            {/* Preferred Resolution */}
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Preferred Resolution
              </span>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--status-emerald)' }}>
                {resolutionPreference}
              </div>
            </div>

            {/* Evidence Attachments Summary */}
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                  Attached Evidence ({attachments.length})
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(3)}
                  style={{ fontSize: '11px', height: '22px', padding: '0 6px', color: 'var(--accent-cyan)' }}
                >
                  Edit
                </button>
              </div>
              {attachments.length === 0 ? (
                <div style={{ fontSize: '11px', color: 'var(--text-faint)' }}>
                  No evidence files attached. Telemetry will be gathered autonomously.
                </div>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {attachments.map((a, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-surface)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--glass-border)'
                      }}
                    >
                      {a.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submission CTA Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmitComplaint}
              disabled={isSubmitting}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', height: '42px' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? 'Registering Case...' : 'Submit & Deploy Agents'}</span>
            </button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          STEP 5: SUBMISSION CONFIRMATION
          ========================================================================= */}
      {step === 5 && submittedCase && (
        <Card variant="elevated" style={{ padding: '36px 24px', textAlign: 'center' }} className="animate-scale-in">
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '2px solid var(--status-emerald)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--status-emerald)',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            <CheckCircle2 size={32} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Complaint Registered Successfully
          </h2>

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            Your dispute has been assigned to the ARGUS autonomous multi-agent pipeline. Billing, Order, and Technical agents are cross-verifying records.
          </p>

          {/* Generated Case ID Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--glass-border-cyan)',
              marginBottom: '24px'
            }}
          >
            <div>
              <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Demonstration Case ID
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {submittedCase.id}
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', background: 'var(--glass-border)' }} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-faint)' }}>Initial Status</div>
              <Badge variant="cyan" size="sm">Investigating (DAG Active)</Badge>
            </div>
          </div>

          {/* Submitted Case Metadata Card */}
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto 28px auto',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--glass-border)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: '12px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Issue Title:</span>
              <strong style={{ color: 'var(--text-primary)' }}>{submittedCase.title}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Category:</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{submittedCase.category}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Resolution Goal:</span>
              <span style={{ color: 'var(--status-emerald)' }}>{submittedCase.resolutionPreference}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Session Storage:</span>
              <span style={{ color: 'var(--text-secondary)' }}>Available in Case Registry during current session</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (onViewCase) onViewCase(submittedCase.id);
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>View Case in Registry</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (onViewMyCases) onViewMyCases();
              }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Inbox size={14} />
              <span>Go to My Cases</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleResetForm}
            >
              Submit Another Complaint
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}
