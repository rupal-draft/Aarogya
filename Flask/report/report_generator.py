import datetime
from typing import Dict, List
from .gemini_client import GeminiClient
from utils.prompt_builder import PromptBuilder
from .response_parser import ResponseParser
from .fallback_handler import FallbackHandler


class ReportGenerator:
    def __init__(self, api_key: str):
        self.gemini_client = GeminiClient(api_key)
        self.prompt_builder = PromptBuilder()
        self.response_parser = ResponseParser()
        self.fallback_handler = FallbackHandler()

    def check_connection(self) -> str:
        """Check if Gemini service is available"""
        try:
            response = self.gemini_client.ping()
            return "connected" if response else "disconnected"
        except:
            return "disconnected"

    def get_medical_advice(self, disease: str, symptoms: List[str], patient: Dict, risk_level: str) -> Dict:
        """Get comprehensive medical advice from Gemini"""
        prompt = self.prompt_builder.create_medical_prompt(disease, symptoms, patient, risk_level)

        try:
            response = self.gemini_client.generate_content(prompt)
            structured_advice = self.response_parser.parse_medical_response(response, disease, risk_level)
            return structured_advice
        except Exception as e:
            print(f"Error getting medical advice: {str(e)}")
            return self.fallback_handler.get_fallback_advice(disease, risk_level)

    def get_follow_up_advice(self, consultation_id: str, new_symptoms: List[str]) -> Dict:
        """Get follow-up advice for existing consultation"""
        prompt = self.prompt_builder.create_follow_up_prompt(consultation_id, new_symptoms)

        try:
            response = self.gemini_client.generate_content(prompt)
            return {
                'follow_up_advice': response,
                'consultation_id': consultation_id,
                'new_symptoms': new_symptoms,
                'timestamp': datetime.datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                'follow_up_advice': 'Unable to generate follow-up advice. Please consult your healthcare provider.',
                'error': str(e)
            }