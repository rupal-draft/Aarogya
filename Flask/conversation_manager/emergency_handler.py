import re
from typing import List, Dict
from .dataclasses import UrgencyLevel, SymptomDetail


class EmergencyHandler:
    def __init__(self, data_loader):
        self.emergency_keywords = data_loader.load_emergency_keywords()

    def detect_emergency(self, text: str) -> bool:
        """Detect potential emergency situations"""
        text_lower = text.lower()

        for keyword in self.emergency_keywords:
            if keyword in text_lower:
                return True

        emergency_patterns = [
            r'severe.*pain.*chest',
            r'can\'?t.*breathe',
            r'difficulty.*breathing',
            r'chest.*pain.*radiating',
            r'sudden.*severe.*headache',
            r'loss.*consciousness',
            r'severe.*bleeding',
            r'suicide.*thoughts',
            r'overdose',
            r'allergic.*reaction.*severe'
        ]

        for pattern in emergency_patterns:
            if re.search(pattern, text_lower):
                return True

        return False

    def handle_emergency_response(self) -> Dict:
        """Handle emergency situations"""
        return {
            'message': "🚨 **MEDICAL EMERGENCY DETECTED** 🚨\n\nBased on your symptoms, this may require immediate medical attention. Please:\n\n• **Call emergency services (911/999/112) immediately**\n• **Go to the nearest emergency room**\n• **Don't drive yourself - call an ambulance or have someone drive you**\n\nIf this is not an emergency, please clarify your symptoms and I'll continue with the assessment.",
            'urgency': UrgencyLevel.EMERGENCY.value,
            'next_step': 'emergency_clarification',
            'emergency': True,
            'suggestions': [
                'This is an emergency - calling 911',
                'Not an emergency - continue assessment',
                'I need immediate help',
                'Please continue with questions'
            ]
        }

    def assess_urgency(self, symptoms: List[SymptomDetail]) -> UrgencyLevel:
        """Assess urgency based on symptoms"""
        if not symptoms:
            return UrgencyLevel.LOW

        emergency_symptoms = ['chest_pain', 'shortness_of_breath', 'seizures']
        for symptom in symptoms:
            if symptom.name in emergency_symptoms:
                if symptom.severity and symptom.severity >= 7:
                    return UrgencyLevel.EMERGENCY
                else:
                    return UrgencyLevel.HIGH

        max_severity = max([s.severity for s in symptoms if s.severity], default=0)
        if max_severity >= 8:
            return UrgencyLevel.HIGH
        elif max_severity >= 6:
            return UrgencyLevel.MEDIUM
        else:
            return UrgencyLevel.LOW