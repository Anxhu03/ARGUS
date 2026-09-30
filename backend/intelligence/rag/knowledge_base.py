"""
Mock Knowledge Base for Development & Testing.

NOTE: This is mock/development data for testing the ARGUS RAG layer.
It does NOT represent official company policy.
"""

from typing import List
from backend.intelligence.models.faq import KnowledgeDocument

DEV_KNOWLEDGE_BASE: List[KnowledgeDocument] = [
    KnowledgeDocument(
        doc_id="KB-DOC-001",
        title="Refund Policy",
        category="billing",
        content=(
            "Customers are eligible for a full refund within 30 days of purchase if the item "
            "is unused and in its original packaging. Once approved, refunds are credited back "
            "to the original payment method within 5 to 7 business days."
        ),
        metadata={"version": "1.0", "approved": True, "environment": "dev"}
    ),
    KnowledgeDocument(
        doc_id="KB-DOC-002",
        title="Return Policy",
        category="order",
        content=(
            "To initiate a return, navigate to your Orders page and select 'Request Return'. "
            "Items must be shipped back within 14 days of receiving your prepaid return shipping label. "
            "Defective items can be exchanged at no additional cost."
        ),
        metadata={"version": "1.0", "approved": True, "environment": "dev"}
    ),
    KnowledgeDocument(
        doc_id="KB-DOC-003",
        title="Delivery Times and Shipping",
        category="order",
        content=(
            "Standard delivery takes 3 to 5 business days within the continental US. "
            "Expedited shipping delivers within 1 to 2 business days. International deliveries "
            "typically arrive within 7 to 14 business days depending on customs clearance."
        ),
        metadata={"version": "1.0", "approved": True, "environment": "dev"}
    ),
    KnowledgeDocument(
        doc_id="KB-DOC-004",
        title="Password Change and Account Security",
        category="account",
        content=(
            "You can change your password by logging into your account, navigating to Settings > Security, "
            "and selecting 'Update Password'. If you forgot your password, use the 'Forgot Password' link "
            "on the sign-in screen to receive a secure password reset link via email."
        ),
        metadata={"version": "1.0", "approved": True, "environment": "dev"}
    ),
    KnowledgeDocument(
        doc_id="KB-DOC-005",
        title="Accepted Payment Methods",
        category="billing",
        content=(
            "We accept major credit and debit cards (Visa, MasterCard, American Express, Discover), "
            "PayPal, Apple Pay, and Google Pay. We do not accept cash on delivery, checks, or cryptocurrency."
        ),
        metadata={"version": "1.0", "approved": True, "environment": "dev"}
    ),
]
