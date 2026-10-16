/**
 * ARGUS API Client & Service Abstraction Layer
 * Provides clean async interface for all platform capabilities.
 * Easily swappable for live REST/GraphQL backend when ready.
 */

import {
  INITIAL_CASES,
  FAQ_DATA,
  PATTERNS_DATA,
  PREVENTION_RECOMMENDATIONS,
  SYSTEM_KPI_STATS
} from '../mock/mockData.js';

import {
  DASHBOARD_KPIS,
  VOLUME_ANALYTICS,
  CASE_DISTRIBUTION,
  CASES_REQUIRING_ATTENTION,
  RECENT_INVESTIGATION_ACTIVITY
} from '../mock/dashboardData.js';

import { SUPPORT_FAQS } from '../mock/supportData.js';

// In-memory cache for stateful mutations during session
let casesStore = [...INITIAL_CASES];
let faqStore = [...SUPPORT_FAQS];
let patternsStore = [...PATTERNS_DATA];
let preventionStore = [...PREVENTION_RECOMMENDATIONS];

// Simulated network latency helper
const simulateDelay = (ms = 180) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // --- Case Management & Investigation ---
  async getCases(filters = {}) {
    await simulateDelay(150);
    let result = [...casesStore];

    // Status filtering with synonym normalization
    if (filters.status && filters.status !== 'all') {
      const s = filters.status.toLowerCase().trim();
      result = result.filter(c => {
        const cs = (c.status || '').toLowerCase();
        if (s === 'investigating') return cs.includes('investigat');
        if (s === 'contradiction' || s === 'contradiction detected') return cs.includes('contradict');
        if (s === 'human' || s === 'human review' || s === 'escalated') return cs.includes('human') || cs.includes('escalat');
        if (s === 'resolved') return cs.includes('resolv');
        if (s === 'evidence' || s === 'evidence required' || s === 'evidence needed') return cs.includes('evidence');
        return cs === s;
      });
    }

    // Category filtering
    if (filters.category && filters.category !== 'all') {
      const cat = filters.category.toLowerCase().trim();
      result = result.filter(c => (c.category || '').toLowerCase().includes(cat));
    }

    // Priority filtering
    if (filters.priority && filters.priority !== 'all') {
      const p = filters.priority.toLowerCase().trim();
      result = result.filter(c => {
        const cp = (c.priority || '').toLowerCase();
        if (p === 'urgent' || p === 'critical') return cp === 'urgent' || cp === 'critical';
        return cp === p;
      });
    }

    // Date range filtering
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = Date.now();
      result = result.filter(c => {
        const dateStr = c.updatedAt || c.createdAt;
        if (!dateStr) return true;
        const cDate = new Date(dateStr.replace(' ', 'T')).getTime();
        if (isNaN(cDate)) return true;
        const diffDays = (now - cDate) / (1000 * 60 * 60 * 24);
        if (filters.dateRange === 'today') return diffDays <= 1.5;
        if (filters.dateRange === '7d') return diffDays <= 7.5;
        if (filters.dateRange === '30d') return diffDays <= 30.5;
        return true;
      });
    }

    // Keyword search
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        (c.title || '').toLowerCase().includes(q) ||
        (c.customer?.name || '').toLowerCase().includes(q) ||
        (c.customer?.email || '').toLowerCase().includes(q) ||
        (c.orderId || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.complaintText || '').toLowerCase().includes(q) ||
        (c.assignedTeam || '').toLowerCase().includes(q) ||
        (c.assignedAgent || '').toLowerCase().includes(q)
      );
    }

    // Sorting
    const sortBy = filters.sortBy || 'date_desc';
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        const tA = new Date((a.updatedAt || a.createdAt || '').replace(' ', 'T')).getTime() || 0;
        const tB = new Date((b.updatedAt || b.createdAt || '').replace(' ', 'T')).getTime() || 0;
        return tB - tA;
      }
      if (sortBy === 'date_asc') {
        const tA = new Date((a.updatedAt || a.createdAt || '').replace(' ', 'T')).getTime() || 0;
        const tB = new Date((b.updatedAt || b.createdAt || '').replace(' ', 'T')).getTime() || 0;
        return tA - tB;
      }
      if (sortBy === 'priority_desc') {
        const score = { Critical: 4, Urgent: 4, High: 3, Medium: 2, Low: 1 };
        return (score[b.priority] || 0) - (score[a.priority] || 0);
      }
      if (sortBy === 'amount_desc') {
        const aAmt = parseFloat(String(a.amount || '0').replace(/[^0-9.]/g, '')) || 0;
        const bAmt = parseFloat(String(b.amount || '0').replace(/[^0-9.]/g, '')) || 0;
        return bAmt - aAmt;
      }
      return 0;
    });

    return result;
  },

  async getCaseById(id) {
    await simulateDelay(120);
    const found = casesStore.find(c => c.id.toLowerCase() === id.toLowerCase());
    if (!found) {
      throw new Error(`Case with ID ${id} not found.`);
    }
    return JSON.parse(JSON.stringify(found));
  },

  async createCaseFromSupport(payload) {
    await simulateDelay(350);
    const newId = `ARG-${1050 + Math.floor(Math.random() * 800)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newCase = {
      id: newId,
      title: payload.title || payload.complaintText.substring(0, 65) + "...",
      customer: {
        name: payload.customerName || "You (Support User)",
        email: payload.customerEmail || "user@enterprise.org",
        avatar: (payload.customerName || "SU").split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        tier: payload.tier || "Enterprise Tier",
        joinedDate: "Active Session",
        reliabilityScore: 94,
        reliabilityBand: "High Reliability",
        totalCases: 2,
        resolvedCases: 1,
        disputedCases: 0,
        isUserSubmitted: true
      },
      complaintText: payload.complaintText,
      category: payload.category || "General Support & Investigation",
      priority: payload.priority || "High",
      status: "Investigating",
      createdAt: nowStr,
      updatedAt: nowStr,
      orderId: payload.orderId || "ORD-RECENT-01",
      amount: payload.amount || "$199.00",
      assignedTeam: "Tier 1 Support & Autonomous Investigation",
      assignedAgent: "Investigation Coordinator",
      activeAgents: [
        { id: "coordinator", name: "Coordinator", status: "investigating", progress: 60, role: "Consensus & Root Cause Engine" },
        { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Ledger & Gateway Audit" },
        { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Fulfillment & Inventory State" },
        { id: "tech", name: "Technical Agent", status: "investigating", progress: 75, role: "Telemetry & Signal Diagnostics" },
        { id: "evidence_verifier", name: "Evidence Verification", status: "completed", progress: 100, role: "Cryptographic Digest & Hash Audit" }
      ],
      agentsData: {
        coordinator: {
          agentName: "Investigation Coordinator",
          version: "v5.0.0",
          status: "Synthesizing",
          confidenceScore: 95.0,
          task: "Synthesize findings across parallel agents and formulate verified root cause",
          summary: "Autonomous consensus forming across Billing, Order, and Technical pipelines.",
          executionTime: "160ms",
          metrics: [{ label: "Synthesis Status", value: "Forming Consensus" }, { label: "Discrepancy Score", value: "Zero Discrepancy" }],
          findings: ["Autonomous investigation pipeline deployed and auditing telemetry."]
        },
        billing: {
          agentName: "Billing Agent",
          version: "v3.4.1",
          status: "Completed",
          confidenceScore: 97.2,
          task: "Query payment gateway ledger for matching order references and verify escrow",
          summary: "Identified captured transaction for order. Gateway authorization cleared without chargeback dispute.",
          executionTime: "340ms",
          metrics: [{ label: "Gateway Record", value: "Verified Active" }, { label: "Dispute Flag", value: "Clean" }],
          findings: ["Payment cleared through processor.", "Escrow reserve verified intact."]
        },
        order: {
          agentName: "Order Agent",
          version: "v2.8.0",
          status: "Completed",
          confidenceScore: 96.5,
          task: "Check fulfillment status and warehouse routing pipeline",
          summary: "OMS entity located. Status shows processing delay in regional fulfillment dispatch.",
          executionTime: "290ms",
          metrics: [{ label: "Warehouse State", value: "Queue Paused" }, { label: "Inventory Lock", value: "Reserved" }],
          findings: ["Item remains safely allocated in warehouse inventory.", "Awaiting pipeline trigger."]
        },
        tech: {
          agentName: "Technical Agent",
          version: "v4.1.2",
          status: "Investigating",
          confidenceScore: 93.0,
          task: "Audit message queue and system events for trace drops",
          summary: "Transient sync pause detected between payment confirmation and order release worker.",
          executionTime: "520ms",
          metrics: [{ label: "System Anomaly", value: "Minor Worker Lag" }],
          findings: ["Event payload received.", "Processing queue backlog clearing."]
        },
        evidence_verifier: {
          agentName: "Evidence Verification Agent",
          version: "v2.1.0",
          status: "Completed",
          confidenceScore: 99.0,
          task: "Verify cryptographic SHA-256 digests and customer proof artifacts",
          summary: "Cryptographic hash generation and attestation completed for uploaded statements and order records.",
          executionTime: "95ms",
          metrics: [{ label: "Digests Generated", value: "SHA-256 Validated" }, { label: "Tampering Flags", value: "None" }],
          findings: ["All ingested documents hashed with SHA-256 digests.", "Immutable timestamp recorded."]
        }
      },
      timeline: [
        { step: 1, title: "Complaint Ingested", desc: "Submitted through ARGUS Customer Support Portal", time: nowStr.split(' ')[1], status: "completed" },
        { step: 2, title: "Case Classified", desc: `Categorized as ${payload.category || 'General Support'} (Priority: ${payload.priority || 'High'})`, time: nowStr.split(' ')[1], status: "completed" },
        { step: 3, title: "Agents Assigned", desc: "Billing, Order, Tech, Evidence Verifier & Coordinator mobilized", time: nowStr.split(' ')[1], status: "completed" },
        { step: 4, title: "Evidence Retrieved", desc: "Automated ingestion of system logs and order records", time: nowStr.split(' ')[1], status: "completed" },
        { step: 5, title: "Investigation In Progress", desc: "Parallel agents analyzing ledger, OMS, and system telemetry", time: nowStr.split(' ')[1], status: "current" },
        { step: 6, title: "Contradictions Checked", desc: "Running statement vs telemetry matrix", time: "Pending", status: "pending" },
        { step: 7, title: "Root Cause Diagnosis", desc: "Coordinator identifying root cause", time: "Pending", status: "pending" },
        { step: 8, title: "Resolution Generation", desc: "Automated customer-facing resolution", time: "Pending", status: "pending" },
        { step: 9, title: "Resolution Finalized", desc: "Execution or Human Review sign-off", time: "Pending", status: "pending" }
      ],
      investigationOverview: {
        status: "Active Investigation",
        objective: `Investigate customer complaint for order ${payload.orderId || 'ORD-RECENT-01'} regarding ${payload.category || 'General Support'}.`,
        currentStage: "Stage 05 — Investigation In Progress",
        openQuestions: [
          "Are there conflicting records between the customer statement and gateway transactions?",
          "Does inventory hold remain secure in fulfillment OMS?"
        ],
        pendingEvidence: [
          "Gateway transaction settlement digest",
          "Warehouse fulfillment dispatch confirmation"
        ],
        nextSuggestedStep: "Await parallel agent consensus formation and review proposed root cause."
      },
      findings: {
        verifiedFacts: [
          `Customer complaint ingested: "${payload.complaintText.substring(0, 100)}..."`,
          `Associated order reference: ${payload.orderId || 'ORD-RECENT-01'}`
        ],
        unverifiedClaims: [
          "Customer report of pending resolution or missing funds."
        ],
        supportingEvidence: [
          "Customer Statement Verbatim Intake",
          ...(payload.attachments || []).map(a => `Uploaded attachment: ${a.name}`)
        ],
        contradictoryEvidence: [],
        missingInfo: [
          "Live payment gateway reconciliation signature"
        ],
        confidenceStatus: "95.0% Initial Classifier Assessment"
      },
      internalNotes: [
        {
          id: `note-${Date.now()}-1`,
          author: "Intake Pipeline",
          role: "System Agent",
          text: `Case registered via Customer Support intake. Category: ${payload.category || 'General Support'}. Mobilized 5 diagnostic agents.`,
          timestamp: nowStr
        }
      ],
      evidence: [
        {
          id: `ev-new-${Date.now()}-1`,
          title: "Order Record Ingestion",
          type: "Database Entity",
          source: "OMS Core Database",
          timestamp: nowStr,
          status: "Verified",
          description: `Ingested order details for ${payload.orderId || 'ORD-RECENT-01'}.`,
          payload: { order_id: payload.orderId || 'ORD-RECENT-01', complaint: payload.complaintText }
        },
        {
          id: `ev-new-${Date.now()}-2`,
          title: "Customer Complaint Verbatim Transcript",
          type: "Customer Statement",
          source: "ARGUS Support Intake Form",
          timestamp: nowStr,
          status: "Verified",
          payload: { text: payload.complaintText, attachments: payload.attachments || [] }
        },
        ...(payload.attachments || []).map((att, i) => ({
          id: `ev-upload-${Date.now()}-${i}`,
          title: `Evidence File: ${att.name}`,
          type: att.type && att.type.includes('image') ? 'Image Evidence' : 'Document File',
          source: 'Customer Upload',
          timestamp: nowStr,
          status: 'Verified Prototype',
          description: `Attached proof (${(att.size / 1024).toFixed(1)} KB) submitted during complaint intake.`,
          payload: { filename: att.name, size: att.size, type: att.type }
        }))
      ],
      resolutionPreference: payload.resolutionPreference || "Full Refund to Original Payment Method",
      incidentDate: payload.incidentDate || nowStr.split(' ')[0],
      contradiction: null,
      rootCause: {
        headline: "Transient event processing latency between payment capture and fulfillment release.",
        summary: "The payment succeeded normally; the fulfillment workflow was delayed by an automated security throttle. Investigation is verifying release authorization.",
        chain: [
          { label: "Complaint", text: "Customer reported order in pending state" },
          { label: "Telemetry", text: "Payment confirmed, inventory lock verified" },
          { label: "Diagnosis", text: "Security throttle queued order for autonomous clearance" }
        ],
        impact: "Customer awaiting confirmation."
      },
      resolution: {
        actionType: "Autonomous Order Clearance",
        status: "Formulated",
        confidenceScore: 96.5,
        headline: "Clear Security Throttle & Dispatch Priority Confirmation",
        reason: "Zero fraudulent indicators. Validated payment and inventory holds.",
        customerFacingMessage: "Thank you for reaching out. ARGUS investigated your case across our Billing, Order, and Technical systems. We verified that your payment cleared successfully, and your order has now been released to our fulfillment center with Priority Express tracking assigned.",
        internalActions: [
          { id: "act-new-1", title: "Release inventory hold to priority pick queue", status: "Ready" },
          { id: "act-new-2", title: "Send confirmation SMS and courier link to customer", status: "Ready" }
        ],
        resolutionNotes: "Automated clearance generated by prototype coordinator.",
        humanEscalationStatus: "None",
        nextAction: "Execute approved resolution"
      },
      escalation: null
    };

    casesStore = [newCase, ...casesStore];
    return newCase;
  },

  async updateCaseStatus(caseId, newStatus, reason = '') {
    await simulateDelay(200);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const updatedNotes = [...(casesStore[index].internalNotes || [])];
      if (reason) {
        updatedNotes.push({
          id: `note-${Date.now()}`,
          author: "Operations Lead",
          role: "Specialist",
          text: `Status updated to ${newStatus}: ${reason}`,
          timestamp: nowStr
        });
      }

      casesStore[index] = {
        ...casesStore[index],
        status: newStatus,
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async updateCasePriority(caseId, newPriority) {
    await simulateDelay(150);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const updatedNotes = [...(casesStore[index].internalNotes || [])];
      updatedNotes.push({
        id: `note-${Date.now()}`,
        author: "Operations Lead",
        role: "Specialist",
        text: `Priority adjusted from ${casesStore[index].priority} to ${newPriority}.`,
        timestamp: nowStr
      });

      casesStore[index] = {
        ...casesStore[index],
        priority: newPriority,
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async assignCaseTeam(caseId, assignedTeam, assignedAgent) {
    await simulateDelay(180);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const updatedNotes = [...(casesStore[index].internalNotes || [])];
      updatedNotes.push({
        id: `note-${Date.now()}`,
        author: "Operations Lead",
        role: "Specialist",
        text: `Assigned to team "${assignedTeam}" (Lead: ${assignedAgent || 'Auto'}).`,
        timestamp: nowStr
      });

      casesStore[index] = {
        ...casesStore[index],
        assignedTeam,
        assignedAgent: assignedAgent || casesStore[index].assignedAgent,
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async addCaseInternalNote(caseId, note) {
    await simulateDelay(150);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const newNote = {
        id: note.id || `note-${Date.now()}`,
        author: note.author || "Operations Lead",
        role: note.role || "Support Specialist",
        text: note.text || note.content || "",
        timestamp: note.timestamp || nowStr
      };

      const updatedNotes = [...(casesStore[index].internalNotes || []), newNote];
      casesStore[index] = {
        ...casesStore[index],
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async updateCaseResolution(caseId, resolutionData) {
    await simulateDelay(200);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      casesStore[index] = {
        ...casesStore[index],
        resolution: {
          ...(casesStore[index].resolution || {}),
          ...resolutionData
        },
        updatedAt: nowStr
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async updateCaseFindings(caseId, findingsData) {
    await simulateDelay(180);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      casesStore[index] = {
        ...casesStore[index],
        findings: {
          ...(casesStore[index].findings || {}),
          ...findingsData
        },
        updatedAt: nowStr
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async escalateCaseToHuman(caseId, reason, riskLevel = "High") {
    await simulateDelay(250);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const updatedNotes = [...(casesStore[index].internalNotes || [])];
      updatedNotes.push({
        id: `note-${Date.now()}`,
        author: "Operations Lead",
        role: "Specialist",
        text: `Case escalated to Human Review (${riskLevel} Risk): ${reason}`,
        timestamp: nowStr
      });

      casesStore[index] = {
        ...casesStore[index],
        status: "Human Review",
        escalation: {
          required: true,
          reason,
          riskLevel,
          recommendedAction: "Review agent evidence discrepancies and determine resolution.",
          assignedSpecialist: "Senior Support Operations Lead"
        },
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async approveResolution(caseId) {
    await simulateDelay(250);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const updatedNotes = [...(casesStore[index].internalNotes || [])];
      updatedNotes.push({
        id: `note-${Date.now()}`,
        author: "Operations Lead",
        role: "Supervisor",
        text: "Resolution plan approved. Automated system interventions authorized for execution.",
        timestamp: nowStr
      });

      casesStore[index] = {
        ...casesStore[index],
        status: "Resolved",
        timeline: (casesStore[index].timeline || []).map(t => ({ ...t, status: "completed" })),
        resolution: {
          ...(casesStore[index].resolution || {}),
          status: "Resolved"
        },
        updatedAt: nowStr,
        internalNotes: updatedNotes
      };
      return JSON.parse(JSON.stringify(casesStore[index]));
    }
    throw new Error(`Case ${caseId} not found`);
  },

  // --- Support FAQ ---
  async getFaqItems(query = '', category = 'all') {
    await simulateDelay(120);
    let items = [...faqStore];
    if (category && category !== 'all') {
      items = items.filter(f => f.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      const q = query.toLowerCase();
      items = items.filter(f =>
        f.question.toLowerCase().includes(q) ||
        f.shortAnswer.toLowerCase().includes(q) ||
        f.fullAnswer.toLowerCase().includes(q)
      );
    }
    return items;
  },

  async voteFaqHelpful(faqId, isHelpful = true) {
    await simulateDelay(60);
    const index = faqStore.findIndex(f => f.id === faqId);
    if (index !== -1) {
      const updated = {
        ...faqStore[index],
        helpfulCount: isHelpful ? (faqStore[index].helpfulCount || 0) + 1 : faqStore[index].helpfulCount,
        notHelpfulCount: !isHelpful ? (faqStore[index].notHelpfulCount || 0) + 1 : faqStore[index].notHelpfulCount
      };
      faqStore[index] = updated;
      return updated;
    }
    return null;
  },

  async getCustomerCases(customerEmail = '') {
    await simulateDelay(120);
    let list = [...casesStore];
    if (customerEmail) {
      const emailLower = customerEmail.toLowerCase();
      list = list.filter(c => c.customer?.email?.toLowerCase() === emailLower);
    }
    return list;
  },

  // --- Intelligence & Patterns ---
  async getPatterns() {
    await simulateDelay(150);
    return [...patternsStore];
  },

  async getPreventionRecommendations() {
    await simulateDelay(150);
    return [...preventionStore];
  },

  async updatePreventionStatus(id, newStatus) {
    await simulateDelay(200);
    const index = preventionStore.findIndex(p => p.id === id);
    if (index !== -1) {
      preventionStore[index] = { ...preventionStore[index], status: newStatus };
      return preventionStore[index];
    }
    return null;
  },

  // --- System KPIs ---
  async getKpiStats() {
    await simulateDelay(100);
    const active = casesStore.filter(c => c.status !== 'Resolved').length;
    const resolved = casesStore.filter(c => c.status === 'Resolved').length;
    const humanReview = casesStore.filter(c => c.status === 'Human Review').length;
    const contradictions = casesStore.filter(c => c.contradiction !== null).length;

    return {
      ...SYSTEM_KPI_STATS,
      activeCases: active,
      casesResolved: 480 + resolved,
      humanEscalations: humanReview,
      contradictionsDetected: contradictions
    };
  },

  // --- Operational Dashboard Telemetry ---
  async getDashboardKPIs() {
    await simulateDelay(80);
    const active = casesStore.filter(c => c.status !== 'Resolved').length;
    const resolved = casesStore.filter(c => c.status === 'Resolved').length;
    const humanReview = casesStore.filter(c => c.status === 'Human Review' || c.contradiction !== null).length;

    return {
      ...DASHBOARD_KPIS,
      activeCases: {
        ...DASHBOARD_KPIS.activeCases,
        value: 20 + active
      },
      resolvedCases: {
        ...DASHBOARD_KPIS.resolvedCases,
        value: 1420 + resolved
      },
      humanEscalations: {
        ...DASHBOARD_KPIS.humanEscalations,
        value: 10 + humanReview
      }
    };
  },

  async getVolumeAnalytics(timeframe = '7d') {
    await simulateDelay(100);
    return VOLUME_ANALYTICS[timeframe] || VOLUME_ANALYTICS['7d'];
  },

  async getCategoryDistribution() {
    await simulateDelay(90);
    return [...CASE_DISTRIBUTION];
  },

  async getAttentionCases() {
    await simulateDelay(110);
    return [...CASES_REQUIRING_ATTENTION];
  },

  async getActivityStream() {
    await simulateDelay(90);
    return [...RECENT_INVESTIGATION_ACTIVITY];
  }
};
