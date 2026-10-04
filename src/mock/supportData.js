/**
 * ARGUS Customer Support & Knowledge Mock Data
 * Structured dataset for FAQ policies, Ask ARGUS demonstration responses,
 * complaint submission categories, and resolution preferences.
 */

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Orders', label: 'Orders' },
  { id: 'Payments', label: 'Payments' },
  { id: 'Returns & Refunds', label: 'Returns & Refunds' },
  { id: 'Delivery', label: 'Delivery' },
  { id: 'Account', label: 'Account' },
  { id: 'Technical Issues', label: 'Technical Issues' }
];

export const SUPPORT_FAQS = [
  {
    id: 'faq-1',
    category: 'Orders',
    question: 'How do I check the live status of my placed order?',
    shortAnswer: 'You can check your order status in real time via My Orders or by entering your Order ID into the ARGUS tracking portal.',
    fullAnswer: 'Once an order is submitted, our Order Management System (OMS) assigns real-time state machine tracking (Processing, Reserved, Dispatched, In-Transit, Delivered). You can view the exact milestone by visiting My Orders or querying Ask ARGUS with your Order ID. For delayed orders exceeding 24 hours in pending state, an autonomous investigation can be mobilized immediately.',
    source: 'Global Fulfillment SLA Policy v4.2 (Updated Q3 2026)',
    lastUpdated: '2026-08-15',
    helpfulCount: 428,
    notHelpfulCount: 14,
    relatedQuestions: [
      'Can I change my delivery address after dispatch?',
      'What happens if my package is delayed in transit?',
      'How do I cancel an order before dispatch?'
    ]
  },
  {
    id: 'faq-2',
    category: 'Payments',
    question: 'Why was I charged twice for the same transaction?',
    shortAnswer: 'Duplicate line items usually represent a temporary authorization hold or a retry webhook race condition.',
    fullAnswer: 'If two identical charges appear on your statement within a few minutes, our payment processor may have registered a temporary pre-authorization hold during network retry. In 99% of cases, the redundant hold drops off within 24 to 48 hours. If both line items finalize into settled debits, please file a Billing dispute through ARGUS so our Billing Agent can audit the Stripe ledger and issue an instant void.',
    source: 'Financial Operations & Refund Protocol Doc #FIN-2026-09',
    lastUpdated: '2026-09-01',
    helpfulCount: 512,
    notHelpfulCount: 9,
    relatedQuestions: [
      'What payment methods do you accept?',
      'Why is my refund showing as pending at my bank?',
      'How do I download a VAT or sales tax invoice?'
    ]
  },
  {
    id: 'faq-3',
    category: 'Returns & Refunds',
    question: 'What is your 30-day return policy and how do I print a return label?',
    shortAnswer: 'We offer a 30-day hassle-free return window with complimentary prepaid shipping labels for all unopened or defective items.',
    fullAnswer: 'You may return eligible items within 30 calendar days from the date of physical delivery. Items must be in original condition with included accessories and packaging. To initiate a return, navigate to Orders, select Return Item, and our portal will generate an instant digital QR code and printable prepaid courier shipping label. High-value returns (> $1,000) are subject to automated intake scale verification.',
    source: 'Customer Returns Standard Operating Procedure (SOP #RET-11)',
    lastUpdated: '2026-07-20',
    helpfulCount: 389,
    notHelpfulCount: 18,
    relatedQuestions: [
      'Are return shipping fees deducted from my refund?',
      'What items are non-returnable?',
      'How long does an approved refund take to appear in my account?'
    ]
  },
  {
    id: 'faq-4',
    category: 'Payments',
    question: 'How long do approved refunds take to reach my bank account?',
    shortAnswer: 'Approved refunds are initiated immediately and typically settle back to your card within 3–5 banking business days.',
    fullAnswer: 'Once a refund is approved by an ARGUS autonomous consensus or specialist review, our gateway API executes the reversal within 60 seconds. Credit and debit cards typically reflect the funds within 3–5 business days depending on your financial institution. Digital wallet balances (PayPal, Apple Pay) update immediately. Enterprise corporate accounts can also opt for instantaneous store credit vouchers.',
    source: 'Gateway Settlement Timeline Specification (FIN-REF-02)',
    lastUpdated: '2026-09-05',
    helpfulCount: 341,
    notHelpfulCount: 8,
    relatedQuestions: [
      'Can I split a refund between two payment methods?',
      'What happens if my original card has expired?',
      'Where can I see the refund confirmation receipt?'
    ]
  },
  {
    id: 'faq-5',
    category: 'Delivery',
    question: 'What should I do if tracking says "Delivered" but I did not receive my parcel?',
    shortAnswer: 'Check surrounding drop locations and porch areas. If missing, ARGUS can cross-verify carrier GPS geofence telemetry.',
    fullAnswer: 'Couriers occasionally mark parcels as delivered upon arrival at the regional depot or drop packages in secure secondary locations (side porch, building reception, parcel locker). If you cannot locate the package within 2 hours of delivery notification, submit a Delivery Dispute in ARGUS. Our Order Agent will automatically pull the carrier scanner GPS coordinates and delivery photo proof to identify misdeliveries.',
    source: 'Carrier Geofence Verification Standard (LOG-409)',
    lastUpdated: '2026-09-12',
    helpfulCount: 476,
    notHelpfulCount: 22,
    relatedQuestions: [
      'How does ARGUS verify courier GPS coordinates?',
      'What is a carrier physical mass discrepancy?',
      'Can I request a signature-required delivery?'
    ]
  },
  {
    id: 'faq-6',
    category: 'Account',
    question: 'How do I reset my password or configure Two-Factor Authentication (2FA)?',
    shortAnswer: 'Manage password security, active sessions, and hardware 2FA keys directly in Account Settings > Security.',
    fullAnswer: 'To update your password, visit Account Settings > Security > Password. We recommend utilizing strong 12+ character passphrases. You can enable Two-Factor Authentication (2FA) via authenticator apps (Google Authenticator, 1Password) or FIDO2 hardware keys (YubiKey). If you lose access to your primary 2FA device, out-of-band recovery challenges can safely restore access.',
    source: 'Identity, Access & Security Policy (ISO 27001 Compliant)',
    lastUpdated: '2026-09-12',
    helpfulCount: 310,
    notHelpfulCount: 6,
    relatedQuestions: [
      'What should I do if I am locked out of my 2FA app?',
      'How do I view active login sessions across devices?',
      'How do I update my corporate billing email?'
    ]
  },
  {
    id: 'faq-7',
    category: 'Technical Issues',
    question: 'What should I do if I encountered a 504 Gateway Timeout during checkout?',
    shortAnswer: 'Do not re-submit checkout immediately. Verify your order history and check whether rewards or card debits occurred.',
    fullAnswer: 'A 504 Gateway Timeout indicates an upstream synchronization pause between the web checkout and backend order allocation worker. If your bank confirms funds were held or loyalty points deducted, but no order number was created, submit a Technical Issue complaint with your transaction timestamp. ARGUS will inspect Kafka Dead Letter Queues and replay the unhandled event automatically.',
    source: 'Ingress Architecture & Microservice SLA Guide',
    lastUpdated: '2026-09-22',
    helpfulCount: 285,
    notHelpfulCount: 11,
    relatedQuestions: [
      'Will I be charged twice if I refresh a timed-out page?',
      'How long does Dead-Letter-Queue event replay take?',
      'How do I clear browser cache to resolve cart sync errors?'
    ]
  },
  {
    id: 'faq-8',
    category: 'Technical Issues',
    question: 'Why does my cart empty or fail to synchronize across devices?',
    shortAnswer: 'Cart state is tied to your active secure session token. Ensure third-party cookie blocking is configured for storage access.',
    fullAnswer: 'Cross-device cart synchronization relies on distributed Redis session tokens. If your browser blocks local storage or runs in strict incognito mode, your session token may fail to persist between device hops. Signing in to your account synchronizes all cart items to your cloud profile automatically.',
    source: 'Web Platform Client Storage Standards v3.1',
    lastUpdated: '2026-08-28',
    helpfulCount: 198,
    notHelpfulCount: 15,
    relatedQuestions: [
      'How do I recover an abandoned checkout cart?',
      'Is my cart preserved if I switch from mobile to desktop?',
      'How do I report a visual bug on the web application?'
    ]
  }
];

export const SUGGESTED_CHAT_PROMPTS = [
  {
    id: 'prompt-1',
    title: 'Where is my order?',
    text: 'Where is my order? I placed it yesterday and need an update on fulfillment.'
  },
  {
    id: 'prompt-2',
    title: 'Payment succeeded but order pending',
    text: 'My payment succeeded but my order is still marked as pending.'
  },
  {
    id: 'prompt-3',
    title: 'I received a damaged product',
    text: 'I received a damaged product in my shipment and need a replacement.'
  },
  {
    id: 'prompt-4',
    title: 'I need help with a refund',
    text: 'I returned an item 5 days ago and need help tracking my refund.'
  }
];

export const COMPLAINT_CATEGORIES = [
  {
    id: 'billing',
    label: 'Billing / Payment',
    description: 'Duplicate charges, missing refunds, unauthorized holds, invoice errors',
    requiresOrderId: true,
    suggestedResolution: 'Full Refund to Original Payment'
  },
  {
    id: 'order_status',
    label: 'Order Status',
    description: 'Order stuck in processing, missing confirmation email, warehouse queue lock',
    requiresOrderId: true,
    suggestedResolution: 'Order Release & Priority Fulfillment'
  },
  {
    id: 'delivery',
    label: 'Delivery Dispute',
    description: 'Package marked delivered but missing, courier spatial drift, damaged box',
    requiresOrderId: true,
    suggestedResolution: 'Immediate Replacement Item Dispatch'
  },
  {
    id: 'return_refund',
    label: 'Return / Refund',
    description: 'Return package received but refund on hold, return label generation issue',
    requiresOrderId: true,
    suggestedResolution: 'Release Held Refund'
  },
  {
    id: 'product_quality',
    label: 'Product Quality',
    description: 'Defective item, expired manufacturer batch, missing components or manuals',
    requiresOrderId: true,
    suggestedResolution: 'Replacement Item or Full Refund'
  },
  {
    id: 'technical',
    label: 'Technical Issue',
    description: '504 Gateway Error, cart synchronization failure, promo code checkout bug',
    requiresOrderId: false,
    suggestedResolution: 'Technical Clearance & Account Voucher'
  },
  {
    id: 'other',
    label: 'Other & Account',
    description: 'Account lock, two-factor authentication recovery, general inquiry',
    requiresOrderId: false,
    suggestedResolution: 'Specialist Review'
  }
];

export const PREFERRED_RESOLUTIONS = [
  'Full Refund to Original Payment Method',
  'Immediate Replacement Item Dispatch',
  'Account Credit / Goodwill Courtesy Voucher',
  'Order Release & Priority Fulfillment',
  'Specialist Review & Human Investigation'
];

/**
 * Deterministic Mock AI Assistant Response Engine
 * Returns contextually relevant simulated guidance with prompt extraction
 * and offers a direct bridge to launch formal complaint investigation.
 */
export function generateMockAssistantResponse(prompt) {
  const p = prompt.toLowerCase();

  // 1. Where is my order?
  if (p.includes('where is my order') || p.includes('order status') || p.includes('tracking') || p.includes('shipped')) {
    return {
      text: `Hello! I can help check the status of your order.\n\nUnder standard fulfillment SLA, orders placed before 2:00 PM EST are processed on the same business day, with tracking numbers activated within 12 hours. If your order shows as pending for more than 24 hours, our automated order routing may have paused it for inventory verification.\n\n**Verifiable Systems Check:**\n- OMS Core State Machine\n- Courier Last-Mile Scan Telemetry\n\nIf your order appears delayed or missing, you can file a formal complaint below and our **Order Agent** will pull courier telemetry in parallel.`,
      category: 'Order Status',
      canInvestigate: true,
      suggestedAction: 'File Order Status Complaint'
    };
  }

  // 2. Payment succeeded but order pending
  if (p.includes('payment') || p.includes('charged') || p.includes('duplicate') || p.includes('double') || p.includes('stripe')) {
    return {
      text: `I understand your concern regarding your payment. When funds are debited from your card or bank account but the order remains in 'Pending' status, this is typically caused by a transient webhook synchronization pause between the payment gateway (e.g., Stripe) and the order allocation service.\n\n**What ARGUS Can Verify:**\n- Payment Gateway Charge Authorization\n- Escrow Settlement Confirmation\n- Kafka Dead-Letter-Queue Message Ingestion\n\nBecause this involves financial transactions, we recommend submitting a formal dispute so our **Billing Agent** can verify the payment hash and autonomously release the order hold.`,
      category: 'Billing / Payment',
      canInvestigate: true,
      suggestedAction: 'File Payment Sync Dispute'
    };
  }

  // 3. Damaged product / quality issue
  if (p.includes('damaged') || p.includes('broken') || p.includes('expired') || p.includes('defect') || p.includes('quality')) {
    return {
      text: `I'm very sorry to hear that you received a damaged or defective item. Under our SafeProduct & Quality Guarantee, you are entitled to an immediate replacement or full refund.\n\n**Next Steps for Rapid Resolution:**\n1. Take a quick photo of the damage, parcel label, or manufacturer batch code.\n2. Submit a Product Quality complaint with the photo attached.\n3. Our **Technical Agent** will run automated computer vision verification to authenticate the defect.\n\nWould you like to start the complaint form now?`,
      category: 'Product Quality',
      canInvestigate: true,
      suggestedAction: 'Submit Damaged Product Claim'
    };
  }

  // 4. Refund / Return
  if (p.includes('refund') || p.includes('return') || p.includes('credit') || p.includes('label')) {
    return {
      text: `Here is the current policy for returns and refunds:\n\n- **Return Window:** 30 calendar days from delivery date.\n- **Processing Speed:** Refunds are initiated within 60 seconds of return scan verification.\n- **Bank Settlement:** 3 to 5 business days for credit cards; instant for digital wallets.\n\nIf you have already returned an item and the refund has not settled, submitting a formal case allows our **Billing** and **Order** agents to cross-verify the inbound package scale weight and tracking proof.`,
      category: 'Return / Refund',
      canInvestigate: true,
      suggestedAction: 'Submit Return / Refund Inquiry'
    };
  }

  // Default response
  return {
    text: `Thank you for contacting ARGUS Support.\n\nI am the **ARGUS Demonstration Support Assistant**. I can provide instant guidance on standard operating policies (Returns, Payments, Fulfillment, Security) or help you formulate a formal case for autonomous multi-agent investigation.\n\nIf you are experiencing an unresolved dispute, you can file a complaint with supporting evidence so specialized agents can audit ledgers and telemetry.`,
    category: 'Other & Account',
    canInvestigate: true,
    suggestedAction: 'Start Complaint Form'
  };
}
