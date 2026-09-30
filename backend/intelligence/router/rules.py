"""
Heuristic rules, domain signals, and keyword patterns for deterministic routing.
"""

import re
from typing import List, Set

# Regex patterns that indicate general, informational FAQ inquiries
FAQ_PATTERNS = [
    r"\bwhat\s+is\s+(the|your)\b.*(policy|process|procedure|fee|cost|terms|rule)",
    r"\bhow\s+(do|can)\s+i\s+(return|refund|exchange|track|cancel|update|change|reset)\b",
    r"\bhow\s+(many\s+days|long)\s+does\s+(delivery|shipping)\s+take\b",
    r"\bwhat\s+(payment\s+methods|cards)\s+do\s+you\s+(accept|support|take)\b",
    r"\bcan\s+i\s+(return|cancel|exchange|refund)\b",
    r"\bwhere\s+can\s+i\s+find\s+(the|your)\b",
    r"\btell\s+me\s+about\s+(the|your)\s+(policy|pricing|guarantee|terms)\b",
    r"\bwhat\s+are\s+the\s+(rules|options|guidelines|steps)\b",
    r"\bdo\s+you\s+(offer|have|support|allow|accept)\b",
]


# Patterns that indicate an active, personal incident rather than general policy
PERSONAL_INCIDENT_PATTERNS = [
    r"\bmy\s+(payment|order|account|card|refund|bill|package|item|delivery)\b",
    r"\bi\s+(haven't|have\s+not|didn't|did\s+not|was|got|am)\b",
    r"\bi\s+was\s+(charged|billed|overcharged)\b",
    r"\b(charged|debited)\s+(me|my)\b",
    r"\bkeeps\s+showing\b",
    r"\b(failed|pending|stuck|lost|broken|missing)\b",
]

# Billing domain keywords and phrases
BILLING_SIGNALS = [
    "payment", "pay", "paid", "charge", "charged", "billing", "bill",
    "invoice", "receipt", "refund", "credit card", "debit card",
    "bank", "transaction", "overcharge", "deducted", "subscription",
    "stripe", "paypal", "checkout"
]

# Order domain keywords and phrases
ORDER_SIGNALS = [
    "order", "delivery", "shipment", "shipping", "shipped", "tracking",
    "package", "courier", "dispatch", "delivered", "arrival", "arrive",
    "item missing", "parcel"
]

# Technical domain keywords and phrases
TECH_SIGNALS = [
    "error", "crash", "crashed", "bug", "glitch", "code 500", "404",
    "exception", "blank screen", "frozen", "cannot click", "not loading",
    "fails to load", "stuck on loading", "timeout", "app keeps",
    "application keeps", "server error", "connection failed"
]


def matches_faq_pattern(text: str) -> bool:
    """Check if text matches general policy or informational question patterns."""
    text_lower = text.lower().strip()
    
    # If the user explicitly talks about a personal failed/pending state, it's not a general FAQ
    for p_pat in PERSONAL_INCIDENT_PATTERNS:
        if re.search(p_pat, text_lower):
            # Exception: e.g. "How do I return my item" can still be an FAQ if asking for steps
            if "my order is" in text_lower or "my payment" in text_lower or "haven't received" in text_lower:
                return False

    for pattern in FAQ_PATTERNS:
        if re.search(pattern, text_lower):
            return True
            
    # Generic question about refund policy or terms
    if "refund policy" in text_lower and not ("my refund" in text_lower or "haven't received" in text_lower):
        return True

    return False


def detect_domain_signals(text: str) -> Set[str]:
    """
    Detect which domain specialists (billing, order, tech) are relevant to the query.
    """
    text_lower = text.lower()
    signals: Set[str] = set()

    for word in BILLING_SIGNALS:
        if re.search(rf"\b{re.escape(word)}\b", text_lower):
            signals.add("billing")
            break

    for word in ORDER_SIGNALS:
        if re.search(rf"\b{re.escape(word)}\b", text_lower):
            signals.add("order")
            break

    for word in TECH_SIGNALS:
        if re.search(rf"\b{re.escape(word)}\b", text_lower):
            signals.add("tech")
            break

    return signals
