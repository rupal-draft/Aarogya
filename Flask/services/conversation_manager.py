from typing import Dict, List, Optional, Tuple, Set
from datetime import datetime, timedelta
import re
import json
from dataclasses import dataclass
from enum import Enum

from utils.symptom_keyword import SymptomKeyword


class SeverityLevel(Enum):
    MILD = "mild"
    MODERATE = "moderate"
    SEVERE = "severe"
    CRITICAL = "critical"


class UrgencyLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    EMERGENCY = "emergency"


@dataclass
class SymptomDetail:
    name: str
    severity: Optional[int] = None
    duration: Optional[str] = None
    frequency: Optional[str] = None
    triggers: List[str] = None
    relievers: List[str] = None
    location: Optional[str] = None
    quality: Optional[str] = None

    def __post_init__(self):
        if self.triggers is None:
            self.triggers = []
        if self.relievers is None:
            self.relievers = []


class EnhancedConversationManager:
    def __init__(self, db):
        self.db = db
        self.symptom_keyword_manager = SymptomKeyword()
        self.symptom_keywords = self.symptom_keyword_manager._load_comprehensive_symptom_keywords()
        self.medical_patterns = self._load_medical_patterns()
        self.conversation_flow = self._define_enhanced_conversation_flow()
        self.completion_keywords = self._load_completion_keywords()
        self.emergency_keywords = self._load_emergency_keywords()
        self.severity_patterns = self._load_severity_patterns()
        self.duration_patterns = self._load_duration_patterns()
        self.frequency_patterns = self._load_frequency_patterns()
        self.location_keywords = self._load_location_keywords()
        self.quality_descriptors = self._load_quality_descriptors()
        self.trigger_keywords = self._load_trigger_keywords()
        self.relief_keywords = self._load_relief_keywords()



    def _load_medical_patterns(self) -> Dict:
        """Load medical terminology patterns"""
        return {
            'pain_descriptors': [
                'sharp', 'dull', 'aching', 'burning', 'stabbing', 'throbbing',
                'cramping', 'shooting', 'radiating', 'constant', 'intermittent',
                'pulsating', 'gnawing', 'crushing', 'squeezing'
            ],
            'timing_patterns': [
                'morning', 'evening', 'night', 'after eating', 'before eating',
                'during exercise', 'at rest', 'when lying down', 'when standing',
                'intermittent', 'constant', 'comes and goes'
            ],
            'associated_symptoms': [
                'with nausea', 'with vomiting', 'with fever', 'with chills',
                'with sweating', 'with dizziness', 'with weakness'
            ]
        }

    def _load_completion_keywords(self) -> List[str]:
        """Enhanced completion detection"""
        return [
            "no that's all", "nothing else", "that's it", "no more",
            "i'm done", "that's everything", "no other symptoms",
            "no", "nope", "nothing", "done", "finished", "complete",
            "that covers it", "i think that's all", "nothing more",
            "no additional symptoms", "that's all i can think of",
            "ready for diagnosis", "ready for assessment", "proceed",
            "analyze now", "what do you think", "what's wrong with me"
        ]

    def _load_emergency_keywords(self) -> List[str]:
        """Keywords indicating potential emergency"""
        return [
            'chest pain', 'can\'t breathe', 'severe pain', 'bleeding heavily',
            'unconscious', 'seizure', 'stroke', 'heart attack', 'choking',
            'severe allergic reaction', 'anaphylaxis', 'suicide', 'overdose',
            'severe burns', 'broken bone', 'head injury', 'car accident',
            'fall from height', 'severe abdominal pain', 'difficulty breathing',
            'loss of consciousness', 'severe headache', 'sudden weakness',
            'slurred speech', 'confusion', 'high fever', 'dehydration'
        ]

    def _load_severity_patterns(self) -> Dict:
        """Patterns for severity assessment"""
        return {
            'mild': [
                'mild', 'slight', 'minor', 'little bit', 'barely noticeable',
                'tolerable', 'manageable', '1', '2', '3', 'low'
            ],
            'moderate': [
                'moderate', 'medium', 'noticeable', 'bothering me',
                'interfering', '4', '5', '6', 'middle'
            ],
            'severe': [
                'severe', 'bad', 'terrible', 'intense', 'excruciating',
                'unbearable', 'debilitating', '7', '8', '9', '10',
                'worst pain ever', 'can\'t function'
            ]
        }

    def _load_duration_patterns(self) -> Dict:
        """Patterns for duration extraction"""
        return {
            'acute': [
                'just started', 'few minutes', 'hour', 'hours', 'today',
                'this morning', 'this afternoon', 'this evening'
            ],
            'subacute': [
                'yesterday', 'day', 'days', 'couple days', 'few days',
                'this week', 'past week'
            ],
            'chronic': [
                'weeks', 'months', 'years', 'long time', 'chronic',
                'ongoing', 'persistent', 'always', 'forever'
            ]
        }

    def _load_frequency_patterns(self) -> Dict:
        """Patterns for frequency assessment"""
        return {
            'constant': ['constant', 'all the time', 'continuous', 'non-stop'],
            'frequent': ['frequent', 'often', 'many times', 'regularly'],
            'occasional': ['occasional', 'sometimes', 'now and then', 'intermittent'],
            'rare': ['rarely', 'seldom', 'once in a while', 'hardly ever']
        }

    def _load_location_keywords(self) -> Dict:
        """Body location keywords"""
        return {
            'head': ['head', 'skull', 'forehead', 'temple', 'crown'],
            'neck': ['neck', 'throat', 'cervical'],
            'chest': ['chest', 'breast', 'sternum', 'ribs'],
            'abdomen': ['stomach', 'belly', 'abdomen', 'gut'],
            'back': ['back', 'spine', 'lower back', 'upper back'],
            'arms': ['arm', 'shoulder', 'elbow', 'wrist', 'hand'],
            'legs': ['leg', 'thigh', 'knee', 'ankle', 'foot'],
            'pelvis': ['pelvis', 'hip', 'groin']
        }

    def _load_quality_descriptors(self) -> List[str]:
        """Pain and symptom quality descriptors"""
        return [
            'sharp', 'dull', 'aching', 'burning', 'stabbing', 'throbbing',
            'cramping', 'shooting', 'radiating', 'pulsating', 'gnawing',
            'crushing', 'squeezing', 'tight', 'heavy', 'pressure'
        ]

    def _load_trigger_keywords(self) -> List[str]:
        """Common symptom triggers"""
        return [
            'stress', 'exercise', 'eating', 'lying down', 'standing up',
            'cold weather', 'hot weather', 'certain foods', 'alcohol',
            'medication', 'movement', 'coughing', 'sneezing'
        ]

    def _load_relief_keywords(self) -> List[str]:
        """Common symptom relievers"""
        return [
            'rest', 'sleep', 'medication', 'heat', 'cold', 'massage',
            'stretching', 'sitting', 'lying down', 'walking', 'eating'
        ]

    def _define_enhanced_conversation_flow(self) -> Dict:
        """Enhanced conversation flow with detailed steps"""
        return {
            'initial_greeting': {
                'next': 'symptom_collection',
                'questions': [],
                'context': 'greeting'
            },
            'symptom_collection': {
                'next': 'symptom_prioritization',
                'questions': [
                    "What symptoms are you experiencing right now?",
                    "Are you having any pain? If so, where?",
                    "Any fever, chills, or temperature changes?",
                    "How are you feeling overall?",
                    "Any digestive issues like nausea or stomach problems?",
                    "Any breathing difficulties or chest discomfort?",
                    "Any skin changes, rashes, or unusual marks?",
                    "Any changes in your vision, hearing, or other senses?"
                ],
                'context': 'primary_symptoms'
            },
            'symptom_prioritization': {
                'next': 'detailed_assessment',
                'questions': [
                    "Which of these symptoms is bothering you the most?",
                    "What's your main concern today?"
                ],
                'context': 'prioritization'
            },
            'detailed_assessment': {
                'next': 'associated_symptoms',
                'questions': [
                    "Can you describe this [symptom] in more detail?",
                    "How would you rate the severity on a scale of 1-10?",
                    "How long have you been experiencing this?",
                    "Is it constant or does it come and go?",
                    "What does it feel like? (sharp, dull, burning, etc.)",
                    "Where exactly do you feel it?"
                ],
                'context': 'detailed_primary'
            },
            'associated_symptoms': {
                'next': 'triggers_and_relievers',
                'questions': [
                    "Do you notice any other symptoms that happen at the same time?",
                    "Have you noticed any patterns with these symptoms?"
                ],
                'context': 'associated'
            },
            'triggers_and_relievers': {
                'next': 'medical_history',
                'questions': [
                    "Is there anything that makes these symptoms worse?",
                    "Is there anything that makes them better?",
                    "Do they happen at specific times of day?",
                    "Are they related to activities, food, or stress?"
                ],
                'context': 'triggers'
            },
            'medical_history': {
                'next': 'medications_and_treatments',
                'questions': [
                    "Have you had similar symptoms before?",
                    "Do you have any ongoing medical conditions?",
                    "Any recent changes in your health?",
                    "Any family history of similar problems?"
                ],
                'context': 'history'
            },
            'medications_and_treatments': {
                'next': 'lifestyle_factors',
                'questions': [
                    "Are you currently taking any medications?",
                    "Have you tried anything to treat these symptoms?",
                    "Any recent medication changes?",
                    "Any allergies to medications?"
                ],
                'context': 'medications'
            },
            'lifestyle_factors': {
                'next': 'final_assessment',
                'questions': [
                    "Any recent travel or exposure to illness?",
                    "Any recent stress or life changes?",
                    "How has this affected your daily activities?",
                    "Any other concerns or questions?"
                ],
                'context': 'lifestyle'
            },
            'final_assessment': {
                'next': 'prediction',
                'questions': [],
                'context': 'completion'
            }
        }

    def _detect_emergency(self, text: str) -> bool:
        """Detect potential emergency situations"""
        text_lower = text.lower()

        for keyword in self.emergency_keywords:
            if keyword in text_lower:
                return True

        # Pattern-based emergency detection
        emergency_patterns = [
            r'severe.*pain.*chest',
            r'can\'?t.*breathe',
            r'difficulty.*breathing',
            r'chest.*pain.*radiating',
            r'sudden.*severe.*headache',
            r'loss.*consciousness',
            r'severe.*bleeding',
            r'suicide.*thoughts',
            r'overdose',
            r'allergic.*reaction.*severe'
        ]

        for pattern in emergency_patterns:
            if re.search(pattern, text_lower):
                return True

        return False

    def _extract_comprehensive_symptoms(self, text: str) -> List[SymptomDetail]:
        """Extract symptoms with detailed information"""
        text_lower = text.lower()
        found_symptoms = []

        for symptom_name, keywords in self.symptom_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    symptom = SymptomDetail(name=symptom_name)

                    # Extract additional details
                    symptom.severity = self._extract_severity_from_context(text_lower, keyword)
                    symptom.duration = self._extract_duration_from_context(text_lower, keyword)
                    symptom.location = self._extract_location_from_context(text_lower, keyword)
                    symptom.quality = self._extract_quality_from_context(text_lower, keyword)

                    found_symptoms.append(symptom)
                    break

        return found_symptoms

    def _extract_severity_from_context(self, text: str, symptom_keyword: str) -> Optional[int]:
        """Extract severity from context around symptom"""
        # Find the position of the symptom keyword
        keyword_pos = text.find(symptom_keyword)
        if keyword_pos == -1:
            return None

        # Look for severity indicators in surrounding text
        context_window = 50
        start = max(0, keyword_pos - context_window)
        end = min(len(text), keyword_pos + len(symptom_keyword) + context_window)
        context = text[start:end]

        # Check for numeric ratings
        numbers = re.findall(r'\b([1-9]|10)\b', context)
        if numbers:
            try:
                return int(numbers[0])
            except:
                pass

        # Check for severity words
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

    def _extract_duration_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract duration from context"""
        for duration_type, keywords in self.duration_patterns.items():
            for keyword in keywords:
                if keyword in text:
                    return duration_type
        return None

    def _extract_location_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract body location from context"""
        for location, keywords in self.location_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    return location
        return None

    def _extract_quality_from_context(self, text: str, symptom_keyword: str) -> Optional[str]:
        """Extract quality descriptors"""
        for quality in self.quality_descriptors:
            if quality in text:
                return quality
        return None

    def _is_completion_response(self, text: str) -> bool:
        """Enhanced completion detection"""
        text_lower = text.lower().strip()

        # Direct keyword matches
        for keyword in self.completion_keywords:
            if keyword in text_lower:
                return True

        # Pattern-based completion detection
        completion_patterns = [
            r'^no\s*$',
            r'^nope\s*$',
            r'^nothing\s*$',
            r'^that\'?s\s+(it|all|everything)$',
            r'^i\'?m\s+done$',
            r'^finished$',
            r'^ready\s+for\s+(diagnosis|assessment|analysis)$',
            r'^proceed$',
            r'^analyze\s+now$',
            r'^what\s+do\s+you\s+think$'
        ]

        for pattern in completion_patterns:
            if re.match(pattern, text_lower):
                return True

        return False

    def _assess_urgency(self, symptoms: List[SymptomDetail]) -> UrgencyLevel:
        """Assess urgency based on symptoms"""
        if not symptoms:
            return UrgencyLevel.LOW

        # Check for emergency symptoms
        emergency_symptoms = ['chest_pain', 'shortness_of_breath', 'seizures']
        for symptom in symptoms:
            if symptom.name in emergency_symptoms:
                if symptom.severity and symptom.severity >= 7:
                    return UrgencyLevel.EMERGENCY
                else:
                    return UrgencyLevel.HIGH

        # Check severity levels
        max_severity = max([s.severity for s in symptoms if s.severity], default=0)
        if max_severity >= 8:
            return UrgencyLevel.HIGH
        elif max_severity >= 6:
            return UrgencyLevel.MEDIUM
        else:
            return UrgencyLevel.LOW

    def process_message(self, session_id: str, user_message: str) -> Dict:
        """Enhanced message processing with comprehensive analysis"""

        # Get current session
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        # Check for emergency
        is_emergency = self._detect_emergency(user_message)
        if is_emergency:
            return self._handle_emergency_response(session_id, user_message)

        # Add user message to session
        session['messages'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.utcnow(),
            'processed': False
        })

        # Extract comprehensive symptom information
        extracted_symptoms = self._extract_comprehensive_symptoms(user_message)

        # Update collected data with detailed symptoms
        if extracted_symptoms:
            existing_symptoms = session['collected_data'].get('detailed_symptoms', [])

            # Merge with existing symptoms
            for new_symptom in extracted_symptoms:
                existing_found = False
                for existing_symptom in existing_symptoms:
                    if existing_symptom['name'] == new_symptom.name:
                        # Update existing symptom with new information
                        if new_symptom.severity:
                            existing_symptom['severity'] = new_symptom.severity
                        if new_symptom.duration:
                            existing_symptom['duration'] = new_symptom.duration
                        if new_symptom.location:
                            existing_symptom['location'] = new_symptom.location
                        if new_symptom.quality:
                            existing_symptom['quality'] = new_symptom.quality
                        existing_found = True
                        break

                if not existing_found:
                    existing_symptoms.append({
                        'name': new_symptom.name,
                        'severity': new_symptom.severity,
                        'duration': new_symptom.duration,
                        'location': new_symptom.location,
                        'quality': new_symptom.quality,
                        'triggers': new_symptom.triggers,
                        'relievers': new_symptom.relievers
                    })

            session['collected_data']['detailed_symptoms'] = existing_symptoms

            # Update simple symptoms list for backward compatibility
            session['collected_data']['symptoms'] = list(set(
                session['collected_data'].get('symptoms', []) +
                [s.name for s in extracted_symptoms]
            ))

        # Check completion status
        is_completion = self._is_completion_response(user_message)

        # Assess urgency
        detailed_symptoms = [
            SymptomDetail(
                name=s['name'],
                severity=s.get('severity'),
                duration=s.get('duration'),
                location=s.get('location'),
                quality=s.get('quality')
            ) for s in session['collected_data'].get('detailed_symptoms', [])
        ]
        urgency = self._assess_urgency(detailed_symptoms)

        # Generate intelligent response
        current_step = session.get('current_step', 'symptom_collection')
        response = self._generate_intelligent_response(
            session, current_step, user_message, is_completion, urgency
        )

        # Add assistant response
        session['messages'].append({
            'role': 'assistant',
            'content': response['message'],
            'timestamp': datetime.utcnow(),
            'step': current_step,
            'urgency': urgency.value
        })

        # Update session
        session['current_step'] = response.get('next_step', current_step)
        session['urgency_level'] = urgency.value
        session['last_updated'] = datetime.utcnow()

        # Mark user message as processed
        session['messages'][-2]['processed'] = True

        # Save session
        self.db.update_chat_session(session_id, session)

        return response

    def _handle_emergency_response(self, session_id: str, user_message: str) -> Dict:
        """Handle emergency situations"""
        return {
            'message': "🚨 **MEDICAL EMERGENCY DETECTED** 🚨\n\nBased on your symptoms, this may require immediate medical attention. Please:\n\n• **Call emergency services (911/999/112) immediately**\n• **Go to the nearest emergency room**\n• **Don't drive yourself - call an ambulance or have someone drive you**\n\nIf this is not an emergency, please clarify your symptoms and I'll continue with the assessment.",
            'urgency': 'EMERGENCY',
            'next_step': 'emergency_clarification',
            'emergency': True,
            'suggestions': [
                'This is an emergency - calling 911',
                'Not an emergency - continue assessment',
                'I need immediate help',
                'Please continue with questions'
            ]
        }

    def _generate_intelligent_response(self, session: Dict, current_step: str,
                                       user_message: str, is_completion: bool,
                                       urgency: UrgencyLevel) -> Dict:
        """Generate intelligent, context-aware responses"""

        collected_symptoms = session['collected_data'].get('symptoms', [])
        detailed_symptoms = session['collected_data'].get('detailed_symptoms', [])

        # High urgency handling
        if urgency == UrgencyLevel.HIGH:
            return {
                'message': f"⚠️ Based on your symptoms, I recommend seeking medical attention soon. While I continue gathering information, please consider contacting your healthcare provider today.\n\nNow, let me ask a few more questions to better understand your condition...",
                'urgency': urgency.value,
                'next_step': current_step,
                'medical_advice': 'seek_attention_soon'
            }

        # Completion handling with sufficient information
        if is_completion and len(collected_symptoms) >= 2:
            symptom_summary = self._generate_symptom_summary(detailed_symptoms)
            return {
                'message': f"Perfect! I have comprehensive information about your condition:\n\n{symptom_summary}\n\n🔄 **Analyzing your symptoms with advanced AI medical knowledge...**\n\nThis will take just a moment while I cross-reference your symptoms with medical databases and provide you with a detailed assessment.",
                'next_step': 'ready_for_prediction',
                'action': 'trigger_prediction',
                'collected_data': session['collected_data'],
                'urgency': urgency.value
            }

        # Step-specific intelligent responses
        if current_step == 'symptom_collection':
            return self._handle_symptom_collection(session, user_message, is_completion)
        elif current_step == 'symptom_prioritization':
            return self._handle_symptom_prioritization(session, user_message)
        elif current_step == 'detailed_assessment':
            return self._handle_detailed_assessment(session, user_message)
        elif current_step == 'associated_symptoms':
            return self._handle_associated_symptoms(session, user_message)
        elif current_step == 'triggers_and_relievers':
            return self._handle_triggers_relievers(session, user_message)
        elif current_step == 'medical_history':
            return self._handle_medical_history(session, user_message)
        elif current_step == 'medications_and_treatments':
            return self._handle_medications(session, user_message)
        elif current_step == 'lifestyle_factors':
            return self._handle_lifestyle_factors(session, user_message, is_completion)
        else:
            return self._handle_default_response(session, collected_symptoms)

    def _generate_symptom_summary(self, detailed_symptoms: List[Dict]) -> str:
        """Generate a comprehensive symptom summary"""
        if not detailed_symptoms:
            return "No specific symptoms recorded."

        summary_parts = []
        for symptom in detailed_symptoms:
            symptom_desc = f"• **{symptom['name'].replace('_', ' ').title()}**"

            details = []
            if symptom.get('severity'):
                details.append(f"Severity: {symptom['severity']}/10")
            if symptom.get('duration'):
                details.append(f"Duration: {symptom['duration']}")
            if symptom.get('location'):
                details.append(f"Location: {symptom['location']}")
            if symptom.get('quality'):
                details.append(f"Quality: {symptom['quality']}")

            if details:
                symptom_desc += f" ({', '.join(details)})"

            summary_parts.append(symptom_desc)

        return "\n".join(summary_parts)

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
        # Extract the primary symptom from user response
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

        # Look for mentioned symptoms in the message
        for symptom in symptoms:
            symptom_words = symptom.replace('_', ' ').split()
            if any(word in user_message_lower for word in symptom_words):
                return symptom

        # If no specific symptom mentioned, return the first one
        return symptoms[0] if symptoms else 'general_discomfort'

    def _handle_detailed_assessment(self, session: Dict, user_message: str) -> Dict:
        """Handle detailed symptom assessment"""
        primary_symptom = session['collected_data'].get('primary_symptom', 'your main symptom')

        # Extract details from the message
        severity = self._extract_severity_from_context(user_message.lower(), '')
        quality = self._extract_quality_from_context(user_message.lower(), '')
        duration = self._extract_duration_from_context(user_message.lower(), '')

        # Store extracted details
        if 'symptom_details' not in session['collected_data']:
            session['collected_data']['symptom_details'] = {}

        if severity:
            session['collected_data']['symptom_details']['severity'] = severity
        if quality:
            session['collected_data']['symptom_details']['quality'] = quality
        if duration:
            session['collected_data']['symptom_details']['duration'] = duration

        return {
            'message': f"Thank you for those details about your {primary_symptom.replace('_', ' ')}. \n\nNow, do you notice any other symptoms that happen at the same time as this {primary_symptom.replace('_', ' ')}? For example:\n• Does it come with nausea, dizziness, or sweating?\n• Any other body parts affected when this happens?\n• Any changes in your breathing, heart rate, or temperature?",
            'next_step': 'associated_symptoms',
            'suggestions': ['Yes, with nausea', 'Yes, with dizziness', 'Yes, other areas hurt', 'No other symptoms']
        }

    def _handle_associated_symptoms(self, session: Dict, user_message: str) -> Dict:
        """Handle associated symptoms"""
        # Extract any new symptoms mentioned
        new_symptoms = self._extract_comprehensive_symptoms(user_message)
        if new_symptoms:
            existing_symptoms = session['collected_data'].get('symptoms', [])
            for symptom in new_symptoms:
                if symptom.name not in existing_symptoms:
                    existing_symptoms.append(symptom.name)
            session['collected_data']['symptoms'] = existing_symptoms

        primary_symptom = session['collected_data'].get('primary_symptom', 'your symptoms')

        return {
            'message': f"That's helpful information. Now I'd like to understand what might trigger or relieve your {primary_symptom.replace('_', ' ')}.\n\n**What makes it worse?**\n• Physical activity or rest?\n• Certain positions (lying down, standing)?\n• Eating, stress, or time of day?\n• Weather or temperature changes?\n\n**What makes it better?**\n• Rest, medication, heat/cold?\n• Specific positions or activities?",
            'next_step': 'triggers_and_relievers',
            'suggestions': ['Exercise makes it worse', 'Rest helps', 'Stress triggers it', 'Heat/cold helps',
                            'Medication helps']
        }

    def _handle_triggers_relievers(self, session: Dict, user_message: str) -> Dict:
        """Handle triggers and relievers"""
        # Store trigger/reliever information
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
            symptom_summary = self._generate_symptom_summary(
                session['collected_data'].get('detailed_symptoms', [])
            )

            return {
                'message': f"Perfect! I now have a comprehensive picture of your health situation:\n\n**Your Symptoms:**\n{symptom_summary}\n\n**Additional Information Collected:**\n• Medical history and background\n• Current medications and treatments\n• Symptom triggers and relievers\n• Lifestyle factors and recent changes\n\n🔄 **Initiating Advanced Medical Analysis...**\n\nI'm now processing all this information through sophisticated medical algorithms to provide you with:\n• Possible diagnoses ranked by likelihood\n• Recommended next steps\n• When to seek medical care\n• Self-care recommendations\n\nThis comprehensive analysis will be ready in just a moment...",
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

    def _handle_default_response(self, session: Dict, collected_symptoms: List[str]) -> Dict:
        """Handle default/fallback responses"""
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

    def get_comprehensive_summary(self, session_id: str) -> Dict:
        """Get comprehensive conversation and health summary"""
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        collected_data = session['collected_data']
        detailed_symptoms = collected_data.get('detailed_symptoms', [])

        # Calculate conversation metrics
        total_messages = len(session['messages'])
        user_messages = len([m for m in session['messages'] if m['role'] == 'user'])

        # Assess completeness
        completeness_score = self._calculate_completeness_score(collected_data)

        return {
            'session_id': session_id,
            'conversation_metrics': {
                'total_messages': total_messages,
                'user_messages': user_messages,
                'current_step': session.get('current_step'),
                'completeness_score': completeness_score,
                'urgency_level': session.get('urgency_level', 'low')
            },
            'symptom_analysis': {
                'primary_symptom': collected_data.get('primary_symptom'),
                'total_symptoms': len(collected_data.get('symptoms', [])),
                'detailed_symptoms': detailed_symptoms,
                'symptom_summary': self._generate_symptom_summary(detailed_symptoms)
            },
            'medical_context': {
                'symptom_details': collected_data.get('symptom_details', {}),
                'medical_history': collected_data.get('medical_history'),
                'medications': collected_data.get('medications'),
                'triggers_relievers': collected_data.get('triggers_relievers'),
                'lifestyle_factors': collected_data.get('lifestyle_factors')
            },
            'assessment_readiness': {
                'ready_for_prediction': completeness_score >= 0.7,
                'missing_information': self._identify_missing_information(collected_data),
                'recommendation': self._get_next_step_recommendation(collected_data, completeness_score)
            }
        }

    def _calculate_completeness_score(self, collected_data: Dict) -> float:
        """Calculate how complete the symptom collection is"""
        score = 0.0
        max_score = 7.0

        # Basic symptoms (2 points)
        if collected_data.get('symptoms'):
            score += min(2.0, len(collected_data['symptoms']) * 0.5)

        # Primary symptom identified (1 point)
        if collected_data.get('primary_symptom'):
            score += 1.0

        # Symptom details (1 point)
        if collected_data.get('symptom_details'):
            score += 1.0

        # Medical history (1 point)
        if collected_data.get('medical_history'):
            score += 1.0

        # Medications (1 point)
        if collected_data.get('medications'):
            score += 1.0

        # Triggers/relievers (1 point)
        if collected_data.get('triggers_relievers'):
            score += 1.0

        return min(1.0, score / max_score)

    def _identify_missing_information(self, collected_data: Dict) -> List[str]:
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

    def _get_next_step_recommendation(self, collected_data: Dict, completeness_score: float) -> str:
        """Get recommendation for next steps"""
        if completeness_score >= 0.8:
            return "Ready for comprehensive medical analysis"
        elif completeness_score >= 0.6:
            return "Nearly ready - just a few more details needed"
        elif completeness_score >= 0.4:
            return "Good progress - continue with detailed symptom assessment"
        else:
            return "More information needed - focus on basic symptom collection"
