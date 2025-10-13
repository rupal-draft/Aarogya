from typing import Dict, List

class PromptBuilder:
    def create_medical_prompt(self, disease: str, symptoms: List[str], patient: Dict, risk_level: str) -> str:
        """Create a detailed medical prompt for Gemini"""
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

    def create_follow_up_prompt(self, consultation_id: str, new_symptoms: List[str]) -> str:
        """Create follow-up prompt for Gemini"""
        return f"""
A patient is following up on a previous consultation (ID: {consultation_id}).
They are now experiencing these additional or changed symptoms: {', '.join(new_symptoms)}

Please provide:
1. Assessment of symptom changes
2. Updated recommendations
3. Whether they need immediate medical attention
4. Any changes to their treatment plan

Keep the response concise and focused on the changes.
"""