from typing import List

class RiskAssessor:
    def assess_risk(self, disease_name: str, confidence: float) -> str:
        """Assess risk level based on disease and confidence"""
        high_risk_diseases = [
            'pneumonia', 'malaria', 'dengue', 'typhoid', 'hepatitis',
            'heart attack', 'stroke', 'meningitis', 'sepsis'
        ]

        moderate_risk_diseases = [
            'diabetes', 'hypertension', 'asthma', 'bronchitis',
            'gastroenteritis', 'migraine', 'arthritis'
        ]

        disease_lower = disease_name.lower()

        # Check for high-risk diseases
        if any(high_risk in disease_lower for high_risk in high_risk_diseases):
            return 'high' if confidence > 0.6 else 'moderate'

        # Check for moderate-risk diseases
        elif any(mod_risk in disease_lower for mod_risk in moderate_risk_diseases):
            return 'moderate' if confidence > 0.7 else 'low'

        # Default risk assessment based on confidence
        elif confidence > 0.8:
            return 'moderate'
        else:
            return 'low'