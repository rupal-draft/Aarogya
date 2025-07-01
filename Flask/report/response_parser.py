from typing import Dict

class ResponseParser:
    def parse_medical_response(self, response: str, disease: str, risk_level: str) -> Dict:
        """Parse Gemini response into structured format"""
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

                for section_header, section_key in sections.items():
                    if section_header in line.upper():
                        current_section = section_key
                        break

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

            self._add_risk_based_messages(structured, risk_level)
            return structured

        except Exception:
            return structured

    def _add_risk_based_messages(self, structured: Dict, risk_level: str) -> None:
        """Add risk-based messages to the structured response"""
        if risk_level == 'high':
            structured['urgent_message'] = "⚠️ HIGH RISK: Seek immediate medical attention"
            structured['doctor_urgency'] = "immediate"
        elif risk_level == 'moderate':
            structured['urgent_message'] = "⚡ MODERATE RISK: Consult a doctor within 24-48 hours"
            structured['doctor_urgency'] = "within_48_hours"
        else:
            structured['urgent_message'] = "✅ LOW RISK: Monitor symptoms and consult doctor if they worsen"
            structured['doctor_urgency'] = "if_symptoms_worsen"