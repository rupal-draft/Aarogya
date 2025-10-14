from typing import Dict, List


class AssessmentTools:
    def calculate_completeness_score(self, collected_data: Dict) -> float:
        """Calculate how complete the symptom collection is"""
        score = 0.0
        max_score = 7.0

        if collected_data.get('symptoms'):
            score += min(2.0, len(collected_data['symptoms']) * 0.5)
        if collected_data.get('primary_symptom'):
            score += 1.0
        if collected_data.get('symptom_details'):
            score += 1.0
        if collected_data.get('medical_history'):
            score += 1.0
        if collected_data.get('medications'):
            score += 1.0
        if collected_data.get('triggers_relievers'):
            score += 1.0

        return min(1.0, score / max_score)

    def identify_missing_information(self, collected_data: Dict) -> List[str]:
        """Identify what information is still missing"""
        missing = []

        if not collected_data.get('symptoms'):
            missing.append('Basic symptom description')
        if not collected_data.get('primary_symptom'):
            missing.append('Primary symptom identification')
        if not collected_data.get('symptom_details'):
            missing.append('Detailed symptom characteristics')
        if not collected_data.get('medical_history'):
            missing.append('Medical history and background')
        if not collected_data.get('medications'):
            missing.append('Current medications and treatments')
        if not collected_data.get('triggers_relievers'):
            missing.append('Symptom triggers and relievers')

        return missing

    def get_next_step_recommendation(self, collected_data: Dict, completeness_score: float) -> str:
        """Get recommendation for next steps"""
        if completeness_score >= 0.8:
            return "Ready for comprehensive medical analysis"
        elif completeness_score >= 0.6:
            return "Nearly ready - just a few more details needed"
        elif completeness_score >= 0.4:
            return "Good progress - continue with detailed symptom assessment"
        else:
            return "More information needed - focus on basic symptom collection"