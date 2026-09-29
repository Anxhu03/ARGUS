/**
 * ARGUS Mock Data Repository
 * Production-grade mock entities for multi-agent case investigation,
 * knowledge retrieval, evidence matrices, contradictions, and pattern intelligence.
 */

export const INITIAL_CASES = [
  {
    id: "ARG-1042",
    title: "Payment successful but order remains pending with missing refund",
    customer: {
      name: "Sophia Martinez",
      email: "sophia.m@enterprise-cloud.io",
      avatar: "SM",
      tier: "Enterprise Tier",
      joinedDate: "Mar 2024",
      reliabilityScore: 94,
      reliabilityBand: "High Reliability",
      totalCases: 5,
      resolvedCases: 4,
      disputedCases: 0
    },
    complaintText: "I completed the checkout for Order #ORD-88219 totaling $389.00 via corporate Visa at 09:14 AM. My bank shows the funds were debited and transaction ID TXN-994101 was generated. However, the order status on my dashboard is still stuck at 'Pending Payment Verification' after 6 hours, and no confirmation email or automated refund was initiated.",
    category: "Billing & Order Sync",
    priority: "High",
    status: "Investigating",
    createdAt: "2026-09-30 09:22:15",
    updatedAt: "2026-09-30 11:45:00",
    orderId: "ORD-88219",
    amount: "$389.00",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Ledger & Gateway Audit" },
      { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Fulfillment & Inventory State" },
      { id: "tech", name: "Technical Agent", status: "investigating", progress: 78, role: "Webhook & Event Log Diagnostics" },
      { id: "coordinator", name: "Coordinator", status: "waiting", progress: 40, role: "Synthesis & Consensus Engine" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 99.2,
        task: "Verify payment authorization, ledger debit, and charge capture on Stripe Gateway",
        summary: "Payment capture confirmed by Stripe Gateway (ch_3M4zZ8891). Funds securely settled in primary merchant escrow at 09:14:22 UTC.",
        executionTime: "420ms",
        metrics: [
          { label: "Stripe Charge ID", value: "ch_3M4zZ8891" },
          { label: "Capture Status", value: "Captured (Code 200)" },
          { label: "Ledger Delta", value: "+$389.00 (Escrow)" },
          { label: "Gateway Latency", value: "182ms" }
        ],
        findings: [
          "Payment gateway authorization succeeded at 09:14:18 UTC.",
          "Capture webhook event `charge.captured` dispatched with payload hash sha256:d891b...29a.",
          "No chargeback or cardholder dispute has been filed.",
          "Escrow balance confirmed intact without automatic refund reversal."
        ]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Completed",
        confidenceScore: 97.8,
        task: "Inspect OMS inventory reservation, fulfillment lock, and cart transition state",
        summary: "Order entity ORD-88219 is paused in state `AWAITING_PAYMENT_WEBHOOK`. Reserved inventory holds (SKU-NX400, SKU-NX401) are active with 18 hours until TTL expiry.",
        executionTime: "310ms",
        metrics: [
          { label: "OMS State", value: "AWAITING_PAYMENT" },
          { label: "Inventory Lock", value: "Active (2 Items)" },
          { label: "Warehouse Routing", value: "Hub-04 (Dallas)" },
          { label: "Lock Expiry", value: "18h remaining" }
        ],
        findings: [
          "OMS created reservation session sess_998124 at 09:13:58 UTC.",
          "State transition from `AWAITING_PAYMENT` to `ORDER_CONFIRMED` was never invoked.",
          "Warehouse routing pipeline is waiting for confirmed state before initiating pick/pack.",
          "Items remain securely allocated in stock inventory."
        ]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Investigating",
        confidenceScore: 92.4,
        task: "Analyze event bus ingestion, edge webhook gateway logs, and trace drops",
        summary: "Discovered an ingress network timeout: Inbound Stripe webhook reached Edge API Gateway at 09:14:23 UTC, but internal Kafka message producer experienced a 504 Gateway Timeout due to pod recycling during deployment `deploy-core-sync-991`.",
        executionTime: "890ms",
        metrics: [
          { label: "Edge Trace ID", value: "trace_881920aa912" },
          { label: "HTTP Ingress Status", value: "200 OK (Edge)" },
          { label: "Internal Forward", value: "504 Gateway Timeout" },
          { label: "Dropped Event", value: "evt_payment_captured" }
        ],
        findings: [
          "Edge gateway successfully accepted incoming webhook from 54.187.174.169.",
          "Internal routing failed: downstream service `orders-event-bridge` dropped connection due to rolling pod restart.",
          "Dead letter queue (DLQ) hold recorded event with failure code `ERR_KAFKA_PRODUCER_DISCONNECT`.",
          "Event was not automatically replayed due to exhausted 3x retry limit on worker pool."
        ]
      },
      coordinator: {
        agentName: "Coordinator & Root Cause Engine",
        version: "v5.0.0",
        status: "Synthesizing",
        confidenceScore: 98.1,
        task: "Consolidate findings across Billing, Order, and Technical agents to formulate root cause and execution plan",
        summary: "Consensus reached: The customer paid successfully, but the order remained stuck due to an internal webhook dispatch failure during a backend rollout.",
        executionTime: "180ms",
        metrics: [
          { label: "Consensus Level", value: "98.1% High Confidence" },
          { label: "Contradiction Severity", value: "Zero Contradiction" },
          { label: "Recommended Path", value: "Automated Resync & Confirmation" },
          { label: "Customer Impact", value: "High (Pending Fulfill)" }
        ],
        findings: [
          "Customer claim verified 100%: $389.00 payment was deducted legitimately.",
          "No fraudulent or conflicting indicators present.",
          "Root cause isolated to internal event bus disruption.",
          "Actionable resolution is to force-replay the dropped webhook to transition order to confirmed state, or trigger instant compensation."
        ]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer logged ticket via Enterprise Support portal", time: "09:22:15", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Categorized as Billing & Order Sync (Confidence: 99%)", time: "09:22:18", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Billing, Order, and Technical agents mobilized in parallel", time: "09:22:20", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Captured Stripe charge logs, OMS state, and API gateway traces", time: "09:22:25", status: "completed" },
      { step: 5, title: "Investigation Performed", desc: "Cross-correlated gateway debits against OMS state transitions", time: "09:22:42", status: "completed" },
      { step: 6, title: "Contradictions Checked", desc: "Zero customer discrepancy; statements align with ledger records", time: "09:22:50", status: "completed" },
      { step: 7, title: "Root Cause Identified", desc: "Webhook drop during pod deployment caused synchronization freeze", time: "09:23:05", status: "completed" },
      { step: 8, title: "Resolution Generated", desc: "Replay dropped webhook event and dispatch confirmation SMS/Email", time: "09:23:15", status: "current" },
      { step: 9, title: "Human Review", desc: "System auto-approved (Risk score: 0.04/1.0)", time: "Pending", status: "pending" }
    ],
    evidence: [
      {
        id: "ev-101",
        title: "Stripe Gateway Charge Capture",
        type: "Financial Record",
        source: "Stripe API (Live Endpoint)",
        timestamp: "2026-09-30 09:14:22",
        status: "Verified",
        description: "Charge object ch_3M4zZ8891 status=succeeded, currency=USD, amount=38900. Card brand: Visa (4242).",
        payload: { charge_id: "ch_3M4zZ8891", amount: 389.00, status: "succeeded", captured: true, receipt_url: "https://stripe.com/receipts/ch_3M4zZ8891" }
      },
      {
        id: "ev-102",
        title: "OMS Database Entity ORD-88219",
        type: "Database Entity",
        source: "PostgreSQL Core Cluster",
        timestamp: "2026-09-30 09:14:25",
        status: "Verified",
        description: "Order record created at 09:13:58. Status flag: AWAITING_PAYMENT_CONFIRMATION. Inventory lock: Active.",
        payload: { order_id: "ORD-88219", status: "AWAITING_PAYMENT_CONFIRMATION", total: 389.00, items: 2, created_at: "2026-09-30T09:13:58Z" }
      },
      {
        id: "ev-103",
        title: "Edge Gateway Ingress Log",
        type: "System Log",
        source: "Envoy Edge Proxy",
        timestamp: "2026-09-30 09:14:23",
        status: "Verified",
        description: "POST /v1/webhooks/stripe 200 OK received from Stripe verified IP address. Trace ID: trace_881920aa912.",
        payload: { trace_id: "trace_881920aa912", status_code: 200, source_ip: "54.187.174.169", payload_bytes: 4120 }
      },
      {
        id: "ev-104",
        title: "Kafka Event Bus Dead Letter Queue",
        type: "Message Queue",
        source: "Kafka Cluster DLQ (Topic: payment-events-dlq)",
        timestamp: "2026-09-30 09:14:24",
        status: "Verified",
        description: "Dropped event record evt_payment_captured with error ERR_KAFKA_PRODUCER_DISCONNECT.",
        payload: { topic: "payment-events-dlq", offset: 489102, error: "ERR_KAFKA_PRODUCER_DISCONNECT", attempts: 3 }
      }
    ],
    contradiction: null,
    rootCause: {
      headline: "Payment gateway confirmation succeeded, but order-state synchronization failed due to webhook event drop during pod rollout.",
      summary: "Customer payment of $389.00 was authorized and captured cleanly on Stripe. However, at the exact instant the webhook hit internal routing, the order-event-bridge service was in a transient pod restart, causing the event to be moved into the Dead Letter Queue without updating the order state.",
      chain: [
        { label: "Evidence", text: "Stripe Charge ch_3M4zZ8891 captured $389.00 at 09:14:22" },
        { label: "Finding", text: "Internal Kafka producer failed with 504 Timeout during pod rollout" },
        { label: "Root Cause", text: "OMS remained in AWAITING_PAYMENT because the confirmation webhook was deposited in DLQ" }
      ],
      impact: "Single-tenant webhook sync delay; customer order held in queue with stock safely reserved."
    },
    resolution: {
      actionType: "Automated Replay & Confirmation",
      status: "Ready for Execution",
      confidenceScore: 99.4,
      headline: "Replay DLQ Webhook Event and Expedite Warehouse Fulfillment",
      reason: "Full financial proof exists with zero ambiguity. The funds are already in company accounts and warehouse stock is currently reserved.",
      customerFacingMessage: "Dear Sophia, thank you for alerting us. Our automated diagnostic system identified that your payment of $389.00 was successfully processed, but a brief system synchronization delay paused your order confirmation. We have rectified the synchronization, your order ORD-88219 is now confirmed, and we've upgraded your shipping to Priority Express at no cost. You will receive real-time courier tracking within the hour.",
      internalActions: [
        { id: "act-1", title: "Replay DLQ message evt_payment_captured to Kafka primary topic", status: "Executed" },
        { id: "act-2", title: "Transition order ORD-88219 to CONFIRMED and release to Dallas Hub-04", status: "Executed" },
        { id: "act-3", title: "Credit customer account with $25.00 courtesy goodwill voucher", status: "Scheduled" }
      ]
    },
    escalation: null
  },
  {
    id: "ARG-1043",
    title: "Customer claims package was never delivered; Carrier claims delivery with signature",
    customer: {
      name: "Marcus Vance",
      email: "marcus.vance@techcorp.com",
      avatar: "MV",
      tier: "Standard Tier",
      joinedDate: "Jan 2025",
      reliabilityScore: 82,
      reliabilityBand: "Reliable History",
      totalCases: 2,
      resolvedCases: 2,
      disputedCases: 0
    },
    complaintText: "Order #ORD-77402 was marked as 'Delivered' yesterday at 14:32 PM according to your tracking email, but I was home all afternoon and no courier ever knocked. My front porch camera shows no vehicle stopped between 14:00 and 15:30. I want an immediate replacement or full refund of $649.00 for the graphics card.",
    category: "Logistics & Delivery Dispute",
    priority: "Urgent",
    status: "Contradiction Detected",
    createdAt: "2026-09-30 08:15:00",
    updatedAt: "2026-09-30 11:30:10",
    orderId: "ORD-77402",
    amount: "$649.00",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Payment Ledger" },
      { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Warehouse Dispatch" },
      { id: "tech", name: "Technical Agent", status: "completed", progress: 100, role: "Carrier Telemetry Audit" },
      { id: "coordinator", name: "Coordinator", status: "completed", progress: 100, role: "Contradiction & Geofence Matrix" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 99.0,
        task: "Verify payment clearance and chargeback protection status",
        summary: "Payment of $649.00 settled via PayPal. Account eligible for standard logistics loss guarantee.",
        executionTime: "210ms",
        metrics: [{ label: "Payment Status", value: "Settled" }, { label: "Dispute Filed", value: "None" }],
        findings: ["Original payment cleared 3 business days ago.", "No third-party payment hold exists."]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Completed",
        confidenceScore: 98.5,
        task: "Audit warehouse dispatch, serial number assignment, and shipping label manifest",
        summary: "Item GPU-RTX4070-OC (Serial #SN-99812401) dispatched via FastTrack Couriers under tracking FT-99124019.",
        executionTime: "340ms",
        metrics: [{ label: "Carrier", value: "FastTrack Express" }, { label: "Tracking Number", value: "FT-99124019" }],
        findings: ["Parcel weight verified at warehouse scale: 1.84 kg.", "Correct delivery address applied: 442 Pinehurst Ave, Seattle, WA 98101."]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Completed",
        confidenceScore: 96.2,
        task: "Query Carrier Telemetry API for GPS coordinates of scanner at timestamp of delivery scan",
        summary: "Carrier scan timestamp 14:32:08 was tagged at GPS Lat: 47.6142, Lon: -122.3298. Geofence radius check reveals this coordinate is 320 meters away from customer address (442 Pinehurst Ave). Delivery photo captured a blue porch mat; customer profile shows grey concrete steps.",
        executionTime: "620ms",
        metrics: [
          { label: "Scan Timestamp", value: "14:32:08 UTC" },
          { label: "Scanner GPS Offset", value: "320m East of Target" },
          { label: "Geofence Check", value: "FAILED (Mismatch)" },
          { label: "Porch Photo", value: "Blue mat (Address has none)" }
        ],
        findings: [
          "Courier scanner GPS confirms delivery scan occurred at 784 Pinehurst Court instead of 442 Pinehurst Ave.",
          "Signature obtained was scribbled 'M. Vance' but customer provided sworn affidavit of absence of signature.",
          "Visual comparison confirms courier misdelivered parcel to adjacent cul-de-sac."
        ]
      },
      coordinator: {
        agentName: "Coordinator & Contradiction Engine",
        version: "v5.0.0",
        status: "Completed",
        confidenceScore: 95.8,
        task: "Weigh customer statement against carrier proof of delivery to isolate discrepancy",
        summary: "Resolved contradiction: The customer was correct. While carrier marked delivery as completed, spatial telemetry proves misdelivery to wrong residence 320m away.",
        executionTime: "240ms",
        metrics: [
          { label: "Contradiction Status", value: "Confirmed Carrier Error" },
          { label: "Customer Fraud Risk", value: "0.02 (Negligible)" },
          { label: "Carrier Fault Score", value: "0.98 (Confirmed Misdelivery)" }
        ],
        findings: [
          "Contradiction initially detected between customer claim (never received) and carrier record (delivered).",
          "Deep telemetry investigation verified that the contradiction arose from driver error, NOT customer dishonesty.",
          "Customer claim reliability verified."
        ]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer disputed delivered status of graphics card ($649)", time: "08:15:00", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Classified as Logistics & Delivery Dispute (Priority: Urgent)", time: "08:15:02", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Order Agent, Tech Agent & Coordinator mobilized", time: "08:15:05", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Ingested carrier delivery receipt, scanner GPS, and customer camera logs", time: "08:15:20", status: "completed" },
      { step: 5, title: "Investigation Performed", desc: "Cross-checked delivery geofence against registered home coordinates", time: "08:15:45", status: "completed" },
      { step: 6, title: "Contradiction Detected", desc: "System vs Customer: Carrier marked Delivered vs Customer porch camera empty", time: "08:16:00", status: "completed" },
      { step: 7, title: "Root Cause Identified", desc: "GPS offset proves courier misdelivered parcel 320m away on wrong street", time: "08:16:25", status: "completed" },
      { step: 8, title: "Resolution Generated", desc: "Trigger priority reshipment from local warehouse + file carrier claim", time: "08:16:40", status: "completed" },
      { step: 9, title: "Human Review", desc: "Escalated for logistics specialist sign-off on courier insurance claim", time: "08:17:00", status: "current" }
    ],
    evidence: [
      {
        id: "ev-201",
        title: "Carrier Electronic Proof of Delivery (e-POD)",
        type: "Carrier Document",
        source: "FastTrack API v2",
        timestamp: "2026-09-29 14:32:08",
        status: "Conflicting",
        description: "Status marked 'DELIVERED'. Signature captured: 'M. Vance'. Photo: parcel on blue doormat.",
        payload: { tracking: "FT-99124019", signed_by: "M. Vance", lat: 47.6142, lon: -122.3298 }
      },
      {
        id: "ev-202",
        title: "Customer Property Geolocation Benchmark",
        type: "GIS Spatial Record",
        source: "Customer Verified Profile & Google Maps Geocoder",
        timestamp: "2026-09-30 08:15:30",
        status: "Verified",
        description: "Official residence coordinate: Lat 47.6169, Lon -122.3325. Distance delta to driver scan: 322.4 meters.",
        payload: { lat: 47.6169, lon: -122.3325, address: "442 Pinehurst Ave, Seattle, WA 98101" }
      },
      {
        id: "ev-203",
        title: "Customer Porch Camera Video Metadata",
        type: "Customer Upload",
        source: "Nest Doorbell Uploaded Transcript",
        timestamp: "2026-09-29 14:00 - 15:30",
        status: "Verified",
        description: "Continuous motion log confirms zero persons or delivery vehicles entered the property during delivery window.",
        payload: { camera_active: true, motion_events: 0, time_range: "14:00:00 - 15:30:00" }
      }
    ],
    contradiction: {
      headline: "Contradiction Detected: Customer Statement vs Carrier Delivery Confirmation",
      disclaimer: "Notice: Contradiction does NOT imply customer fraud. ARGUS autonomously audits technical records before assigning fault.",
      customerClaim: "Customer states package was never received and front door was unattended with no courier stopping.",
      systemEvidence: "Carrier FastTrack returned signed e-POD marked 'Delivered' at 14:32:08.",
      conflictFields: ["Delivery Status", "Physical Custody", "GPS Geolocation Coordinates"],
      evidenceSources: ["FastTrack Courier Telemetry API", "Nest Porch Video Motion Feed", "USPS Geocoder"],
      analysis: "Telemetry spatial mapping proved that the carrier driver scanned the barcode at 784 Pinehurst Court (320 meters East), dropping the package at an incorrect residence with an identical house number on a neighboring street.",
      recommendedStep: "Verify driver vehicle GPS route trail, file immediate carrier liability recovery, and approve instant customer reshipment."
    },
    rootCause: {
      headline: "Carrier misdelivered parcel to wrong street (784 Pinehurst Ct instead of 442 Pinehurst Ave) due to driver navigation error.",
      summary: "Carrier e-POD was signed and scanned, but driver scanner GPS coordinates show a 320m spatial offset from customer's residence. The contradiction between customer report and carrier status was caused by third-party carrier delivery error.",
      chain: [
        { label: "Customer Claim", text: "Customer reports no package received at 442 Pinehurst Ave" },
        { label: "Carrier Telemetry", text: "Driver scanned parcel 320m away at 784 Pinehurst Court" },
        { label: "Root Cause", text: "Carrier driver followed wrong street turn; misdelivered package to wrong porch" }
      ],
      impact: "High value merchandise ($649) missing; carrier breach of SLA; customer inconvenience."
    },
    resolution: {
      actionType: "Expedited Replacement & Carrier Clawback",
      status: "Awaiting Human Sign-Off",
      confidenceScore: 97.2,
      headline: "Dispatch Immediate Replacement from Seattle Warehouse + Auto-File Carrier Claim",
      reason: "Carrier telemetry unambiguously proves package was dropped at wrong address. Customer is completely exonerated of fault.",
      customerFacingMessage: "Dear Marcus, our automated investigation completed a GPS route telemetry audit with our courier partner. We discovered that your delivery driver unfortunately misdelivered your package to a neighboring street at 14:32 yesterday. We sincerely apologize for this error. We have dispatched a replacement RTX 4070 OC from our Seattle warehouse for priority same-day delivery today at no cost to you. We are handling the courier investigation internally.",
      internalActions: [
        { id: "act-1", title: "Generate replacement order ORD-77402-R from Seattle Hub with signature requirement", status: "Ready" },
        { id: "act-2", title: "Submit automated insurance clawback claim to FastTrack Logistics for $649.00", status: "Ready" },
        { id: "act-3", title: "Blacklist courier route driver tag #DRV-882 from customer's neighborhood", status: "Ready" }
      ]
    },
    escalation: {
      required: true,
      reason: "High dollar value ($649.00) logistics dispute with courier misdelivery evidence requiring manual loss write-off authorization.",
      riskLevel: "Medium",
      recommendedAction: "Approve replacement dispatch and initiate carrier insurance clawback.",
      assignedSpecialist: "Logistics Dispute Lead (Tier 2)"
    }
  },
  {
    id: "ARG-1044",
    title: "Recurring expired nutritional supplement delivered from third-party vendor",
    customer: {
      name: "Elena Rostova",
      email: "elena.rostova@healthlife.net",
      avatar: "ER",
      tier: "Enterprise Tier",
      joinedDate: "Feb 2023",
      reliabilityScore: 98,
      reliabilityBand: "Exemplary Reliability",
      totalCases: 8,
      resolvedCases: 8,
      disputedCases: 0
    },
    complaintText: "I ordered 3 bottles of PureVital Omega-3 (Order #ORD-66102). Upon arrival today, all three bottles have a manufacturer batch stamp showing an expiration date of June 2025 (4 months ago!). This is the second time this vendor has sent expired goods to our corporate fitness facility.",
    category: "Product Quality & Seller Compliance",
    priority: "High",
    status: "Human Review",
    createdAt: "2026-09-30 07:45:00",
    updatedAt: "2026-09-30 10:15:00",
    orderId: "ORD-66102",
    amount: "$142.50",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Refund Audit" },
      { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Seller & Batch Tracking" },
      { id: "tech", name: "Technical Agent", status: "completed", progress: 100, role: "Computer Vision & OCR Inspection" },
      { id: "coordinator", name: "Coordinator", status: "completed", progress: 100, role: "Cross-Case Pattern Correlation" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 100,
        task: "Validate refund authorization and vendor chargeback penalty",
        summary: "Authorized instant $142.50 refund. Assessed $50.00 vendor compliance penalty to seller escrow.",
        executionTime: "190ms",
        metrics: [{ label: "Refund Amount", value: "$142.50" }, { label: "Vendor Penalty", value: "$50.00" }],
        findings: ["Instant refund sanctioned under SafeProduct Policy."]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Completed",
        confidenceScore: 99.1,
        task: "Identify merchant, batch number, and inventory warehouse origin",
        summary: "Vendor identified as 'Apex Nutrition LLC' (Merchant ID: MERCH-8812). Batch: LOT-2023-06A.",
        executionTime: "280ms",
        metrics: [{ label: "Vendor", value: "Apex Nutrition LLC" }, { label: "Batch ID", value: "LOT-2023-06A" }],
        findings: ["Vendor fulfilled from third-party warehouse in Reno, NV.", "Cross-correlated with 14 other complaints in the past 14 days."]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Completed",
        confidenceScore: 98.6,
        task: "Run Optical Character Recognition (OCR) on customer uploaded bottle photo",
        summary: "Vision OCR confirmed text: 'EXP: 06/2025 | LOT: 2023-06A'. Bottle seal condition: intact.",
        executionTime: "510ms",
        metrics: [{ label: "OCR Confidence", value: "98.6%" }, { label: "Extracted Expiry", value: "06/2025" }],
        findings: ["Extracted expiration date is 4 months past current date.", "Image metadata shows capture at 07:38 AM with no tampering artifacts."]
      },
      coordinator: {
        agentName: "Coordinator & Pattern Engine",
        version: "v5.0.0",
        status: "Completed",
        confidenceScore: 99.4,
        task: "Correlate with multi-case intelligence database for seller compliance pattern",
        summary: "CRITICAL PATTERN TRIGGERED: Seller Apex Nutrition LLC has 14 verified complaints for LOT-2023-06A expired products. System recommends quarantine of seller catalog.",
        executionTime: "220ms",
        metrics: [{ label: "Pattern ID", value: "PAT-EXPIRED-SELLER-01" }, { label: "Severity", value: "High Compliance Risk" }],
        findings: ["Sufficient evidence to trigger automated seller storefront suspension."]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer reported expired health supplements with batch photo", time: "07:45:00", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Product Quality & Seller Compliance (High Severity)", time: "07:45:04", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Order, Tech (Vision OCR), Billing & Coordinator mobilized", time: "07:45:07", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Extracted bottle image, seller consignment history, batch numbers", time: "07:45:25", status: "completed" },
      { step: 5, title: "Investigation Performed", desc: "OCR verified expired stamp: 06/2025. Correlated vendor lot history", time: "07:45:50", status: "completed" },
      { step: 6, title: "Contradictions Checked", desc: "Zero contradiction. Expiry verified against manufacturer database", time: "07:46:10", status: "completed" },
      { step: 7, title: "Root Cause Identified", desc: "Vendor failed FIFO rotation; shipped outdated batch LOT-2023-06A", time: "07:46:30", status: "completed" },
      { step: 8, title: "Resolution Generated", desc: "Full refund + vendor quarantine + credit voucher", time: "07:46:45", status: "completed" },
      { step: 9, title: "Human Review", desc: "Vendor compliance review requested for account suspension", time: "07:47:00", status: "current" }
    ],
    evidence: [
      {
        id: "ev-301",
        title: "Customer Bottle Label Photo OCR",
        type: "Vision Analysis",
        source: "ARGUS Vision OCR Engine",
        timestamp: "2026-09-30 07:45:22",
        status: "Verified",
        description: "High resolution macro photo of bottle bottom. OCR detected text: 'MFG 06/23 EXP 06/25 LOT 2023-06A'.",
        payload: { ocr_text: "EXP: 06/2025 LOT 2023-06A", confidence: 0.986, tampered: false }
      },
      {
        id: "ev-302",
        title: "Seller Consignment Inventory Ledger",
        type: "Warehouse Log",
        source: "Reno 3PL Fulfillment Partner",
        timestamp: "2026-09-28 11:20:00",
        status: "Verified",
        description: "Stock lot intake record shows Apex Nutrition imported 800 units of LOT-2023-06A on July 2023 with no subsequent inventory audit.",
        payload: { intake_date: "2023-07-12", lot: "LOT-2023-06A", units_remaining: 184 }
      }
    ],
    contradiction: null,
    rootCause: {
      headline: "Seller Apex Nutrition failed First-In-First-Out (FIFO) stock management, shipping expired lot LOT-2023-06A.",
      summary: "Optical OCR analysis confirms product expiration date of June 2025. Cross-case intelligence indicates 14 identical cases from this seller in the last 14 days, demonstrating a systematic warehouse oversight by the merchant.",
      chain: [
        { label: "Vision Evidence", text: "Customer photo OCR confirms EXP: 06/2025 on LOT-2023-06A" },
        { label: "Inventory Audit", text: "Seller warehouse retained 184 expired units without audit" },
        { label: "Root Cause", text: "Vendor neglected stock rotation and shipped obsolete inventory" }
      ],
      impact: "Regulatory health & safety violation; vendor trust breach; customer dissatisfaction."
    },
    resolution: {
      actionType: "Instant Refund & Vendor Quarantine",
      status: "Approved",
      confidenceScore: 99.8,
      headline: "Full $142.50 Refund Issued + Seller SKU Quarantined",
      reason: "Definitive visual evidence with zero contradiction. Seller has breached marketplace quality terms.",
      customerFacingMessage: "Dear Elena, thank you for bringing this unacceptable situation to our attention. We have immediately refunded $142.50 to your corporate payment method and applied a $30.00 store credit. We have taken immediate action to quarantine all products from this seller pending a formal quality investigation. You do not need to return the bottles; please safely dispose of them.",
      internalActions: [
        { id: "act-1", title: "Issue full refund of $142.50 to customer card", status: "Executed" },
        { id: "act-2", title: "Quarantine SKU PureVital Omega-3 from Seller Apex Nutrition", status: "Executed" },
        { id: "act-3", title: "Dispatch automated audit warning to Apex Nutrition LLC", status: "Executed" }
      ]
    },
    escalation: {
      required: true,
      reason: "Repeated expired product incident (Pattern PAT-EXPIRED-SELLER-01) requiring Vendor Trust & Safety team to sanction merchant.",
      riskLevel: "High",
      recommendedAction: "Impose 14-day storefront freeze on Apex Nutrition LLC and demand certified warehouse audit.",
      assignedSpecialist: "Trust & Safety Compliance Officer"
    }
  },
  {
    id: "ARG-1045",
    title: "Double billing charged on annual SaaS enterprise renewal",
    customer: {
      name: "David K. Chen",
      email: "david.chen@synergycorp.com",
      avatar: "DC",
      tier: "Enterprise Tier",
      joinedDate: "Nov 2022",
      reliabilityScore: 99,
      reliabilityBand: "Exemplary Reliability",
      totalCases: 3,
      resolvedCases: 3,
      disputedCases: 0
    },
    complaintText: "Our annual enterprise subscription renewed yesterday on card ending in 8812. We were charged $2,400.00 at 04:00 UTC and another $2,400.00 at 04:02 UTC for the exact same seat license. We need the second duplicate charge reversed immediately.",
    category: "Billing & Subscriptions",
    priority: "High",
    status: "Resolved",
    createdAt: "2026-09-29 16:30:00",
    updatedAt: "2026-09-29 17:05:00",
    orderId: "SUB-88192-ANNUAL",
    amount: "$2,400.00",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Subscription Engine" },
      { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Entitlement Allocation" },
      { id: "tech", name: "Technical Agent", status: "completed", progress: 100, role: "Cron Job Concurrency Check" },
      { id: "coordinator", name: "Coordinator", status: "completed", progress: 100, role: "Auto-Reversal Dispatch" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 100,
        task: "Check Stripe invoices and authorization double-dips",
        summary: "Identified two identical charges (ch_99A1 and ch_99A2) for $2,400.00 each within 124 seconds.",
        executionTime: "180ms",
        metrics: [{ label: "Charge 1", value: "ch_99A1 ($2,400)" }, { label: "Charge 2", value: "ch_99A2 ($2,400)" }],
        findings: ["Duplicate charge confirmed on same subscription ID."]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Completed",
        confidenceScore: 100,
        task: "Check seat license allocation",
        summary: "License pool only credited once for 50 seats. Second charge did not grant additional seats.",
        executionTime: "120ms",
        metrics: [{ label: "Allocated Seats", value: "50" }],
        findings: ["Customer only received one term renewal."]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Completed",
        confidenceScore: 99.2,
        task: "Analyze cron scheduler execution logs",
        summary: "Distributed lock `sub_renew_lock_88192` expired prematurely before primary worker finished processing, causing secondary worker to execute renewal duplicate.",
        executionTime: "310ms",
        metrics: [{ label: "Lock TTL", value: "30s (Too Short)" }, { label: "Execution Time", value: "42s" }],
        findings: ["Distributed lock race condition identified in billing worker."]
      },
      coordinator: {
        agentName: "Coordinator",
        version: "v5.0.0",
        status: "Completed",
        confidenceScore: 100,
        task: "Synthesize findings and execute instant void",
        summary: "Auto-resolved: Duplicate charge voided prior to bank settlement.",
        executionTime: "90ms",
        metrics: [{ label: "Auto-Resolved", value: "YES" }],
        findings: ["Refund executed within 4 minutes."]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer noticed duplicate $2,400 line item", time: "16:30:00", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Subscription Billing Duplicate", time: "16:30:02", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Billing & Tech agents deployed", time: "16:30:05", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Dual invoice records retrieved from Stripe API", time: "16:30:15", status: "completed" },
      { step: 5, title: "Investigation Performed", desc: "Verified lock race condition in renewal worker", time: "16:30:30", status: "completed" },
      { step: 6, title: "Contradictions Checked", desc: "Zero contradiction. Claim 100% verified", time: "16:30:40", status: "completed" },
      { step: 7, title: "Root Cause Identified", desc: "Distributed lock TTL timeout triggered duplicate runner", time: "16:30:55", status: "completed" },
      { step: 8, title: "Resolution Generated", desc: "Instant void of charge ch_99A2", time: "16:31:10", status: "completed" },
      { step: 9, title: "Resolved", desc: "Customer notified and funds unlocked", time: "16:32:00", status: "completed" }
    ],
    evidence: [
      {
        id: "ev-401",
        title: "Dual Stripe Transaction Receipts",
        type: "Financial Record",
        source: "Stripe Dashboard",
        timestamp: "2026-09-29 04:00 & 04:02",
        status: "Verified",
        description: "Charge 1: $2,400.00 at 04:00:12 UTC. Charge 2: $2,400.00 at 04:02:16 UTC.",
        payload: { ch_1: "ch_99A1", ch_2: "ch_99A2", delta_sec: 124 }
      }
    ],
    contradiction: null,
    rootCause: {
      headline: "Distributed lock race condition caused duplicate billing cron execution.",
      summary: "The renewal cron job took 42 seconds to complete due to slow external gateway responses. The Redis lock TTL was configured for only 30 seconds, leading a fallback worker to acquire the lock and bill the invoice a second time.",
      chain: [
        { label: "Gateway Log", text: "Stripe processed two charges ch_99A1 and ch_99A2" },
        { label: "Redis Lock", text: "Lock sub_renew_lock expired at 30s while worker was still running" },
        { label: "Root Cause", text: "Second worker launched and submitted duplicate charge" }
      ],
      impact: "Duplicate authorization against client credit facility."
    },
    resolution: {
      actionType: "Instant Void & Lock Config Update",
      status: "Resolved",
      confidenceScore: 100,
      headline: "Duplicate Charge $2,400 Voided Instantly",
      reason: "Clear server-side race condition. Void executed before daily bank settlement batch.",
      customerFacingMessage: "Dear David, we have identified a duplicate charge caused by an automated renewal task timing issue. We have immediately voided the second $2,400.00 transaction (ch_99A2). It will not appear on your credit card statement. Your 50 Enterprise seats are fully active through September 2027.",
      internalActions: [
        { id: "act-1", title: "Executed Stripe API void on ch_99A2", status: "Executed" },
        { id: "act-2", title: "Adjusted Redis distributed lock TTL from 30s to 180s", status: "Executed" }
      ]
    },
    escalation: null
  },
  {
    id: "ARG-1046",
    title: "Wrong item delivered: Received 32GB RAM stick instead of 1TB NVMe SSD",
    customer: {
      name: "Aisha Patel",
      email: "aisha.patel@designstudio.co",
      avatar: "AP",
      tier: "Standard Tier",
      joinedDate: "Aug 2024",
      reliabilityScore: 89,
      reliabilityBand: "Reliable History",
      totalCases: 1,
      resolvedCases: 1,
      disputedCases: 0
    },
    complaintText: "I opened package tracking TRK-88192 expectantly to install my new 1TB NVMe SSD for a design project. Inside the sealed cardboard envelope was a DDR5 32GB Desktop RAM module instead. The packing slip says NVMe SSD, but the barcode on the plastic clam shell is for RAM.",
    category: "Warehouse Picking & Fulfillment",
    priority: "Medium",
    status: "Evidence Required",
    createdAt: "2026-09-30 06:10:00",
    updatedAt: "2026-09-30 09:30:00",
    orderId: "ORD-99120",
    amount: "$129.99",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Price Discrepancy" },
      { id: "order", name: "Order Agent", status: "investigating", progress: 85, role: "Warehouse Bin Verification" },
      { id: "tech", name: "Technical Agent", status: "waiting", progress: 40, role: "Packing Cam Recording" },
      { id: "coordinator", name: "Coordinator", status: "waiting", progress: 20, role: "Return Label Generation" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 98.0,
        task: "Check price differential between ordered item and received item",
        summary: "Ordered: 1TB NVMe SSD ($129.99). Received item: DDR5 32GB RAM ($134.99). Values closely matched.",
        executionTime: "140ms",
        metrics: [{ label: "Ordered Price", value: "$129.99" }, { label: "Received Value", value: "$134.99" }],
        findings: ["No malicious value inflation detected."]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Investigating",
        confidenceScore: 91.2,
        task: "Verify warehouse bin barcode mapping at Memphis Central Fulfillment Hub",
        summary: "Investigating bin adjacent picking errors. Bin B-14 (SSD) is located directly adjacent to Bin B-15 (RAM).",
        executionTime: "390ms",
        metrics: [{ label: "Warehouse Bin", value: "Memphis Hub Bin B-14" }, { label: "Picker ID", value: "PICK-4491" }],
        findings: ["Picker scanning logs show a barcode manual override at 14:12 UTC."]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Waiting",
        confidenceScore: 85.0,
        task: "Retrieve overhead video footage from packing station #04",
        summary: "Awaiting video archive unfreeze request.",
        executionTime: "Pending",
        metrics: [{ label: "Station Cam", value: "CAM-PACK-04" }],
        findings: ["Awaiting customer barcode photo upload for confirmation."]
      },
      coordinator: {
        agentName: "Coordinator",
        version: "v5.0.0",
        status: "Waiting",
        confidenceScore: 88.0,
        task: "Coordinate return exchange",
        summary: "Dynamic evidence protocol triggered: requesting photo of received item barcode.",
        executionTime: "Pending",
        metrics: [{ label: "Protocol", value: "Recommended Evidence Upload" }],
        findings: ["Will auto-dispatch correct SSD upon barcode snapshot verification."]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer received RAM module instead of ordered SSD", time: "06:10:00", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Warehouse Picking Discrepancy", time: "06:10:03", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Order and Tech agents assigned", time: "06:10:08", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Retrieved picker scan logs and warehouse bin coordinates", time: "06:10:30", status: "completed" },
      { step: 5, title: "Dynamic Protocol Triggered", desc: "Customer requested to upload quick snapshot of product barcode", time: "06:11:00", status: "current" },
      { step: 6, title: "Contradictions Checked", desc: "Pending barcode upload", time: "Pending", status: "pending" },
      { step: 7, title: "Root Cause Identified", desc: "Picker bin adjacent crossover", time: "Pending", status: "pending" },
      { step: 8, title: "Resolution Generated", desc: "Instant replacement + prepaid return label", time: "Pending", status: "pending" },
      { step: 9, title: "Human Review", desc: "Not required if barcode matches RAM SKU", time: "Pending", status: "pending" }
    ],
    evidence: [
      {
        id: "ev-501",
        title: "Warehouse Picking Scanner Log",
        type: "Warehouse Log",
        source: "WMS Scan Engine",
        timestamp: "2026-09-29 14:12:10",
        status: "Pending",
        description: "Picker PICK-4491 utilized manual barcode bypass on Bin B-14.",
        payload: { bin: "B-14", action: "BYPASS_SCAN", timestamp: "14:12:10" }
      }
    ],
    contradiction: null,
    rootCause: null,
    resolution: null,
    escalation: null
  },
  {
    id: "ARG-1047",
    title: "Suspicious return package weight discrepancy detected at carrier intake",
    customer: {
      name: "Jordan Lee",
      email: "jordan.lee@apexmail.com",
      avatar: "JL",
      tier: "Standard Tier",
      joinedDate: "Jul 2025",
      reliabilityScore: 68,
      reliabilityBand: "Moderate Review Band",
      totalCases: 4,
      resolvedCases: 2,
      disputedCases: 2
    },
    complaintText: "I returned the Apple MacBook Pro 16-inch ($2,899.00) using your prepaid return label 5 days ago. The tracking shows it arrived at your return center, but I still haven't received my refund.",
    category: "Returns & Asset Verification",
    priority: "Urgent",
    status: "Human Review",
    createdAt: "2026-09-30 05:00:00",
    updatedAt: "2026-09-30 11:10:00",
    orderId: "RET-449102",
    amount: "$2,899.00",
    activeAgents: [
      { id: "billing", name: "Billing Agent", status: "completed", progress: 100, role: "Refund Hold" },
      { id: "order", name: "Order Agent", status: "completed", progress: 100, role: "Inbound Scale Telemetry" },
      { id: "tech", name: "Technical Agent", status: "completed", progress: 100, role: "X-Ray & Scale Audit" },
      { id: "coordinator", name: "Coordinator", status: "completed", progress: 100, role: "Escalation Package Prep" }
    ],
    agentsData: {
      billing: {
        agentName: "Billing Agent",
        version: "v3.4.1",
        status: "Completed",
        confidenceScore: 99.0,
        task: "Hold refund until asset inspection completion",
        summary: "Refund of $2,899.00 safely held under High Value Asset Protection policy.",
        executionTime: "120ms",
        metrics: [{ label: "Held Amount", value: "$2,899.00" }],
        findings: ["High-value policy requires physical scale and serial verification."]
      },
      order: {
        agentName: "Order Agent",
        version: "v2.8.0",
        status: "Completed",
        confidenceScore: 97.4,
        task: "Compare outbound dispatch weight vs inbound return weight",
        summary: "CRITICAL WEIGHT DISCREPANCY: Outbound dispatch weight was 3.24 kg (Laptop + Charger). Inbound return package scale weight is 0.42 kg.",
        executionTime: "240ms",
        metrics: [
          { label: "Outbound Weight", value: "3.24 kg" },
          { label: "Inbound Return Weight", value: "0.42 kg" },
          { label: "Delta Deficit", value: "-2.82 kg (-87%)" }
        ],
        findings: [
          "Package weight missing 87% of expected asset mass.",
          "Inbound box dimensions do not match manufacturer Apple packaging."
        ]
      },
      tech: {
        agentName: "Technical Agent",
        version: "v4.1.2",
        status: "Completed",
        confidenceScore: 99.1,
        task: "Inspect return warehouse intake photo and conveyor scale sensor data",
        summary: "Conveyor photo reveals return box contained 3 promotional magazines and crumpled newspaper with no electronics present.",
        executionTime: "450ms",
        metrics: [{ label: "Return Scanner Scale", value: "Verified Calibrated 0.42kg" }],
        findings: [
          "Security camera footage from intake lane 02 archived.",
          "Tamper evident tape applied in transit."
        ]
      },
      coordinator: {
        agentName: "Coordinator",
        version: "v5.0.0",
        status: "Completed",
        confidenceScore: 98.5,
        task: "Synthesize contradiction and formulate human review escalation",
        summary: "Contradiction established: Customer claims return of 16-inch MacBook Pro, but package delivered weighs 0.42kg containing paper filler. Escalate to Asset Protection for verification before denying refund.",
        executionTime: "180ms",
        metrics: [{ label: "Escalation Status", value: "Asset Protection Active" }],
        findings: [
          "Contradiction identified between customer statement and physical weight telemetry.",
          "Neutral procedure: request carrier transit police investigation and customer serial number proof."
        ]
      }
    },
    timeline: [
      { step: 1, title: "Complaint Received", desc: "Customer queried status of $2,899 MacBook return refund", time: "05:00:00", status: "completed" },
      { step: 2, title: "Case Classified", desc: "Returns & High Value Asset Verification", time: "05:00:02", status: "completed" },
      { step: 3, title: "Agents Assigned", desc: "Billing, Order, Tech & Coordinator mobilized", time: "05:00:05", status: "completed" },
      { step: 4, title: "Evidence Retrieved", desc: "Retrieved automated scale telemetry and intake camera stills", time: "05:00:20", status: "completed" },
      { step: 5, title: "Investigation Performed", desc: "Discovered 87% package weight deficit (-2.82 kg)", time: "05:00:45", status: "completed" },
      { step: 6, title: "Contradiction Detected", desc: "Claimed MacBook Pro vs Inbound parcel weighing only 0.42 kg", time: "05:01:10", status: "completed" },
      { step: 7, title: "Root Cause Identified", desc: "Asset missing from package; potential in-transit theft or wrongful shipment", time: "05:01:30", status: "completed" },
      { step: 8, title: "Resolution Formulated", desc: "Hold refund pending carrier loss investigation", time: "05:01:50", status: "completed" },
      { step: 9, title: "Human Escalation", desc: "Assigned to Asset Protection Senior Specialist", time: "05:02:00", status: "current" }
    ],
    evidence: [
      {
        id: "ev-601",
        title: "Intake Conveyor Belt Scale Telemetry",
        type: "Hardware Sensor Record",
        source: "Louisville Return Sorting Facility (Lane 02)",
        timestamp: "2026-09-30 04:45:12",
        status: "Verified",
        description: "Laser volume scanner: 22x15x6 cm. High precision digital scale reading: 420.5 grams.",
        payload: { weight_grams: 420.5, expected_grams: 3240.0, discrepancy_percent: -87.0 }
      },
      {
        id: "ev-602",
        title: "Inbound Unboxing Camera Still",
        type: "Security Footage",
        source: "Warehouse Inspection High-Def Camera CAM-IN-02",
        timestamp: "2026-09-30 04:46:00",
        status: "Verified",
        description: "Package opened by certified inspector; contents identified as paper packing filler without laptop or electronics.",
        payload: { inspector_id: "INSP-882", contents: "Paper print material", tamper_evident: true }
      }
    ],
    contradiction: {
      headline: "Critical Contradiction: Customer Claim of MacBook Return vs Physical Weight Telemetry",
      disclaimer: "Notice: Contradiction does NOT imply intentional fraud. In-transit theft or accidental box swap is considered during investigation.",
      customerClaim: "Customer states the $2,899 MacBook Pro was packaged and dropped off at carrier kiosk.",
      systemEvidence: "Automated warehouse laser scale recorded package weight of 0.42 kg (outbound unit was 3.24 kg). Unboxing photos confirm absence of laptop.",
      conflictFields: ["Physical Mass", "Package Contents", "Asset Presence"],
      evidenceSources: ["Louisville Facility Conveyor Scale", "Intake CCTV Feed", "UPS Drop-off Receipt Scan"],
      analysis: "The parcel received weighs less than 15% of the genuine hardware. A formal inquiry with carrier security is required to verify if package was tampered with during transit or if customer dropped off wrong parcel.",
      recommendedStep: "Keep refund on hold; request drop-off counter receipt with initial weigh-in from customer, and file courier theft ticket."
    },
    rootCause: {
      headline: "High-value asset missing from return package (87% mass deficit); potential in-transit theft or mispackaging.",
      summary: "Inbound package delivered to return center contained paper material weighing 0.42 kg instead of the 3.24 kg hardware. Root cause remains under investigation between carrier interception and user mispackaging.",
      chain: [
        { label: "Outbound Benchmark", text: "Original MacBook shipped at 3.24 kg" },
        { label: "Return Inbound", text: "Conveyor scale recorded 0.42 kg with paper filler" },
        { label: "Root Cause", text: "Hardware missing from parcel; courier investigation initiated" }
      ],
      impact: "$2,899.00 asset loss exposure; requires human loss prevention sign-off."
    },
    resolution: {
      actionType: "Hold Refund & Escalate to Asset Protection",
      status: "In Human Review",
      confidenceScore: 98.0,
      headline: "Refund Paused Pending Asset Protection Verification",
      reason: "Severe weight discrepancy requires verified counter receipt and carrier loss investigation.",
      customerFacingMessage: "Dear Jordan, your return package was received at our sorting facility; however, our automated intake scale recorded a significant weight discrepancy (package weighed 0.42 kg without the laptop inside). To help us resolve this with our carrier, please provide a clear copy of your carrier drop-off receipt showing the weight recorded at the time of drop-off. We have opened an investigation with the carrier to track the shipment security seal.",
      internalActions: [
        { id: "act-1", title: "Place hold on refund transaction #REF-449102", status: "Executed" },
        { id: "act-2", title: "Open formal carrier theft claim with UPS Security Operations", status: "Executed" },
        { id: "act-3", title: "Assign case file to Asset Protection Senior Investigator", status: "Executed" }
      ]
    },
    escalation: {
      required: true,
      reason: "High-value ($2,899.00) return with critical physical mass deficit (-87%) requiring human asset protection determination.",
      riskLevel: "Critical",
      recommendedAction: "Review carrier initial drop-off scan weight; if drop-off was 0.42kg, initiate customer dispute protocol; if drop-off was 3.24kg, process insurance claim for in-transit theft.",
      assignedSpecialist: "Asset Protection Senior Investigator"
    }
  }
];

export const FAQ_DATA = [
  {
    id: "faq-1",
    category: "Orders & Shipping",
    question: "How many days does standard and express delivery take?",
    shortAnswer: "Standard delivery typically takes 3–5 business days, while Priority Express takes 1–2 business days within the continental US.",
    fullAnswer: "All orders placed before 2:00 PM EST are processed and dispatched on the same business day from our regional fulfillment centers. Standard delivery operates via ground network (3–5 business days). Priority Express delivers within 1–2 business days with guaranteed time-window tracking. International orders typically require 6–10 business days depending on customs clearance.",
    source: "Global Fulfillment SLA Policy v4.2 (Updated Q3 2026)",
    lastUpdated: "2026-08-15",
    helpfulCount: 428,
    relatedQuestions: [
      "Can I change my delivery address after dispatch?",
      "What happens if my package is delayed in transit?",
      "Do you offer Saturday or weekend delivery?"
    ]
  },
  {
    id: "faq-2",
    category: "Payments & Refunds",
    question: "What is your refund policy and how long do refund credits take?",
    shortAnswer: "Approved refunds are processed instantly and credited back to your original payment method within 3–5 banking days.",
    fullAnswer: "Once a return or cancellation is approved by our automated system or support team, the refund transaction is initiated within 60 seconds via our gateway API. Credit and debit cards typically reflect the funds within 3–5 business days depending on your financial institution. PayPal and digital wallet balances update immediately. Enterprise corporate accounts can also opt for instantaneous store credit vouchers.",
    source: "Financial Operations & Refund Protocol Doc #FIN-2026-09",
    lastUpdated: "2026-09-01",
    helpfulCount: 512,
    relatedQuestions: [
      "What payment methods do you accept?",
      "Why is my refund showing as pending at my bank?",
      "How do I request a refund for a damaged item?"
    ]
  },
  {
    id: "faq-3",
    category: "Returns & Exchanges",
    question: "What is your 30-day return policy and how do I print a label?",
    shortAnswer: "We offer a 30-day hassle-free return window with complimentary prepaid shipping labels for all unopened or verified defective items.",
    fullAnswer: "You may return eligible items within 30 calendar days from the date of delivery. Items must be in original condition with included accessories and packaging. To initiate a return, navigate to Orders, select 'Return Item', and our portal will generate an instant digital QR code and printable prepaid shipping label. Drop off at any authorized courier depot.",
    source: "Customer Returns Standard Operating Procedure (SOP #RET-11)",
    lastUpdated: "2026-07-20",
    helpfulCount: 389,
    relatedQuestions: [
      "Are return shipping fees deducted from my refund?",
      "What items are non-returnable?",
      "How do I exchange an item for a different color or size?"
    ]
  },
  {
    id: "faq-4",
    category: "Payments & Refunds",
    question: "What payment methods and corporate billing terms do you accept?",
    shortAnswer: "We accept Visa, Mastercard, American Express, PayPal, Apple Pay, Google Pay, and Net-30 invoicing for Enterprise tiers.",
    fullAnswer: "We support major credit/debit cards (Visa, Mastercard, Amex, Discover) with 3D-Secure authentication. Mobile wallets including Apple Pay and Google Pay are supported at checkout. For Enterprise tier clients with an active credit agreement, Net-30 and Net-60 corporate invoicing is available via automated ACH or Wire transfer through our finance portal.",
    source: "Enterprise Billing & Payment Acceptance Guide",
    lastUpdated: "2026-08-30",
    helpfulCount: 294,
    relatedQuestions: [
      "How do I download a VAT or sales tax invoice?",
      "Can I split a payment between two different credit cards?",
      "How do I update my recurring subscription billing details?"
    ]
  },
  {
    id: "faq-5",
    category: "Account & Security",
    question: "How can I change my password or enable Two-Factor Authentication (2FA)?",
    shortAnswer: "Manage passwords and configure TOTP or hardware security keys in Account Settings > Security.",
    fullAnswer: "To change your password, visit Account Settings > Security > Password. You will be prompted to enter your existing password followed by a secure new password (minimum 12 characters, including numbers and symbols). We strongly recommend enabling Two-Factor Authentication (2FA) via authenticator apps (Google Authenticator, 1Password, Authy) or FIDO2 hardware keys (YubiKey) for maximum protection.",
    source: "Identity, Access & Security Policy (ISO 27001 Compliant)",
    lastUpdated: "2026-09-12",
    helpfulCount: 310,
    relatedQuestions: [
      "What should I do if I am locked out of my 2FA app?",
      "How do I view active login sessions across devices?",
      "How do I delete or anonymize my personal data?"
    ]
  },
  {
    id: "faq-6",
    category: "Orders & Shipping",
    question: "How do I track my shipment in real-time?",
    shortAnswer: "Use the interactive map tracker on your Order Details page or paste your tracking ID into our global tracker.",
    fullAnswer: "Once your order is picked and dispatched, an automated confirmation is dispatched via email and SMS containing your live carrier tracking number (FedEx, UPS, DHL, or FastTrack). Clicking the link opens our integrated telemetry map with vehicle route milestones, current GPS radius, and estimated 2-hour delivery window.",
    source: "Logistics Tracking Infrastructure Guide",
    lastUpdated: "2026-09-18",
    helpfulCount: 440,
    relatedQuestions: [
      "Why hasn't my tracking updated in 24 hours?",
      "Can I provide special delivery instructions for my driver?",
      "What should I do if my package says delivered but isn't there?"
    ]
  }
];

export const PATTERNS_DATA = [
  {
    id: "PAT-001",
    title: "Repeated expired-product complaints associated with Seller: Apex Nutrition LLC",
    dimension: "Seller Compliance",
    severity: "High",
    confidence: "98.4%",
    affectedCasesCount: 14,
    timeRange: "Past 14 Days",
    affectedProducts: ["PureVital Omega-3", "Apex Multi-Vitamin Elite", "KetoCleanse Pro"],
    observation: "Multiple independent enterprise and consumer customers in Pacific Northwest reported receiving supplements with manufacturer expiration dates prior to August 2025. OCR verification confirmed matching batch LOT-2023-06A.",
    consistencyScore: "99.1% Evidence Match",
    recommendedActions: [
      "Execute immediate marketplace inventory freeze on Apex Nutrition LLC",
      "Enforce mandatory photo verification of expiry stamps for all seller intakes",
      "Auto-refund all customers who purchased from lot LOT-2023-06A in the last 30 days"
    ],
    status: "Active Alert",
    relatedCases: ["ARG-1044", "ARG-1021", "ARG-1018", "ARG-1002"]
  },
  {
    id: "PAT-002",
    title: "Carrier Last-Mile Delivery Drop Discrepancy Cluster in ZIP 98101",
    dimension: "Delivery Partner (FastTrack Logistics)",
    severity: "Medium",
    confidence: "91.8%",
    affectedCasesCount: 8,
    timeRange: "Past 7 Days",
    affectedProducts: ["Consumer Electronics", "Computer Hardware"],
    observation: "Spatial telemetry cross-correlation detected 8 separate cases where courier delivery scans occurred with >250m GPS offset from customer registered delivery coordinates, predominantly along Pinehurst Ave / Court cul-de-sacs.",
    consistencyScore: "94.0% Spatial Telemetry Match",
    recommendedActions: [
      "File route audit dispute with FastTrack Logistics Regional Hub",
      "Mandate signature-on-delivery for all shipments over $200 in ZIP 98101",
      "Update customer delivery address geocoding instructions with gate notes"
    ],
    status: "Under Investigation",
    relatedCases: ["ARG-1043", "ARG-1038", "ARG-1029"]
  },
  {
    id: "PAT-003",
    title: "Payment Gateway Webhook 504 Timeout during Pod Rolling Deployments",
    dimension: "System Infrastructure",
    severity: "Critical",
    confidence: "99.0%",
    affectedCasesCount: 23,
    timeRange: "Past 48 Hours",
    affectedProducts: ["All Marketplace Checkout Channels"],
    observation: "Stripe and PayPal webhook captures experienced transient 504 Gateway Timeouts when downstream order-event-bridge pods were cycled during zero-downtime canary rollouts, causing orders to sit in AWAITING_PAYMENT.",
    consistencyScore: "100% Trace Log Correlation",
    recommendedActions: [
      "Increase pod preStop termination grace period from 15s to 60s",
      "Enable automated Kafka DLQ retry consumer with exponential backoff",
      "Deploy dead-letter synthetic health monitor in Datadog"
    ],
    status: "Mitigation Applied",
    relatedCases: ["ARG-1042", "ARG-1039", "ARG-1037", "ARG-1031"]
  },
  {
    id: "PAT-004",
    title: "DDR5 Memory Module Bin Adjacent Picking Error at Memphis Hub",
    dimension: "Warehouse Operations",
    severity: "Low",
    confidence: "88.6%",
    affectedCasesCount: 6,
    timeRange: "Past 10 Days",
    affectedProducts: ["NVMe SSD 1TB (SKU-NX400)", "DDR5 32GB RAM (SKU-NX401)"],
    observation: "Pickers scanning inventory at Bin B-14 (SSD) frequently accessed adjacent Bin B-15 (RAM) under speed picking quota pressure, utilizing barcode bypass scan.",
    consistencyScore: "88.6% Physical Proximity Match",
    recommendedActions: [
      "Re-slot Bin B-15 to separate aisle to eliminate proximity picking mix-ups",
      "Disable manual barcode bypass on pick carts without supervisor badge scan",
      "Deploy automated unboxing exchange flow for affected SKU pairings"
    ],
    status: "Remediation Scheduled",
    relatedCases: ["ARG-1046", "ARG-1025", "ARG-1011"]
  }
];

export const PREVENTION_RECOMMENDATIONS = [
  {
    id: "PREV-101",
    title: "Automate Quarantine Protocol for High-Defect Sellers",
    category: "Seller Governance",
    triggeredBy: "PAT-001 (Expired Products)",
    impact: "Reduces product quality claims by an estimated 84%",
    effort: "Low (Rule Engine Configuration)",
    status: "Recommended",
    description: "Automatically place seller listings in quarantine if 3 or more verified quality contradictions occur within any 7-day rolling window."
  },
  {
    id: "PREV-102",
    title: "Implement Automated Courier GPS Proximity Validation",
    category: "Logistics Optimization",
    triggeredBy: "PAT-002 (Carrier Spatial Drift)",
    impact: "Prevents false delivery confirmations and cuts misdelivery claims by 72%",
    effort: "Medium (Carrier Webhook Telemetry Integration)",
    status: "Approved",
    description: "Reject automated 'DELIVERED' status update if carrier scanner coordinates diverge by more than 150 meters from property geofence; trigger driver re-check."
  },
  {
    id: "PREV-103",
    title: "Resilient Kafka Dead-Letter-Queue Auto-Drainer",
    category: "Platform Reliability",
    triggeredBy: "PAT-003 (Payment Webhook Drops)",
    impact: "Eliminates stuck orders due to deployment restarts (100% automated recovery)",
    effort: "Low (Worker Service Deployed)",
    status: "Deployed",
    description: "Background cron worker monitors DLQ payment-events topic every 60 seconds and auto-replays unhandled charge.captured events."
  },
  {
    id: "PREV-104",
    title: "Dynamic Visual Evidence Protocol for High-Risk Returns",
    category: "Asset Protection",
    triggeredBy: "ARG-1047 (MacBook Weight Deficit)",
    impact: "Blocks fraudulent return package swaps while safeguarding honest customers",
    effort: "Medium (Vision AI Integration)",
    status: "Active in Production",
    description: "Require certified courier drop-off scale receipt upload for items valued above $1,000 prior to refund authorization."
  }
];

export const SYSTEM_KPI_STATS = {
  activeCases: 18,
  casesResolved: 482,
  autoResolvedRate: "86.4%",
  humanEscalations: 12,
  investigationsRunning: 6,
  contradictionsDetected: 9,
  patternsDetected: 4,
  avgInvestigationTime: "4.2m",
  agentConsensusAccuracy: "99.2%"
};
