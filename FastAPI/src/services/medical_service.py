from flask import jsonify

from src import Config
from src.database.database import DatabaseManager
from predictor import MLPredictor
from report import ReportGenerator
from utils.risk_assessor import RiskAssessor


class MedicalService:
    def __init__(self):
        self.db = DatabaseManager()
        self.ml_predictor = MLPredictor()
        self.risk_assessor = RiskAssessor()
        self.generator = ReportGenerator(Config.GEMINI_API_KEY)

    def predict_disease(self, request):
        try:
            user_id = request.user_id
            data = request.get_json()

            symptoms = data.get('symptoms', [])
            session_id = data.get('session_id')

            if not symptoms:
                return jsonify({'error': 'Symptoms required'}), 400

            result = self.trigger_disease_prediction(user_id, session_id, symptoms)
            return jsonify(result), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def trigger_disease_prediction(self,user_id: str, session_id: str, symptoms: list) -> dict:

        patient = {
            'age': 30,  # Default values
            'gender': 'unknown',
            'medical_history': [],
            'allergies': []
        }

        predictions = self.ml_predictor.predict_diseases(symptoms, patient)

        if not predictions:
            return {'error': 'No predictions available'}

        top_prediction = predictions[0]
        disease_name = top_prediction['disease']
        confidence = top_prediction['confidence']
        risk_level = self.risk_assessor.assess_risk(predictions, symptoms, patient)
        doctor_reco = self.risk_assessor.get_doctor_recommendation(risk_level)


        ai_recommendations = self.generator.get_medical_advice(
            disease=disease_name,
            symptoms=symptoms,
            patient=patient,
            risk_level=risk_level
        )

        consultation_data = {
            'user_id': user_id,
            'session_id': session_id,
            'symptoms': symptoms,
            'predicted_diseases': predictions,
            'ai_recommendations': ai_recommendations,
            'risk_assessment': risk_level,
            'doctor_recommendation': doctor_reco,
            'confidence': confidence
        }

        consultation_id = self.db.save_consultation(consultation_data)

        return {
            'consultation_id': consultation_id,
            'predictions': predictions,
            'ai_recommendations': ai_recommendations,
            'risk_assessment': risk_level,
            'doctor_recommendation': doctor_reco,
            'confidence': confidence
        }

    def get_consultation(self, consultation_id, user_id):
        try:

            consultation = self.db.get_consultation_by_id(consultation_id)
            if not consultation or consultation['user_id'] != user_id:
                return jsonify({'error': 'Consultation not found'}), 404

            # Remove MongoDB ObjectId
            consultation.pop('_id', None)

            return jsonify({'consultation': consultation}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

    def get_medical_history(self, user_id, limit):
        try:

            consultations = self.db.get_user_consultations(user_id, limit)

            # Remove MongoDB ObjectIds
            for consultation in consultations:
                consultation.pop('_id', None)

            return jsonify({
                'consultations': consultations,
                'total': len(consultations)
            }), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500