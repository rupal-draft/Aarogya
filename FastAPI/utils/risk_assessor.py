from typing import List, Dict


class RiskAssessor:
    def __init__(self):
        self.high_risk_conditions = [
            'pneumonia', 'malaria', 'dengue', 'typhoid', 'hepatitis',
            'heart attack', 'stroke', 'meningitis', 'sepsis', 'diabetes'
        ]

        self.emergency_symptoms = [
            'chest_pain', 'difficulty_breathing', 'severe_headache',
            'high_fever', 'severe_abdominal_pain', 'loss_of_consciousness'
        ]

    def assess_risk(self, predictions: List[Dict], symptoms: List[str], patient: Dict) -> str:
        """Assess overall risk level"""
        if not predictions:
            return 'low'

        # Get highest confidence prediction
        top_prediction = predictions[0]
        disease = top_prediction['disease'].lower()
        confidence = top_prediction['confidence']

        # Check for emergency symptoms
        if any(emergency in ' '.join(symptoms).lower() for emergency in self.emergency_symptoms):
            return 'high'

        # Check for high-risk diseases
        if any(high_risk in disease for high_risk in self.high_risk_conditions):
            return 'high' if confidence > 0.6 else 'moderate'

        # Age-based risk adjustment
        age = patient.get('age', 0)
        if age > 65 or age < 5:
            if confidence > 0.5:
                return 'moderate'

        # Multiple symptoms increase risk
        if len(symptoms) > 5:
            return 'moderate'

        # Default risk based on confidence
        if confidence > 0.8:
            return 'moderate'
        else:
            return 'low'

    def get_doctor_recommendation(self, risk_level: str) -> str:
        """Get doctor recommendation based on risk"""
        recommendations = {
            'high': 'immediate',
            'moderate': 'within_24_hours',
            'low': 'if_symptoms_persist'
        }
        return recommendations.get(risk_level, 'if_symptoms_persist')
