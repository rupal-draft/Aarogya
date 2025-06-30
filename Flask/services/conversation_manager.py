from typing import Dict, List, Optional
from datetime import datetime
import re


class ConversationManager:
    def __init__(self, db):
        self.db = db
        self.symptom_keywords = self._load_symptom_keywords()
        self.conversation_flow = self._define_conversation_flow()

    def _load_symptom_keywords(self) -> Dict:
        """Load symptom keywords for natural language processing"""
        return {
            'fever': ['fever', 'temperature', 'hot', 'burning up', 'feverish'],
            'headache': ['headache', 'head pain', 'migraine', 'head hurts'],
            'nausea': ['nausea', 'nauseous', 'sick to stomach', 'queasy'],
            'vomiting': ['vomiting', 'throwing up', 'vomit', 'puking'],
            'cough': ['cough', 'coughing', 'hacking'],
            'fatigue': ['tired', 'fatigue', 'exhausted', 'weak', 'drained'],
            'dizziness': ['dizzy', 'lightheaded', 'spinning', 'vertigo'],
            'chest_pain': ['chest pain', 'chest hurts', 'chest pressure'],
            'shortness_of_breath': ['shortness of breath', 'breathless', 'hard to breathe'],
            'abdominal_pain': ['stomach pain', 'belly pain', 'abdominal pain', 'stomach ache'],
            'diarrhea': ['diarrhea', 'loose stools', 'watery stools'],
            'constipation': ['constipation', 'constipated', 'hard to poop'],
            'skin_rash': ['rash', 'skin rash', 'red spots', 'skin irritation'],
            'itching': ['itching', 'itchy', 'scratching'],
            'joint_pain': ['joint pain', 'joints hurt', 'arthritis pain'],
            'muscle_pain': ['muscle pain', 'sore muscles', 'muscle ache'],
            'back_pain': ['back pain', 'backache', 'spine pain'],
            'sore_throat': ['sore throat', 'throat pain', 'throat hurts'],
            'runny_nose': ['runny nose', 'stuffy nose', 'congestion'],
            'sneezing': ['sneezing', 'sneeze'],
            'weight_loss': ['weight loss', 'losing weight', 'lost weight'],
            'weight_gain': ['weight gain', 'gaining weight', 'gained weight'],
            'loss_of_appetite': ['no appetite', 'not hungry', 'loss of appetite'],
            'excessive_hunger': ['very hungry', 'excessive hunger', 'always hungry'],
            'frequent_urination': ['frequent urination', 'urinating often', 'peeing a lot'],
            'difficulty_urinating': ['difficulty urinating', 'hard to pee', 'painful urination'],
            'blurred_vision': ['blurred vision', 'vision problems', 'can\'t see clearly'],
            'hearing_problems': ['hearing problems', 'can\'t hear well', 'ear problems'],
            'memory_problems': ['memory problems', 'forgetful', 'can\'t remember'],
            'mood_changes': ['mood changes', 'depression', 'anxiety', 'irritable'],
            'sleep_problems': ['can\'t sleep', 'insomnia', 'sleep problems'],
            'night_sweats': ['night sweats', 'sweating at night'],
            'chills': ['chills', 'shivering', 'cold'],
            'swelling': ['swelling', 'swollen', 'puffiness'],
            'numbness': ['numbness', 'tingling', 'pins and needles']
        }

    def _define_conversation_flow(self) -> Dict:
        """Define the conversation flow steps"""
        return {
            'initial_greeting': {
                'next': 'symptom_collection',
                'questions': []
            },
            'symptom_collection': {
                'next': 'symptom_details',
                'questions': [
                    "Can you describe your main symptoms?",
                    "Are you experiencing any pain? If so, where?",
                    "Do you have any fever or temperature changes?",
                    "Any digestive issues like nausea, vomiting, or stomach pain?",
                    "Are you experiencing any breathing difficulties?"
                ]
            },
            'symptom_details': {
                'next': 'medical_context',
                'questions': [
                    "How long have you been experiencing these symptoms?",
                    "On a scale of 1-10, how severe would you rate your symptoms?",
                    "Have the symptoms been getting better, worse, or staying the same?",
                    "Is there anything that makes the symptoms better or worse?"
                ]
            },
            'medical_context': {
                'next': 'final_assessment',
                'questions': [
                    "Have you taken any medications for these symptoms?",
                    "Have you traveled recently or been exposed to anyone who was sick?",
                    "Is there anything else about your symptoms you'd like to mention?"
                ]
            },
            'final_assessment': {
                'next': 'prediction',
                'questions': []
            }
        }

    def process_message(self, session_id: str, user_message: str) -> Dict:
        """Process user message and return appropriate response"""

        # Get current session
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        # Add user message to session
        session['messages'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.utcnow()
        })

        # Extract symptoms from message
        extracted_symptoms = self._extract_symptoms(user_message)

        # Update collected data
        if extracted_symptoms:
            session['collected_data']['symptoms'].extend(extracted_symptoms)
            session['collected_data']['symptoms'] = list(
                set(session['collected_data']['symptoms']))  # Remove duplicates

        # Determine next response based on current step
        current_step = session.get('current_step', 'symptom_collection')
        response = self._generate_response(session, current_step, user_message)

        # Add assistant response to session
        session['messages'].append({
            'role': 'assistant',
            'content': response['message'],
            'timestamp': datetime.utcnow()
        })

        # Update session step
        session['current_step'] = response.get('next_step', current_step)

        # Save updated session
        self.db.update_chat_session(session_id, session)

        return response

    def _extract_symptoms(self, text: str) -> List[str]:
        """Extract symptoms from user text using keyword matching"""
        text_lower = text.lower()
        found_symptoms = []

        for symptom, keywords in self.symptom_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found_symptoms.append(symptom)
                    break

        return found_symptoms

    def _generate_response(self, session: Dict, current_step: str, user_message: str) -> Dict:
        """Generate appropriate response based on conversation state"""

        collected_symptoms = session['collected_data']['symptoms']

        if current_step == 'symptom_collection':
            if len(collected_symptoms) < 3:
                return {
                    'message': f"I understand you're experiencing {', '.join(collected_symptoms) if collected_symptoms else 'some symptoms'}. Can you tell me about any other symptoms you might have? For example:\n\n• Any pain or discomfort?\n• Fever or chills?\n• Digestive issues?\n• Breathing problems?\n• Skin changes?",
                    'next_step': 'symptom_collection',
                    'suggestions': ['I have pain', 'I feel feverish', 'I have stomach issues',
                                    'I\'m having trouble breathing']
                }
            else:
                return {
                    'message': f"Thank you for sharing. I've noted these symptoms: {', '.join(collected_symptoms)}.\n\nNow, let me ask about the details of your symptoms. How long have you been experiencing these symptoms?",
                    'next_step': 'symptom_details',
                    'suggestions': ['A few hours', 'Since yesterday', 'For several days', 'More than a week']
                }

        elif current_step == 'symptom_details':
            # Store symptom details
            if 'symptom_details' not in session['collected_data']:
                session['collected_data']['symptom_details'] = {}

            # Simple duration extraction
            duration = self._extract_duration(user_message)
            if duration:
                session['collected_data']['symptom_details']['duration'] = duration

            return {
                'message': "I see. On a scale of 1-10, how would you rate the severity of your symptoms? (1 being very mild, 10 being extremely severe)",
                'next_step': 'severity_assessment',
                'suggestions': ['1-3 (Mild)', '4-6 (Moderate)', '7-8 (Severe)', '9-10 (Extremely severe)']
            }

        elif current_step == 'severity_assessment':
            # Extract severity
            severity = self._extract_severity(user_message)
            if severity:
                session['collected_data']['symptom_details']['severity'] = severity

            return {
                'message': "Thank you. Have you taken any medications for these symptoms, or is there anything else about your condition you'd like to mention?",
                'next_step': 'medical_context',
                'suggestions': ['No medications taken', 'I took pain relievers', 'I have other symptoms',
                                'Nothing else to add']
            }

        elif current_step == 'medical_context':
            # Store additional context
            session['collected_data']['medical_context'] = user_message

            # Check if we have enough information for prediction
            if len(collected_symptoms) >= 2:
                return {
                    'message': f"Thank you for providing all this information. Based on your symptoms ({', '.join(collected_symptoms)}), I'm now going to analyze your condition and provide you with a detailed medical assessment.\n\n🔄 Analyzing your symptoms...",
                    'next_step': 'ready_for_prediction',
                    'action': 'trigger_prediction',
                    'collected_data': session['collected_data']
                }
            else:
                return {
                    'message': "I need a bit more information about your symptoms to provide an accurate assessment. Can you describe any other symptoms you're experiencing?",
                    'next_step': 'symptom_collection'
                }

        else:
            # Default response
            return {
                'message': "I understand. Is there anything else about your symptoms you'd like to tell me?",
                'next_step': current_step,
                'suggestions': ['No, that\'s all', 'I have more symptoms', 'When will I get better?']
            }

    def _extract_duration(self, text: str) -> Optional[str]:
        """Extract duration from text"""
        text_lower = text.lower()

        if any(word in text_lower for word in ['hour', 'hours']):
            return 'hours'
        elif any(word in text_lower for word in ['day', 'days', 'yesterday', 'today']):
            return 'days'
        elif any(word in text_lower for word in ['week', 'weeks']):
            return 'weeks'
        elif any(word in text_lower for word in ['month', 'months']):
            return 'months'

        return None

    def _extract_severity(self, text: str) -> Optional[int]:
        """Extract severity rating from text"""
        # Look for numbers
        numbers = re.findall(r'\d+', text)
        if numbers:
            try:
                severity = int(numbers[0])
                if 1 <= severity <= 10:
                    return severity
            except:
                pass

        # Look for severity words
        text_lower = text.lower()
        if any(word in text_lower for word in ['mild', 'light', 'slight']):
            return 3
        elif any(word in text_lower for word in ['moderate', 'medium']):
            return 5
        elif any(word in text_lower for word in ['severe', 'bad', 'terrible']):
            return 8
        elif any(word in text_lower for word in ['extreme', 'unbearable', 'worst']):
            return 10

        return None

    def get_conversation_summary(self, session_id: str) -> Dict:
        """Get a summary of the conversation"""
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        return {
            'session_id': session_id,
            'symptoms': session['collected_data']['symptoms'],
            'symptom_details': session['collected_data'].get('symptom_details', {}),
            'medical_context': session['collected_data'].get('medical_context', ''),
            'message_count': len(session['messages']),
            'current_step': session['current_step']
        }
