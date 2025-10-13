from typing import Dict

class FallbackHandler:
    def get_fallback_advice(self, disease: str, risk_level: str) -> Dict:
        """Provide fallback medical advice when Gemini is unavailable"""
        fallback_advice = {
            'disease': disease,
            'risk_level': risk_level,
            'precautions': [
                'Rest and avoid strenuous activities',
                'Stay hydrated by drinking plenty of water',
                'Monitor your symptoms closely',
                'Take medications as prescribed by your doctor'
            ],
            'diet_recommendations': [
                'Eat light, easily digestible foods',
                'Include fresh fruits and vegetables',
                'Avoid spicy and oily foods',
                'Stay well hydrated'
            ],
            'lifestyle_modifications': [
                'Get adequate rest and sleep',
                'Avoid smoking and alcohol',
                'Practice good hygiene',
                'Manage stress levels'
            ],
            'symptom_monitoring': [
                'Monitor temperature regularly',
                'Watch for worsening symptoms',
                'Keep track of symptom changes'
            ],
            'when_to_seek_care': [
                'If symptoms worsen significantly',
                'If new concerning symptoms develop',
                'If you feel severely unwell'
            ],
            'recommended_specialist': 'General Practitioner or relevant specialist',
            'treatment_approach': 'Consult with a healthcare provider for proper diagnosis and treatment',
            'recovery_timeline': 'Varies based on individual case and treatment',
            'raw_response': 'Fallback advice - Gemini service unavailable'
        }

        self._add_risk_based_messages(fallback_advice, risk_level)
        return fallback_advice

    def _add_risk_based_messages(self, fallback_advice: Dict, risk_level: str) -> None:
        """Add risk-based messages to fallback advice"""
        if risk_level == 'high':
            fallback_advice['urgent_message'] = "⚠️ HIGH RISK: Seek immediate medical attention"
            fallback_advice['doctor_urgency'] = "immediate"
        elif risk_level == 'moderate':
            fallback_advice['urgent_message'] = "⚡ MODERATE RISK: Consult a doctor within 24-48 hours"
            fallback_advice['doctor_urgency'] = "within_48_hours"
        else:
            fallback_advice['urgent_message'] = "✅ LOW RISK: Monitor symptoms and consult doctor if they worsen"
            fallback_advice['doctor_urgency'] = "if_symptoms_worsen"