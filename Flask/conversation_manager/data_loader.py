from typing import Dict, List


class DataLoader:
    @staticmethod
    def load_medical_patterns() -> Dict:
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

    @staticmethod
    def load_completion_keywords() -> List[str]:
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

    @staticmethod
    def load_emergency_keywords() -> List[str]:
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

    @staticmethod
    def load_severity_patterns() -> Dict:
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

    @staticmethod
    def load_duration_patterns() -> Dict:
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

    @staticmethod
    def load_frequency_patterns() -> Dict:
        """Patterns for frequency assessment"""
        return {
            'constant': ['constant', 'all the time', 'continuous', 'non-stop'],
            'frequent': ['frequent', 'often', 'many times', 'regularly'],
            'occasional': ['occasional', 'sometimes', 'now and then', 'intermittent'],
            'rare': ['rarely', 'seldom', 'once in a while', 'hardly ever']
        }

    @staticmethod
    def load_location_keywords() -> Dict:
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

    @staticmethod
    def load_quality_descriptors() -> List[str]:
        """Pain and symptom quality descriptors"""
        return [
            'sharp', 'dull', 'aching', 'burning', 'stabbing', 'throbbing',
            'cramping', 'shooting', 'radiating', 'pulsating', 'gnawing',
            'crushing', 'squeezing', 'tight', 'heavy', 'pressure'
        ]

    @staticmethod
    def load_trigger_keywords() -> List[str]:
        """Common symptom triggers"""
        return [
            'stress', 'exercise', 'eating', 'lying down', 'standing up',
            'cold weather', 'hot weather', 'certain foods', 'alcohol',
            'medication', 'movement', 'coughing', 'sneezing'
        ]

    @staticmethod
    def load_relief_keywords() -> List[str]:
        """Common symptom relievers"""
        return [
            'rest', 'sleep', 'medication', 'heat', 'cold', 'massage',
            'stretching', 'sitting', 'lying down', 'walking', 'eating'
        ]

    @staticmethod
    def define_conversation_flow() -> Dict:
        """Define enhanced conversation flow"""
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