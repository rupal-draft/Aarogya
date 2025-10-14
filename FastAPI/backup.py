from flask import Flask, request, jsonify
import spacy
from spacy.matcher import PhraseMatcher
import logging
from flask_jwt_extended import JWTManager
from datetime import datetime
import uuid
from functools import wraps
from flask_cors import CORS
import os

from conversation_manager import EnhancedConversationManager
from src.database.database import DatabaseManager
from predictor import MLPredictor
from report import ReportGenerator
from utils.risk_assessor import RiskAssessor
from utils.token_helper import get_user_id_from_token, extract_token_from_request

app = Flask(__name__)

CORS(app, supports_credentials=True)
jwt = JWTManager(app)

db = DatabaseManager()
generator = ReportGenerator(api_key=os.getenv("GEMINI_API_KEY"))
conversation_manager = EnhancedConversationManager(db)
ml_predictor = MLPredictor()
risk_assessor = RiskAssessor()

app.logger.setLevel(logging.INFO)

nlp = spacy.load("en_core_web_sm")


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_request(request)
        user_id = get_user_id_from_token(token)

        if not user_id:
            return jsonify({"error": "Authentication required"}), 401

        request.user_id = user_id
        return f(*args, **kwargs)
    return decorated

# Chat Routes
@app.route('/chat/start', methods=['POST'])
@require_auth
def start_chat():
    """Start a new chat session"""
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
                    'timestamp': datetime.utcnow()
                }
            ],
            'current_step': 'initial_greeting',
            'collected_data': {
                'symptoms': [],
                'symptom_details': {},
                'user_concerns': []
            }
        }

        db.create_chat_session(session_data)

        return jsonify({
            'session_id': session_id,
            'message': session_data['messages'][0]['content'],
            'status': 'started'
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chat/message', methods=['POST'])
@require_auth
def send_message():
    """Send message in chat session"""
    try:
        user_id = request.user_id
        data = request.get_json()

        session_id = data.get('session_id')
        user_message = data.get('message')

        if not session_id or not user_message:
            return jsonify({'error': 'Session ID and message required'}), 400

        # Get chat session
        session = db.get_chat_session(session_id)
        if not session or session['user_id'] != user_id:
            return jsonify({'error': 'Invalid session'}), 404

        # Process message with conversation manager
        response = conversation_manager.process_message(session_id, user_message)

        # Check if we need to trigger prediction
        if response.get('action') == 'trigger_prediction':
            # Automatically trigger disease prediction
            symptoms = response['collected_data']['symptoms']
            prediction_result = trigger_disease_prediction(user_id, session_id, symptoms)

            # Update response with prediction results
            response.update({
                'prediction_triggered': True,
                'consultation_id': prediction_result.get('consultation_id'),
                'predictions': prediction_result.get('predictions'),
                'ai_recommendations': prediction_result.get('ai_recommendations')
            })

        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/chat/history/<session_id>', methods=['GET'])
@require_auth
def get_chat_history(session_id):
    """Get chat session history"""
    try:
        user_id = request.user_id

        session = db.get_chat_session(session_id)
        if not session or session['user_id'] != user_id:
            return jsonify({'error': 'Session not found'}), 404

        return jsonify({
            'session_id': session_id,
            'messages': session['messages'],
            'status': session['status']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Medical Routes
@app.route('/medical/predict', methods=['POST'])
@require_auth
def predict_disease():
    """Predict disease and get AI recommendations"""
    try:
        user_id = request.user_id
        data = request.get_json()

        symptoms = data.get('symptoms', [])
        session_id = data.get('session_id')

        if not symptoms:
            return jsonify({'error': 'Symptoms required'}), 400

        result = trigger_disease_prediction(user_id, session_id, symptoms)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


def trigger_disease_prediction(user_id: str, session_id: str, symptoms: list) -> dict:
    """Internal function to trigger disease prediction"""

    # Create dummy patient info (since we don't have user profiles)
    patient = {
        'age': 30,  # Default values
        'gender': 'unknown',
        'medical_history': [],
        'allergies': []
    }

    # Predict diseases using ML model
    predictions = ml_predictor.predict_diseases(symptoms, patient)

    if not predictions:
        return {'error': 'No predictions available'}

    # Get top prediction
    top_prediction = predictions[0]
    disease_name = top_prediction['disease']
    confidence = top_prediction['confidence']

    # Assess risk
    risk_level = risk_assessor.assess_risk(predictions, symptoms, patient)

    # Get AI recommendations from Ollama
    ai_recommendations = generator.get_medical_advice(
        disease=disease_name,
        symptoms=symptoms,
        patient=patient,
        risk_level=risk_level
    )

    # Save consultation
    consultation_data = {
        'user_id': user_id,
        'session_id': session_id,
        'symptoms': symptoms,
        'predicted_diseases': predictions,
        'ai_recommendations': ai_recommendations,
        'risk_assessment': risk_level,
        'doctor_recommendation': risk_assessor.get_doctor_recommendation(risk_level)
    }

    consultation_id = db.save_consultation(consultation_data)

    return {
        'consultation_id': consultation_id,
        'predictions': predictions,
        'ai_recommendations': ai_recommendations,
        'risk_assessment': risk_level,
        'doctor_recommendation': risk_assessor.get_doctor_recommendation(risk_level)
    }


@app.route('/medical/consultation/<consultation_id>', methods=['GET'])
@require_auth
def get_consultation(consultation_id):
    """Get specific consultation"""
    try:
        user_id = request.user_id

        consultation = db.get_consultation_by_id(consultation_id)
        if not consultation or consultation['user_id'] != user_id:
            return jsonify({'error': 'Consultation not found'}), 404

        # Remove MongoDB ObjectId
        consultation.pop('_id', None)

        return jsonify({'consultation': consultation}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/medical/history', methods=['GET'])
@require_auth
def get_medical_history():
    """Get user's medical consultation history"""
    try:
        user_id = request.user_id
        limit = request.args.get('limit', 10, type=int)

        consultations = db.get_user_consultations(user_id, limit)

        # Remove MongoDB ObjectIds
        for consultation in consultations:
            consultation.pop('_id', None)

        return jsonify({
            'consultations': consultations,
            'total': len(consultations)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Health check
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        # Check database connection
        db_status = "connected" if db.client.admin.command('ping') else "disconnected"

        # Check ML model
        ml_status = "loaded" if ml_predictor.model_loaded else "not_loaded"

        return jsonify({
            'status': 'healthy',
            'database': db_status,
            'ml_model': ml_status,
            'timestamp': datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500

@app.route("/extract-medicines", methods=["POST"])
def extract_medicines():
    data = request.get_json()
    text = data.get("text")
    medicine_list = data.get("medicine_list", [])

    app.logger.info("Received text: %s", text)
    app.logger.info("Medicine list: %s", medicine_list)

    if not text or not isinstance(medicine_list, list):
        app.logger.warning("Invalid input received.")
        return jsonify({"error": "Invalid input"}), 400

    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    patterns = [nlp.make_doc(med) for med in medicine_list]
    matcher.add("DRUG", patterns)

    doc = nlp(text)
    matches = matcher(doc)
    drugs_found = set(doc[start:end].text for _, start, end in matches)

    app.logger.info("Medicines found: %s", drugs_found)

    return jsonify({"medicines_found": list(drugs_found)})

if __name__ == "__main__":
    print("🏥 Starting AI Medical Assistant...")
    print("🔧 Initializing services...")

    if not ml_predictor.load_model():
        print("⚠️  Warning: ML model not loaded")

    print("🚀 Server starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
