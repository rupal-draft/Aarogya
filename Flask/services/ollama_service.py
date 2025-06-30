import datetime

import requests
import json
from typing import Dict, List, Optional


class OllamaService:
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.model = "gemma3:4b"  # You can change this to gemma3:4b when available

    def check_connection(self) -> str:
        """Check if Ollama service is running"""
        try:
            response = requests.get(f"{self.base_url}/api/tags", timeout=5)
            return "connected" if response.status_code == 200 else "disconnected"
        except:
            return "disconnected"

    def get_medical_advice(self, disease: str, symptoms: List[str], patient: Dict, risk_level: str) -> Dict:
        """Get comprehensive medical advice from Ollama"""

        # Create detailed prompt for medical advice
        prompt = self._create_medical_prompt(disease, symptoms, patient, risk_level)

        try:
            # Call Ollama API
            response = self._call_ollama(prompt)

            # Parse and structure the response
            structured_advice = self._parse_medical_response(response, disease, risk_level)
            print(structured_advice)
            return structured_advice

        except Exception as e:
            print(f"Error getting medical advice: {str(e)}")
            # Return fallback advice
            return self._get_fallback_advice(disease, risk_level)

    def _create_medical_prompt(self, disease: str, symptoms: List[str], patient: Dict, risk_level: str) -> str:
        """Create a detailed medical prompt for Ollama"""

        symptoms_text = ", ".join(symptoms)
        age = patient.get('age', 'unknown')
        gender = patient.get('gender', 'unknown')
        medical_history = patient.get('medical_history', [])
        allergies = patient.get('allergies', [])

        prompt = f"""
You are an experienced medical AI assistant. A patient has been diagnosed with a high probability of having {disease}.

Patient Information:
- Age: {age}
- Gender: {gender}
- Current Symptoms: {symptoms_text}
- Medical History: {', '.join(medical_history) if medical_history else 'None reported'}
- Known Allergies: {', '.join(allergies) if allergies else 'None reported'}
- Risk Level: {risk_level}

Please provide comprehensive medical guidance in the following structured format:

**IMMEDIATE PRECAUTIONS:**
[List 4-6 immediate precautions the patient should take]

**DIETARY RECOMMENDATIONS:**
[List 6-8 specific dietary recommendations including foods to eat and avoid]

**LIFESTYLE MODIFICATIONS:**
[List 4-5 lifestyle changes that would help]

**SYMPTOM MONITORING:**
[List warning signs to watch for]

**WHEN TO SEEK MEDICAL CARE:**
[Specific situations when immediate medical attention is needed]

**RECOMMENDED SPECIALIST:**
[Type of doctor/specialist to consult]

**GENERAL TREATMENT APPROACH:**
[Overview of typical treatment methods]

**RECOVERY TIMELINE:**
[Expected recovery time with proper treatment]

Please be specific, practical, and medically accurate. Focus on actionable advice that will genuinely help the patient.
"""
        return prompt

    def _call_ollama(self, prompt: str) -> str:
        """Make API call to Ollama"""

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": 0.3,  # Lower temperature for more consistent medical advice
                "top_p": 0.9,
                "max_tokens": 1000
            }
        }

        response = requests.post(
            f"{self.base_url}/api/generate",
            json=payload,
            timeout=900
        )

        if response.status_code == 200:
            return response.json().get('response', '')
        else:
            raise Exception(f"Ollama API error: {response.status_code}")

    def _parse_medical_response(self, response: str, disease: str, risk_level: str) -> Dict:
        """Parse Ollama response into structured format"""

        # Initialize structured response
        structured = {
            'disease': disease,
            'risk_level': risk_level,
            'precautions': [],
            'diet_recommendations': [],
            'lifestyle_modifications': [],
            'symptom_monitoring': [],
            'when_to_seek_care': [],
            'recommended_specialist': '',
            'treatment_approach': '',
            'recovery_timeline': '',
            'raw_response': response
        }

        try:
            # Parse sections using keywords
            sections = {
                'IMMEDIATE PRECAUTIONS:': 'precautions',
                'DIETARY RECOMMENDATIONS:': 'diet_recommendations',
                'LIFESTYLE MODIFICATIONS:': 'lifestyle_modifications',
                'SYMPTOM MONITORING:': 'symptom_monitoring',
                'WHEN TO SEEK MEDICAL CARE:': 'when_to_seek_care',
                'RECOMMENDED SPECIALIST:': 'recommended_specialist',
                'GENERAL TREATMENT APPROACH:': 'treatment_approach',
                'RECOVERY TIMELINE:': 'recovery_timeline'
            }

            current_section = None
            lines = response.split('\n')

            for line in lines:
                line = line.strip()
                if not line:
                    continue

                # Check if this line starts a new section
                for section_header, section_key in sections.items():
                    if section_header in line.upper():
                        current_section = section_key
                        break

                # Add content to current section
                if current_section and line and not any(header in line.upper() for header in sections.keys()):
                    if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                        line = line[1:].strip()

                    if current_section in ['precautions', 'diet_recommendations', 'lifestyle_modifications',
                                           'symptom_monitoring', 'when_to_seek_care']:
                        if line:
                            structured[current_section].append(line)
                    else:
                        if line:
                            structured[current_section] = line

            # Add risk-based recommendations
            if risk_level == 'high':
                structured['urgent_message'] = "⚠️ HIGH RISK: Seek immediate medical attention"
                structured['doctor_urgency'] = "immediate"
            elif risk_level == 'moderate':
                structured['urgent_message'] = "⚡ MODERATE RISK: Consult a doctor within 24-48 hours"
                structured['doctor_urgency'] = "within_48_hours"
            else:
                structured['urgent_message'] = "✅ LOW RISK: Monitor symptoms and consult doctor if they worsen"
                structured['doctor_urgency'] = "if_symptoms_worsen"

            return structured

        except Exception as e:
            print(f"Error parsing medical response: {str(e)}")
            return self._get_fallback_advice(disease, risk_level)

    def _get_fallback_advice(self, disease: str, risk_level: str) -> Dict:
        """Provide fallback medical advice when Ollama is unavailable"""

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
            'raw_response': 'Fallback advice - Ollama service unavailable'
        }

        # Add risk-based messages
        if risk_level == 'high':
            fallback_advice['urgent_message'] = "⚠️ HIGH RISK: Seek immediate medical attention"
            fallback_advice['doctor_urgency'] = "immediate"
        elif risk_level == 'moderate':
            fallback_advice['urgent_message'] = "⚡ MODERATE RISK: Consult a doctor within 24-48 hours"
            fallback_advice['doctor_urgency'] = "within_48_hours"
        else:
            fallback_advice['urgent_message'] = "✅ LOW RISK: Monitor symptoms and consult doctor if they worsen"
            fallback_advice['doctor_urgency'] = "if_symptoms_worsen"

        return fallback_advice

    def get_follow_up_advice(self, consultation_id: str, new_symptoms: List[str]) -> Dict:
        """Get follow-up advice for existing consultation"""

        prompt = f"""
A patient is following up on a previous consultation (ID: {consultation_id}).
They are now experiencing these additional or changed symptoms: {', '.join(new_symptoms)}

Please provide:
1. Assessment of symptom changes
2. Updated recommendations
3. Whether they need immediate medical attention
4. Any changes to their treatment plan

Keep the response concise and focused on the changes.
"""

        try:
            response = self._call_ollama(prompt)
            return {
                'follow_up_advice': response,
                'consultation_id': consultation_id,
                'new_symptoms': new_symptoms,
                'timestamp': datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                'follow_up_advice': 'Unable to generate follow-up advice. Please consult your healthcare provider.',
                'error': str(e)
            }
