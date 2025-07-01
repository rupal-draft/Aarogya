from typing import Dict, List
from .dataclasses import SymptomDetail, UrgencyLevel


class ResponseHandler:
    def __init__(self, data_loader, flow_manager):
        self.completion_keywords = data_loader.load_completion_keywords()
        self.flow_manager = flow_manager

    def is_completion_response(self, text: str) -> bool:
        """Enhanced completion detection"""
        text_lower = text.lower().strip()

        for keyword in self.completion_keywords:
            if keyword in text_lower:
                return True

        completion_patterns = [
            r'^no\s*$',
            r'^nope\s*$',
            r'^nothing\s*$',
            r'^that\'?s\s+(it|all|everything)$',
            r'^i\'?m\s+done$',
            r'^finished$',
            r'^ready\s+for\s+(diagnosis|assessment|analysis)$',
            r'^proceed$',
            r'^analyze\s+now$',
            r'^what\s+do\s+you\s+think$'
        ]

        for pattern in completion_patterns:
            if re.match(pattern, text_lower):
                return True

        return False

    def generate_symptom_summary(self, detailed_symptoms: List[Dict]) -> str:
        """Generate a comprehensive symptom summary"""
        if not detailed_symptoms:
            return "No specific symptoms recorded."

        summary_parts = []
        for symptom in detailed_symptoms:
            symptom_desc = f"• **{symptom['name'].replace('_', ' ').title()}**"
            details = []

            if symptom.get('severity'):
                details.append(f"Severity: {symptom['severity']}/10")
            if symptom.get('duration'):
                details.append(f"Duration: {symptom['duration']}")
            if symptom.get('location'):
                details.append(f"Location: {symptom['location']}")
            if symptom.get('quality'):
                details.append(f"Quality: {symptom['quality']}")

            if details:
                symptom_desc += f" ({', '.join(details)})"
            summary_parts.append(symptom_desc)

        return "\n".join(summary_parts)

    def generate_intelligent_response(self, session: Dict, current_step: str,
                                      user_message: str, is_completion: bool,
                                      urgency: UrgencyLevel) -> Dict:
        """Generate intelligent, context-aware responses"""
        collected_symptoms = session['collected_data'].get('symptoms', [])
        detailed_symptoms = session['collected_data'].get('detailed_symptoms', [])

        if urgency == UrgencyLevel.HIGH:
            return {
                'message': f"⚠️ Based on your symptoms, I recommend seeking medical attention soon. While I continue gathering information, please consider contacting your healthcare provider today.\n\nNow, let me ask a few more questions to better understand your condition...",
                'urgency': urgency.value,
                'next_step': current_step,
                'medical_advice': 'seek_attention_soon'
            }

        if is_completion and len(collected_symptoms) >= 2:
            symptom_summary = self.generate_symptom_summary(detailed_symptoms)
            return {
                'message': f"Perfect! I have comprehensive information about your condition:\n\n{symptom_summary}\n\n🔄 **Analyzing your symptoms with advanced AI medical knowledge...**\n\nThis will take just a moment while I cross-reference your symptoms with medical databases and provide you with a detailed assessment.",
                'next_step': 'ready_for_prediction',
                'action': 'trigger_prediction',
                'collected_data': session['collected_data'],
                'urgency': urgency.value
            }

        return self.flow_manager.handle_flow_step(current_step, session, user_message, is_completion)