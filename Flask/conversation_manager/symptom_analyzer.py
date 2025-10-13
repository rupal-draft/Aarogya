import re
from typing import List, Dict, Optional
from .dataclasses import SymptomDetail


class SymptomAnalyzer:
    def __init__(self, data_loader):
        self.severity_patterns = data_loader.load_severity_patterns()
        self.duration_patterns = data_loader.load_duration_patterns()
        self.location_keywords = data_loader.load_location_keywords()
        self.quality_descriptors = data_loader.load_quality_descriptors()

    def extract_comprehensive_symptoms(self, text: str, symptom_keywords: Dict) -> List[SymptomDetail]:
        """Extract symptoms with detailed information"""
        text_lower = text.lower()
        found_symptoms = []

        for symptom_name, keywords in symptom_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    symptom = SymptomDetail(name=symptom_name)
                    symptom.severity = self.extract_severity_from_context(text_lower, keyword)
                    symptom.duration = self.extract_duration_from_context(text_lower, keyword)
                    symptom.location = self.extract_location_from_context(text_lower, keyword)
                    symptom.quality = self.extract_quality_from_context(text_lower, keyword)
                    found_symptoms.append(symptom)
                    break

        return found_symptoms

    def extract_severity_from_context(self, text: str, symptom_keyword: str) -> Optional[int]:
        """Extract severity from context around symptom"""
        keyword_pos = text.find(symptom_keyword)
        if keyword_pos == -1:
            return None

        context_window = 50
        start = max(0, keyword_pos - context_window)
        end = min(len(text), keyword_pos + len(symptom_keyword) + context_window)
        context = text[start:end]

        numbers = re.findall(r'\b([1-9]|10)\b', context)
        if numbers:
            try:
                return int(numbers[0])
            except:
                pass

        for severity, keywords in self.severity_patterns.items():
            for keyword in keywords:
                if keyword in context:
                    if severity == 'mild':
                        return 3
                    elif severity == 'moderate':
                        return 5
                    elif severity == 'severe':
                        return 8

        return None

    def extract_duration_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract duration from context"""
        for duration_type, keywords in self.duration_patterns.items():
            for keyword in keywords:
                if keyword in text:
                    return duration_type
        return None

    def extract_location_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract body location from context"""
        for location, keywords in self.location_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    return location
        return None

    def extract_quality_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract quality descriptors"""
        for quality in self.quality_descriptors:
            if quality in text:
                return quality
        return None