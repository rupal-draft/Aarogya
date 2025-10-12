"""
API endpoints for Medical Chatbot
"""

from src.api.chat_endpoints import router
from src.api.pharmacy_endpoints import app

__all__ = ["router", "app"]