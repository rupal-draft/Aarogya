"""
API endpoints for Medical Chatbot
"""

from old_code.src.api.chat_endpoints import router
from old_code.src.api.pharmacy_endpoints import app

__all__ = ["router", "app"]