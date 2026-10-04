/**
 * ARGUS Dashboard Mock Data & Analytics Layer
 * Structured operational dataset for workload, resolution performance,
 * multi-agent telemetry, category distributions, and attention queues.
 */

export const DASHBOARD_KPIS = {
  activeCases: {
    label: "Active Cases",
    value: 24,
    delta: "+2.4%",
    deltaType: "positive",
    trendText: "6 incoming today",
    period: "vs last week",
    subtext: "18 in automated DAG, 6 waiting"
  },
  resolvedCases: {
    label: "Resolved Cases",
    value: 1429,
    delta: "+8.4%",
    deltaType: "positive",
    trendText: "98.4% auto-resolved",
    period: "vs last week",
    subtext: "Protected value: $128,450"
  },
  humanEscalations: {
    label: "Human Escalations",
    value: 14,
    delta: "-3.1%",
    deltaType: "positive", // less escalations is positive
    trendText: "Neutral Conflict Guard",
    period: "vs last week",
    subtext: "0 ad-hominem fraud labels"
  },
  avgResolutionTime: {
    label: "Avg Resolution Time",
    value: "4.2m",
    delta: "-18.5%",
    deltaType: "positive",
    trendText: "340ms median DAG latency",
    period: "faster WoW",
    subtext: "Target SLA: < 15.0m"
  }
};

export const VOLUME_ANALYTICS = {
  "7d": [
    { label: "Mon", ingested: 42, resolved: 38, contradiction: 2, amount: "$14,200", autoPercent: 90 },
    { label: "Tue", ingested: 58, resolved: 54, contradiction: 3, amount: "$18,900", autoPercent: 93 },
    { label: "Wed", ingested: 74, resolved: 70, contradiction: 4, amount: "$26,400", autoPercent: 94 },
    { label: "Thu", ingested: 62, resolved: 59, contradiction: 1, amount: "$21,100", autoPercent: 95 },
    { label: "Fri", ingested: 89, resolved: 85, contradiction: 3, amount: "$31,800", autoPercent: 95 },
    { label: "Sat", ingested: 46, resolved: 44, contradiction: 2, amount: "$16,500", autoPercent: 96 },
    { label: "Sun", ingested: 35, resolved: 34, contradiction: 1, amount: "$12,300", autoPercent: 97 }
  ],
  "14d": [
    { label: "W1-M", ingested: 38, resolved: 35, contradiction: 2, amount: "$12,800", autoPercent: 92 },
    { label: "W1-T", ingested: 44, resolved: 40, contradiction: 1, amount: "$15,200", autoPercent: 91 },
    { label: "W1-W", ingested: 61, resolved: 58, contradiction: 3, amount: "$20,400", autoPercent: 95 },
    { label: "W1-T", ingested: 52, resolved: 49, contradiction: 2, amount: "$17,900", autoPercent: 94 },
    { label: "W1-F", ingested: 78, resolved: 74, contradiction: 4, amount: "$27,100", autoPercent: 95 },
    { label: "W1-S", ingested: 41, resolved: 39, contradiction: 1, amount: "$14,000", autoPercent: 95 },
    { label: "W1-U", ingested: 30, resolved: 29, contradiction: 1, amount: "$10,500", autoPercent: 97 },
    { label: "W2-M", ingested: 42, resolved: 38, contradiction: 2, amount: "$14,200", autoPercent: 90 },
    { label: "W2-T", ingested: 58, resolved: 54, contradiction: 3, amount: "$18,900", autoPercent: 93 },
    { label: "W2-W", ingested: 74, resolved: 70, contradiction: 4, amount: "$26,400", autoPercent: 94 },
    { label: "W2-T", ingested: 62, resolved: 59, contradiction: 1, amount: "$21,100", autoPercent: 95 },
    { label: "W2-F", ingested: 89, resolved: 85, contradiction: 3, amount: "$31,800", autoPercent: 95 },
    { label: "W2-S", ingested: 46, resolved: 44, contradiction: 2, amount: "$16,500", autoPercent: 96 },
    { label: "W2-U", ingested: 35, resolved: 34, contradiction: 1, amount: "$12,300", autoPercent: 97 }
  ],
  "30d": [
    { label: "Week 1", ingested: 344, resolved: 325, contradiction: 14, amount: "$117,900", autoPercent: 94 },
    { label: "Week 2", ingested: 392, resolved: 376, contradiction: 18, amount: "$134,200", autoPercent: 96 },
    { label: "Week 3", ingested: 406, resolved: 384, contradiction: 16, amount: "$141,800", autoPercent: 95 },
    { label: "Week 4", ingested: 421, resolved: 408, contradiction: 12, amount: "$153,600", autoPercent: 97 }
  ]
};

export const CASE_DISTRIBUTION = [
  {
    category: "Billing & Payment Sync",
    count: 543,
    percentage: 38,
    color: "var(--accent-cyan)",
    description: "Webhook drops, duplicate card captures, escrow holds"
  },
  {
    category: "Order & Logistics",
    count: 457,
    percentage: 32,
    color: "var(--accent-teal)",
    description: "Courier spatial drift, warehouse pick lock, lost shipments"
  },
  {
    category: "Technical & API Lag",
    count: 257,
    percentage: 18,
    color: "var(--accent-sky)",
    description: "Kafka partition rebalance, ingress gateway 504 timeouts"
  },
  {
    category: "Product Quality",
    count: 114,
    percentage: 8,
    color: "var(--status-amber)",
    description: "Seller batch defects, packaging damage, expired goods"
  },
  {
    category: "Other & Account",
    count: 58,
    percentage: 4,
    color: "var(--status-purple)",
    description: "Password reset locks, account access verification"
  }
];

export const CASES_REQUIRING_ATTENTION = [
  {
    id: "ARG-1043",
    title: "Customer Denial vs Physical Delivery Scan Geofence Mismatch",
    customer: "David Kim",
    tier: "Standard",
    amount: "$1,199.00",
    orderId: "ORD-99124",
    reason: "Courier scanner GPS indicates 210m drift from property geofence. High-value item requires specialist inspection.",
    attentionType: "Contradiction Detected",
    priority: "Urgent",
    status: "Contradiction Detected",
    actionLabel: "Review Contradiction",
    updatedAt: "14m ago"
  },
  {
    id: "ARG-1042",
    title: "Payment captured twice on webhook retry; duplicate order created",
    customer: "Sophia Martinez",
    tier: "Enterprise Tier",
    amount: "$389.00",
    orderId: "ORD-88219",
    reason: "Internal Kafka DLQ timeout dropped confirmation event during pod restart. Automated refund formulation ready for approval.",
    attentionType: "Consensus Ready",
    priority: "High",
    status: "Investigating",
    actionLabel: "Approve Resolution",
    updatedAt: "22m ago"
  },
  {
    id: "ARG-1047",
    title: "Certified scale receipt missing on MacBook Pro hardware return",
    customer: "Elena Rostova",
    tier: "Enterprise Tier",
    amount: "$1,899.00",
    orderId: "ORD-77402",
    reason: "Dynamic Evidence Protocol Tier 4 triggered. Awaiting signed carrier drop-off weight certificate.",
    attentionType: "Pending Evidence",
    priority: "High",
    status: "Evidence Required",
    actionLabel: "Inspect Proof",
    updatedAt: "45m ago"
  },
  {
    id: "ARG-1045",
    title: "Bulk commercial return request exceeding automated dollar threshold",
    customer: "Marcus Vance",
    tier: "Commercial Partner",
    amount: "$4,250.00",
    orderId: "ORD-66291",
    reason: "Disputed sum exceeds $150 auto-resolution threshold. Requires Senior Operations Specialist sign-off.",
    attentionType: "Human Escalation Required",
    priority: "Critical",
    status: "Human Review",
    actionLabel: "Specialist Review",
    updatedAt: "1h ago"
  }
];

export const RECENT_INVESTIGATION_ACTIVITY = [
  {
    id: "act-1",
    caseId: "ARG-1042",
    type: "classified",
    title: "Case Classified",
    detail: "Triage categorized dispute as 'Billing & Order Sync'",
    time: "2m ago",
    agent: "Coordinator",
    status: "completed"
  },
  {
    id: "act-2",
    caseId: "ARG-1042",
    type: "billing_audit",
    title: "Billing Agent Ledger Audit",
    detail: "Queried Stripe ledger: ch_3M4zZ8891 capture verified in merchant escrow",
    time: "4m ago",
    agent: "Billing Agent",
    status: "completed"
  },
  {
    id: "act-3",
    caseId: "ARG-1043",
    type: "carrier_telemetry",
    title: "Carrier Telemetry Ingested",
    detail: "FastTrack e-POD and GPS coordinates retrieved for ORD-99124",
    time: "8m ago",
    agent: "Order Agent",
    status: "completed"
  },
  {
    id: "act-4",
    caseId: "ARG-1043",
    type: "contradiction",
    title: "Contradiction Flagged",
    detail: "Statement denial vs Delivery scan geofence discrepancy recorded neutrally",
    time: "14m ago",
    agent: "Consensus Engine",
    status: "warning"
  },
  {
    id: "act-5",
    caseId: "ARG-1042",
    type: "root_cause",
    title: "Root Cause Isolated",
    detail: "Identified Kafka 504 timeout during ingress pod rollout",
    time: "22m ago",
    agent: "Technical Agent",
    status: "completed"
  },
  {
    id: "act-6",
    caseId: "ARG-1042",
    type: "resolution",
    title: "Automated Resolution Formulated",
    detail: "DLQ event replay + $20 goodwill credit drafted for customer approval",
    time: "35m ago",
    agent: "Coordinator",
    status: "completed"
  },
  {
    id: "act-7",
    caseId: "ARG-1045",
    type: "escalation",
    title: "Human Escalation Dispatched",
    detail: "Order total ($4,250.00) exceeds $150 cap; routed to Senior Specialist",
    time: "1h ago",
    agent: "Coordinator",
    status: "warning"
  }
];
