class EmergencyDetector:
    """Emergency detection system with triage levels"""

    def __init__(self, medical_databases):
        self.medical_databases = medical_databases

    def check_emergency(self, query):
        """Enhanced emergency detection with triage levels"""
        query_lower = query.lower()

        for level, keywords in self.medical_databases.emergency_keywords.items():
            for keyword in keywords:
                if keyword in query_lower:
                    return True, keyword, level

        return False, None, None

    def generate_emergency_response(self, emergency_type, emergency_level):
        """Generate appropriate emergency response"""
        urgency_messages = {
            'critical': "🚨 CRITICAL EMERGENCY",
            'urgent': "⚠️ URGENT MEDICAL ATTENTION NEEDED",
            'semi-urgent': "🔶 SEMI-URGENT MEDICAL ATTENTION NEEDED"
        }

        return {
            'emergency': True,
            'emergency_type': emergency_type,
            'emergency_level': emergency_level,
            'action': 'SEEK IMMEDIATE MEDICAL ATTENTION',
            'message': f'{urgency_messages[emergency_level]}: {emergency_type.upper()}\n'
                       f'Please call emergency services (911) or go to the nearest emergency room immediately!\n'
                       f'Do not delay seeking medical care for these symptoms.'
        }