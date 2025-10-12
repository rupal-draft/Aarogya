import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig
import logging
from typing import Optional, Dict, Any
import warnings

from configs.model_config import MedGemmaConfig

logger = logging.getLogger(__name__)


class MedGemmaModel:
    """Google's Med-Gemma model for medical text generation and analysis"""

    def __init__(self, config: MedGemmaConfig):
        self.config = config
        self.model = None
        self.tokenizer = None
        self.is_initialized = False
        self.logger = logging.getLogger(__name__)

    def initialize(self):
        """Initialize the Med-Gemma model"""
        try:
            self.logger.info("🔄 Initializing Med-Gemma model...")

            # Suppress warnings
            warnings.filterwarnings("ignore", category=UserWarning)

            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir,
                trust_remote_code=True
            )

            # Load model
            self.model = AutoModelForCausalLM.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir,
                torch_dtype=getattr(torch, self.config.torch_dtype),
                device_map=self.config.device_map,
                trust_remote_code=True
            )

            # Set up generation config
            self.generation_config = GenerationConfig(
                max_length=self.config.max_length,
                temperature=self.config.temperature,
                top_p=self.config.top_p,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )

            self.is_initialized = True
            self.logger.info("✅ Med-Gemma model initialized successfully!")

        except Exception as e:
            self.logger.error(f"❌ Failed to initialize Med-Gemma model: {e}")
            raise

    def generate_medical_response(self, prompt: str, max_length: Optional[int] = None) -> Dict[str, Any]:
        """Generate medical response using Med-Gemma"""
        if not self.is_initialized:
            raise RuntimeError("Med-Gemma model not initialized")

        try:
            # Format prompt for medical chat
            formatted_prompt = self._format_medical_prompt(prompt)

            # Tokenize input
            inputs = self.tokenizer(
                formatted_prompt,
                return_tensors="pt",
                truncation=True,
                max_length=self.config.max_length
            )

            # Move to model device
            inputs = {k: v.to(self.model.device) for k, v in inputs.items()}

            # Generate response
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    generation_config=self.generation_config,
                    max_new_tokens=max_length or (self.config.max_length - inputs['input_ids'].shape[1])
                )

            # Decode response
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            response = self._clean_response(response, formatted_prompt)

            return {
                "response": response,
                "model": "med-gemma",
                "success": True
            }

        except Exception as e:
            self.logger.error(f"❌ Error generating response with Med-Gemma: {e}")
            return {
                "response": "I apologize, but I'm experiencing technical difficulties. Please try again.",
                "model": "med-gemma",
                "success": False,
                "error": str(e)
            }

    def analyze_symptoms(self, symptoms: str, patient_context: str = "") -> Dict[str, Any]:
        """Analyze symptoms and provide medical insights"""
        prompt = f"""
        As a medical AI assistant, analyze the following symptoms and provide:
        1. Potential conditions that might explain these symptoms
        2. Recommended next steps
        3. When to seek immediate medical attention

        Symptoms: {symptoms}
        {f"Patient Context: {patient_context}" if patient_context else ""}

        Please provide a structured, professional medical analysis:
        """

        return self.generate_medical_response(prompt)

    def interpret_test_results(self, test_type: str, results: str) -> Dict[str, Any]:
        """Interpret medical test results"""
        prompt = f"""
        As a medical AI assistant, interpret the following test results:

        Test Type: {test_type}
        Results: {results}

        Please provide:
        1. Interpretation of the results
        2. Potential implications
        3. Recommended follow-up actions
        4. When to consult a healthcare provider

        Professional medical interpretation:
        """

        return self.generate_medical_response(prompt)

    def _format_medical_prompt(self, prompt: str) -> str:
        """Format prompt for medical conversation"""
        system_message = """You are Med-Gemma, an AI medical assistant. 
        Provide accurate, helpful, and safe medical information.
        Always emphasize the importance of consulting healthcare professionals for personal medical advice.
        Be clear, professional, and empathetic in your responses."""

        return f"System: {system_message}\n\nUser: {prompt}\n\nAssistant:"

    def _clean_response(self, response: str, original_prompt: str) -> str:
        """Clean and extract the generated response"""
        if original_prompt in response:
            response = response.replace(original_prompt, "").strip()

        # Remove any remaining system message fragments
        lines = response.split('\n')
        cleaned_lines = []
        for line in lines:
            if not line.startswith('System:') and not line.startswith('User:'):
                cleaned_lines.append(line)

        return '\n'.join(cleaned_lines).strip()

    def __del__(self):
        """Cleanup model from memory"""
        if hasattr(self, 'model'):
            del self.model
        if hasattr(self, 'tokenizer'):
            del self.tokenizer
        if torch.cuda.is_available():
            torch.cuda.empty_cache()