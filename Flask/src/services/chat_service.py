from flask import jsonify
import uuid
from datetime import datetime

from backup import trigger_disease_prediction
from conversation_manager import EnhancedConversationManager
from src.database.database import DatabaseManager


class ChatService:
    def __init__(self):
        self.db = DatabaseManager()
        self.conversation_manager = EnhancedConversationManager(self.db)

    def start_chat(self, request):
        try:
            user_id = request.user_id
            session_id = str(uuid.uuid4())

            # Create chat session
            session_data = {
                'session_id': session_id,
                'user_id': user_id,
                'messages': [
                    {
                        'role': 'assistant',
                        'content': '🏥 Hello! I\'m your AI Medical Assistant. I\'m here to help you understand your symptoms and provide medical guidance.\n\nTo get started, could you please tell me what symptoms you\'re experiencing today?',
                        'timestamp': datetime.utcnow().isoformat()
                    }
                ],
                'current_step': 'initial_greeting',
                'collected_data': {
                    'symptoms': [],
                    'symptom_details': {},
                    'user_concerns': []
                }
            }

            self.db.create_chat_session(session_data)

            return jsonify({
                'session_id': session_id,
                'message': session_data['messages'][0]['content'],
                'status': 'started'
            }), 201

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def send_message(self, request):
        try:
            user_id = request.user_id
            data = request.get_json()

            session_id = data.get('session_id')
            user_message = data.get('message')

            if not session_id or not user_message:
                return jsonify({'error': 'Session ID and message required'}), 400

            session = self.db.get_chat_session(session_id)
            if not session or session['user_id'] != user_id:
                return jsonify({'error': 'Invalid session'}), 404

            response = self.conversation_manager.process_message(session_id, user_message)

            if response.get('action') == 'trigger_prediction':
                symptoms = response['collected_data']['symptoms']
                prediction_result = trigger_disease_prediction(user_id, session_id, symptoms)

                response.update({
                    'prediction_triggered': True,
                    'consultation_id': prediction_result.get('consultation_id'),
                    'predictions': prediction_result.get('predictions'),
                    'ai_recommendations': prediction_result.get('ai_recommendations')
                })

            return jsonify(response), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500


    def get_chat_history(self, session_id, user_id):
        try:

            session = self.db.get_chat_session(session_id)
            if not session or session['user_id'] != user_id:
                return jsonify({'error': 'Session not found'}), 404

            return jsonify({
                'session_id': session_id,
                'messages': session['messages'],
                'status': session['status']
            }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500