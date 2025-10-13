from flask import Blueprint, jsonify, request

from src.services.chat_service import ChatService
from src.utils.auth_utils import require_auth

bp = Blueprint('chat', __name__, url_prefix='/chat')
chat_service = ChatService()

@bp.route('/start', methods=['POST'])
@require_auth
def start_chat():
    return chat_service.start_chat(request)

@bp.route('/message', methods=['POST'])
@require_auth
def send_message():
    return chat_service.send_message(request)

@bp.route('/history/<session_id>', methods=['GET'])
@require_auth
def get_chat_history(session_id):
    return chat_service.get_chat_history(session_id, request.user_id)