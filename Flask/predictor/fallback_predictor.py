from typing import List, Dict

class FallbackPredictor:
    def get_fallback_predictions(self, symptoms: List[str]) -> List[Dict]:
        """Provide fallback predictions when model is unavailable"""
        fallback_predictions = []
        symptom_text = ' '.join(symptoms).lower()

        if any(s in symptom_text for s in ['fever', 'cough', 'headache']):
            fallback_predictions.append({
                'disease': 'Common Cold',
                'confidence': 0.7,
                'risk_level': 'low'
            })

        if any(s in symptom_text for s in ['stomach', 'nausea', 'vomiting']):
            fallback_predictions.append({
                'disease': 'Gastroenteritis',
                'confidence': 0.6,
                'risk_level': 'moderate'
            })

        if any(s in symptom_text for s in ['skin', 'rash', 'itching']):
            fallback_predictions.append({
                'disease': 'Skin Allergy',
                'confidence': 0.5,
                'risk_level': 'low'
            })

        if not fallback_predictions:
            fallback_predictions.append({
                'disease': 'General Malaise',
                'confidence': 0.4,
                'risk_level': 'low'
            })

        return fallback_predictions