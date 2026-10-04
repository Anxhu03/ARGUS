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

    if (filters.status && filters.status !== 'all') {
      result = result.filter(c => c.status.toLowerCase() === filters.status.toLowerCase());
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(c => c.category.toLowerCase().includes(filters.category.toLowerCase()));
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(c => c.priority.toLowerCase() === filters.priority.toLowerCase());
    }
    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter(c =>
        c.id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.customer.name.toLowerCase().includes(q) ||
        c.complaintText.toLowerCase().includes(q)
      );
    }
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
    const newId = `ARG-${1048 + Math.floor(Math.random() * 800)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newCase = {
      id: newId,
      title: payload.title || payload.complaintText.substring(0, 65) + "...",
      customer: {
        name: payload.customerName || "You (Support User)",
        email: payload.customerEmail || "user@enterprise.org",
        avatar: "ME",
        tier: payload.tier || "Enterprise Tier",
        joinedDate: "Active Session",
        reliabilityScore: 92,
        reliabilityBand: "High Reliability",
        totalCases: 2,
        resolvedCases: 1,
        disputedCases: 0
      },
      complaintText: payload.complaintText,
      category: payload.category || "General Support & Investigation",
      priority: payload.priority || "High",
      status: "Investigating",
      createdAt: nowStr,
      updatedAt: nowStr,
      orderId: payload.orderId || "ORD-RECENT-01",
      amount: payload.amount || "$199.00",
      activeAgents: [
        { id: "billing", name: "Billing Agent", status: "investigating", progress: 65, role: "Transaction & Escrow Audit" },
        { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Inventory & Carrier Status" },
        { id: "tech", name: "Technical Agent", status: "investigating", progress: 80, role: "Log Analysis & System Signals" },
        { id: "coordinator", name: "Coordinator", status: "waiting", progress: 30, role: "Consensus & Root Cause Engine" }
      ],
      agentsData: {
        billing: {
          agentName: "Billing Agent",
          version: "v3.4.1",
          status: "Investigating",
          confidenceScore: 94.5,
          task: "Query payment gateway ledger for matching order references",
          summary: "Identified captured transaction for order. Gateway authorization cleared without chargeback dispute.",
          executionTime: "340ms",
          metrics: [{ label: "Gateway Record", value: "Verified Active" }, { label: "Dispute Flag", value: "Clean" }],
          findings: ["Payment cleared through credit processor.", "Escrow reserve verified."]
        },
        order: {
          agentName: "Order Agent",
          version: "v2.8.0",
          status: "Completed",
          confidenceScore: 97.0,
          task: "Check fulfillment status and warehouse routing",
          summary: "OMS entity located. Status shows processing delay in regional fulfillment dispatch.",
          executionTime: "290ms",
          metrics: [{ label: "Warehouse State", value: "Queue Paused" }, { label: "Inventory Lock", value: "Reserved" }],
          findings: ["Item remains safely allocated in warehouse inventory.", "Awaiting pipeline trigger."]
        },
        tech: {
          agentName: "Technical Agent",
          version: "v4.1.2",
          status: "Investigating",
          confidenceScore: 91.0,
          task: "Audit message queue and system events",
          summary: "Transient sync pause detected between payment confirmation and order release worker.",
          executionTime: "520ms",
          metrics: [{ label: "System Anomaly", value: "Minor Worker Lag" }],
          findings: ["Event payload received.", "Processing queue backlog clearing."]
        },
        coordinator: {
          agentName: "Coordinator",
          version: "v5.0.0",
          status: "Waiting",
          confidenceScore: 95.0,
          task: "Synthesize findings and generate resolution",
          summary: "Consensus forming across assigned agents.",
          executionTime: "Pending",
          metrics: [{ label: "Synthesis Status", value: "Forming Consensus" }],
          findings: ["Autonomous investigation pipeline actively running."]
        }
      },
      timeline: [
        { step: 1, title: "Complaint Received", desc: "Submitted through ARGUS Support Investigation Portal", time: nowStr.split(' ')[1], status: "completed" },
        { step: 2, title: "Case Classified", desc: `Categorized as ${payload.category || 'General Support'}`, time: nowStr.split(' ')[1], status: "completed" },
        { step: 3, title: "Agents Assigned", desc: "Billing, Order, and Technical agents deployed", time: nowStr.split(' ')[1], status: "completed" },
        { step: 4, title: "Evidence Retrieved", desc: "Automated ingestion of system logs and order records", time: nowStr.split(' ')[1], status: "completed" },
        { step: 5, title: "Investigation In Progress", desc: "Specialized agents analyzing ledger, OMS, and system telemetry", time: nowStr.split(' ')[1], status: "current" },
        { step: 6, title: "Contradictions Checked", desc: "Running statement vs telemetry matrix", time: "Pending", status: "pending" },
        { step: 7, title: "Root Cause Diagnosis", desc: "Coordinator identifying root cause", time: "Pending", status: "pending" },
        { step: 8, title: "Resolution Generation", desc: "Automated customer-facing resolution", time: "Pending", status: "pending" },
        { step: 9, title: "Resolution Finalized", desc: "Execution or Human Review sign-off", time: "Pending", status: "pending" }
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
        ]
      },
      escalation: null
    };

    casesStore = [newCase, ...casesStore];
    return newCase;
  },

  async updateCaseStatus(caseId, newStatus) {
    await simulateDelay(200);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      casesStore[index] = {
        ...casesStore[index],
        status: newStatus,
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return casesStore[index];
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async escalateCaseToHuman(caseId, reason, riskLevel = "High") {
    await simulateDelay(250);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
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
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return casesStore[index];
    }
    throw new Error(`Case ${caseId} not found`);
  },

  async approveResolution(caseId) {
    await simulateDelay(250);
    const index = casesStore.findIndex(c => c.id === caseId);
    if (index !== -1) {
      casesStore[index] = {
        ...casesStore[index],
        status: "Resolved",
        timeline: casesStore[index].timeline.map(t => ({ ...t, status: "completed" })),
        updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
      };
      return casesStore[index];
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
