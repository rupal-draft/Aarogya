from typing import Dict, List, Optional
from datetime import datetime
import re


class ConversationManager:
    def __init__(self, db):
        self.db = db
        self.symptom_keywords = self._load_symptom_keywords()
        self.conversation_flow = self._define_conversation_flow()
        self.completion_keywords = [
            "no that's all", "nothing else", "that's it", "no more",
            "i'm done", "that's everything", "no other symptoms",
            "no", "nope", "nothing", "done", "finished"
        ]

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
            'nodal_skin_eruptions': ['nodal skin eruptions', 'skin eruptions'],
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

    def _is_completion_response(self, text: str) -> bool:
        """Check if user is indicating they're done providing information"""
        text_lower = text.lower().strip()

        # Direct matches
        for keyword in self.completion_keywords:
            if keyword in text_lower:
                return True

        # Pattern matches
        completion_patterns = [
            r"^no\s*$",
            r"^nope\s*$",
            r"^nothing\s*$",
            r"^that'?s\s+(it|all|everything)$",
            r"^i'?m\s+done$",
            r"^finished$"
        ]

        for pattern in completion_patterns:
            if re.match(pattern, text_lower):
                return True

        return False

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

        # Check if user is indicating completion
        is_completion = self._is_completion_response(user_message)

        # Determine next response based on current step
        current_step = session.get('current_step', 'symptom_collection')
        response = self._generate_response(session, current_step, user_message, is_completion)

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

    def _generate_response(self, session: Dict, current_step: str, user_message: str,
                           is_completion: bool = False) -> Dict:
        """Generate appropriate response based on conversation state"""

        collected_symptoms = session['collected_data']['symptoms']

        # If user indicates completion and we have enough symptoms, trigger prediction
        if is_completion and len(collected_symptoms) >= 1:
            return {
                'message': f"Perfect! I have all the information I need. Based on your symptoms ({', '.join(collected_symptoms)}), I'm now analyzing your condition to provide you with a comprehensive medical assessment.\n\n🔄 Analyzing your symptoms with AI...",
                'next_step': 'ready_for_prediction',
                'action': 'trigger_prediction',
                'collected_data': session['collected_data']
            }

        if current_step == 'symptom_collection':
            if len(collected_symptoms) < 2 and not is_completion:
                return {
                    'message': f"I understand you're experiencing {', '.join(collected_symptoms) if collected_symptoms else 'some symptoms'}. To provide you with the most accurate assessment, could you tell me about any other symptoms? For example:\n\n• Any pain or discomfort?\n• Fever or chills?\n• Digestive issues?\n• Breathing problems?\n• Skin changes?\n\nOr simply say 'No, that's all' if you've described everything.",
                    'next_step': 'symptom_collection',
                    'suggestions': ['I have pain', 'I feel feverish', 'I have stomach issues', 'No, that\'s all']
                }
            elif is_completion and len(collected_symptoms) >= 1:
                return {
                    'message': f"Thank you! I have noted your symptoms: {', '.join(collected_symptoms)}. Let me ask a few quick questions to better understand your condition.\n\nHow long have you been experiencing these symptoms?",
                    'next_step': 'symptom_details',
                    'suggestions': ['A few hours', 'Since yesterday', 'For several days', 'More than a week']
                }
            else:
                return {
                    'message': f"Thank you for sharing. I've noted these symptoms: {', '.join(collected_symptoms)}.\n\nNow, let me ask about the details. How long have you been experiencing these symptoms?",
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
                'message': "Thank you. One last question: Have you taken any medications for these symptoms, or is there anything else about your condition you'd like to mention?\n\nYou can also say 'No, that's all' if you're ready for your medical assessment.",
                'next_step': 'medical_context',
                'suggestions': ['No medications taken', 'I took pain relievers', 'I have other concerns',
                                'No, that\'s all']
            }

        elif current_step == 'medical_context':
            # Store additional context
            session['collected_data']['medical_context'] = user_message

            # Check if user wants to proceed or if we have enough info
            if is_completion or len(collected_symptoms) >= 2:
                return {
                    'message': f"Perfect! I have all the information I need. Based on your symptoms ({', '.join(collected_symptoms)}), I'm now going to provide you with a comprehensive medical analysis.\n\n🔄 Processing your symptoms with advanced AI...",
                    'next_step': 'ready_for_prediction',
                    'action': 'trigger_prediction',
                    'collected_data': session['collected_data']
                }
            else:
                return {
                    'message': "Thank you for that information. Is there anything else about your symptoms you'd like to tell me before I provide your medical assessment?",
                    'next_step': 'final_check',
                    'suggestions': ['No, that\'s all', 'I have more symptoms', 'I\'m ready for assessment']
                }

        elif current_step == 'final_check':
            if is_completion or 'ready' in user_message.lower() or 'assessment' in user_message.lower():
                return {
                    'message': f"Excellent! I'm now analyzing your symptoms ({', '.join(collected_symptoms)}) to provide you with detailed medical guidance.\n\n🔄 AI analysis in progress...",
                    'next_step': 'ready_for_prediction',
                    'action': 'trigger_prediction',
                    'collected_data': session['collected_data']
                }
            else:
                # Extract any additional symptoms
                new_symptoms = self._extract_symptoms(user_message)
                if new_symptoms:
                    session['collected_data']['symptoms'].extend(new_symptoms)
                    session['collected_data']['symptoms'] = list(set(session['collected_data']['symptoms']))

                return {
                    'message': f"I've noted that additional information. I now have all your symptoms: {', '.join(session['collected_data']['symptoms'])}.\n\nShall I proceed with your medical assessment?",
                    'next_step': 'final_check',
                    'suggestions': ['Yes, proceed', 'No, that\'s all', 'I\'m ready']
                }

        else:
            # Default response - should trigger prediction if we have symptoms
            if len(collected_symptoms) >= 1:
                return {
                    'message': f"Thank you for all the information. I'm now ready to analyze your symptoms ({', '.join(collected_symptoms)}) and provide you with medical guidance.\n\n🔄 Starting AI analysis...",
                    'next_step': 'ready_for_prediction',
                    'action': 'trigger_prediction',
                    'collected_data': session['collected_data']
                }
            else:
                return {
                    'message': "I'd like to help you with your medical concerns. Could you please describe the symptoms you're experiencing?",
                    'next_step': 'symptom_collection',
                    'suggestions': ['I have pain', 'I feel sick', 'I have a fever', 'I have skin issues']
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
