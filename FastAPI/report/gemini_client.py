import google.generativeai as genai
from typing import Optional

class GeminiClient:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = "gemini-pro"  # Using Gemini Pro model

    def ping(self) -> bool:
        """Check if Gemini service is available"""
        try:
            response = genai.list_models()
            return True if response else False
        except:
            return False

    def generate_content(self, prompt: str) -> str:
        """Generate content using Gemini API"""
        model = genai.GenerativeModel(self.model)
        response = model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.3,
                "top_p": 0.9,
                "max_output_tokens": 1000,
            }
        )
        return response.text