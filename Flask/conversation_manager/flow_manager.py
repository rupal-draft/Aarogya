from typing import Dict, List


class FlowManager:
    def __init__(self, data_loader):
        self.conversation_flow = data_loader.define_conversation_flow()

    def handle_flow_step(self, current_step: str, session: Dict,
                         user_message: str, is_completion: bool) -> Dict:
        """Handle conversation flow steps"""
        handler_map = {
            'symptom_collection': self._handle_symptom_collection,
            'symptom_prioritization': self._handle_symptom_prioritization,
            'detailed_assessment': self._handle_detailed_assessment,
            'associated_symptoms': self._handle_associated_symptoms,
            'triggers_and_relievers': self._handle_triggers_relievers,
            'medical_history': self._handle_medical_history,
            'medications_and_treatments': self._handle_medications,
            'lifestyle_factors': self._handle_lifestyle_factors
        }

        handler = handler_map.get(current_step, self._handle_default_response)
        return handler(session, user_message, is_completion)

    def _handle_symptom_collection(self, session: Dict, user_message: str, is_completion: bool) -> Dict:
        """Handle symptom collection phase"""
        collected_symptoms = session['collected_data'].get('symptoms', [])

        if len(collected_symptoms) == 0:
            return {
                'message': "I understand you're not feeling well. Let me help you by asking about specific symptoms. Are you experiencing any of the following?\n\n• **Pain** anywhere in your body?\n• **Fever** or feeling hot/cold?\n• **Nausea** or stomach issues?\n• **Fatigue** or unusual tiredness?\n• **Breathing problems** or chest discomfort?\n• **Skin changes** or rashes?\n\nPlease describe what you're feeling, even if it's not listed above.",
                'next_step': 'symptom_collection',
                'suggestions': ['I have pain', 'I feel feverish', 'Stomach problems', 'Very tired', 'Breathing issues',
                                'Skin problems']
            }
        elif len(collected_symptoms) < 3 and not is_completion:
            return {
                'message': f"Thank you for sharing. I've noted: **{', '.join([s.replace('_', ' ') for s in collected_symptoms])}**.\n\nTo provide the most accurate assessment, are you experiencing any other symptoms? For example:\n\n• Any **additional pain** in other areas?\n• **Digestive issues** (nausea, vomiting, diarrhea)?\n• **Neurological symptoms** (dizziness, headache, numbness)?\n• **Respiratory symptoms** (cough, shortness of breath)?\n\nOr say 'That's all' if you've covered everything.",
                'next_step': 'symptom_collection',
                'suggestions': ['More pain elsewhere', 'Digestive issues', 'Dizziness/headache', 'Breathing problems',
                                "That's all"]
            }
        else:
            return {
                'message': f"Excellent! I have a good overview of your symptoms: **{', '.join([s.replace('_', ' ') for s in collected_symptoms])}**.\n\nNow, which of these symptoms is bothering you the most or is your main concern today?",
                'next_step': 'symptom_prioritization',
                'suggestions': [s.replace('_', ' ').title() for s in collected_symptoms[:4]]
            }

    def _handle_symptom_prioritization(self, session: Dict, user_message: str) -> Dict:
        """Handle symptom prioritization"""
        primary_symptom = self._identify_primary_symptom(user_message, session['collected_data']['symptoms'])
        session['collected_data']['primary_symptom'] = primary_symptom

        return {
            'message': f"I understand that **{primary_symptom.replace('_', ' ')}** is your main concern. Let me get more details about this.\n\nCan you describe this {primary_symptom.replace('_', ' ')} in more detail? For example:\n• How severe is it on a scale of 1-10?\n• What does it feel like? (sharp, dull, burning, aching, etc.)\n• Exactly where do you feel it?\n• How long have you had it?",
            'next_step': 'detailed_assessment',
            'suggestions': ['Severe (7-10)', 'Moderate (4-6)', 'Mild (1-3)', 'Sharp pain', 'Dull ache',
                            'Burning sensation']
        }

    def _identify_primary_symptom(self, user_message: str, symptoms: List[str]) -> str:
        """Identify primary symptom from user response"""
        user_message_lower = user_message.lower()
        for symptom in symptoms:
            symptom_words = symptom.replace('_', ' ').split()
            if any(word in user_message_lower for word in symptom_words):
                return symptom
        return symptoms[0] if symptoms else 'general_discomfort'

    def _handle_detailed_assessment(self, session: Dict, user_message: str) -> Dict:
        """Handle detailed symptom assessment"""
        primary_symptom = session['collected_data'].get('primary_symptom', 'your main symptom')
        return {
            'message': f"Thank you for those details about your {primary_symptom.replace('_', ' ')}. \n\nNow, do you notice any other symptoms that happen at the same time as this {primary_symptom.replace('_', ' ')}? For example:\n• Does it come with nausea, dizziness, or sweating?\n• Any other body parts affected when this happens?\n• Any changes in your breathing, heart rate, or temperature?",
            'next_step': 'associated_symptoms',
            'suggestions': ['Yes, with nausea', 'Yes, with dizziness', 'Yes, other areas hurt', 'No other symptoms']
        }

    def _handle_associated_symptoms(self, session: Dict, user_message: str) -> Dict:
        """Handle associated symptoms"""
        primary_symptom = session['collected_data'].get('primary_symptom', 'your symptoms')
        return {
            'message': f"That's helpful information. Now I'd like to understand what might trigger or relieve your {primary_symptom.replace('_', ' ')}.\n\n**What makes it worse?**\n• Physical activity or rest?\n• Certain positions (lying down, standing)?\n• Eating, stress, or time of day?\n• Weather or temperature changes?\n\n**What makes it better?**\n• Rest, medication, heat/cold?\n• Specific positions or activities?",
            'next_step': 'triggers_and_relievers',
            'suggestions': ['Exercise makes it worse', 'Rest helps', 'Stress triggers it', 'Heat/cold helps',
                            'Medication helps']
        }

    def _handle_triggers_relievers(self, session: Dict, user_message: str) -> Dict:
        """Handle triggers and relievers"""
        session['collected_data']['triggers_relievers'] = user_message
        return {
            'message': "That's very useful information for understanding your condition. Now I'd like to know about your medical background.\n\n• Have you experienced similar symptoms before?\n• Do you have any ongoing medical conditions or diagnoses?\n• Any recent changes in your health or new health concerns?\n• Any family history of similar problems?\n\nThis helps me understand if this might be related to something you've dealt with before.",
            'next_step': 'medical_history',
            'suggestions': ['Yes, had this before', 'No, first time', 'Have other conditions', 'Family history exists',
                            'Recent health changes']
        }

    def _handle_medical_history(self, session: Dict, user_message: str) -> Dict:
        """Handle medical history"""
        session['collected_data']['medical_history'] = user_message
        return {
            'message': "Thank you for sharing your medical history. Now let me ask about medications and treatments:\n\n• Are you currently taking any medications (prescription or over-the-counter)?\n• Have you tried anything to treat these current symptoms?\n• Any recent changes to your medications?\n• Do you have any known allergies to medications?\n\nThis information is crucial for understanding potential interactions or treatment options.",
            'next_step': 'medications_and_treatments',
            'suggestions': ['Taking medications', 'No medications', 'Tried pain relievers', 'Have allergies',
                            'Recent med changes']
        }

    def _handle_medications(self, session: Dict, user_message: str) -> Dict:
        """Handle medications and treatments"""
        session['collected_data']['medications'] = user_message
        return {
            'message': "Almost done! Just a few final questions about lifestyle and recent changes:\n\n• Any recent travel or exposure to illness?\n• Significant stress or major life changes recently?\n• How are these symptoms affecting your daily activities?\n• Any other concerns or details you think might be relevant?\n\nAfter this, I'll have everything needed for a comprehensive analysis of your condition.",
            'next_step': 'lifestyle_factors',
            'suggestions': ['Recent travel', 'High stress lately', 'Affecting daily life', 'No other concerns',
                            "That's everything"]
        }

    def _handle_lifestyle_factors(self, session: Dict, user_message: str, is_completion: bool) -> Dict:
        """Handle lifestyle factors and final assessment"""
        session['collected_data']['lifestyle_factors'] = user_message
        collected_symptoms = session['collected_data'].get('symptoms', [])

        if is_completion or len(collected_symptoms) >= 2:
            return {
                'message': "Perfect! I now have a comprehensive picture of your health situation:\n\n**Your Symptoms:**\n{symptom_summary}\n\n**Additional Information Collected:**\n• Medical history and background\n• Current medications and treatments\n• Symptom triggers and relievers\n• Lifestyle factors and recent changes\n\n🔄 **Initiating Advanced Medical Analysis...**\n\nI'm now processing all this information through sophisticated medical algorithms to provide you with:\n• Possible diagnoses ranked by likelihood\n• Recommended next steps\n• When to seek medical care\n• Self-care recommendations\n\nThis comprehensive analysis will be ready in just a moment...",
                'next_step': 'ready_for_prediction',
                'action': 'trigger_prediction',
                'collected_data': session['collected_data'],
                'comprehensive_assessment': True
            }
        else:
            return {
                'message': "Thank you for all that information. Is there anything else about your symptoms or health that you'd like to mention before I provide your medical assessment?",
                'next_step': 'final_check',
                'suggestions': ['No, that\'s all', 'Ready for assessment', 'I have more to add']
            }

    def _handle_default_response(self, session: Dict, user_message: str, is_completion: bool) -> Dict:
        """Handle default/fallback responses"""
        collected_symptoms = session['collected_data'].get('symptoms', [])
        if len(collected_symptoms) >= 1:
            return {
                'message': f"Thank you for all the information about your symptoms: **{', '.join([s.replace('_', ' ') for s in collected_symptoms])}**.\n\n🔄 **Preparing comprehensive medical analysis...**\n\nI'm now ready to analyze your condition using advanced medical knowledge and provide you with detailed insights.",
                'next_step': 'ready_for_prediction',
                'action': 'trigger_prediction',
                'collected_data': session['collected_data']
            }
        else:
            return {
                'message': "I'm here to help you understand your health concerns. Could you please describe the symptoms you're experiencing? Even if they seem minor, every detail helps me provide better guidance.",
                'next_step': 'symptom_collection',
                'suggestions': ['I have pain', 'I feel unwell', 'I have specific symptoms',
                                'I\'m not sure how to describe it']
            }