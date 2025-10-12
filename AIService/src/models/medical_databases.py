class MedicalDatabases:
    """Comprehensive medical databases for symptom analysis and diagnosis"""

    def __init__(self):
        self.symptom_database = {}
        self.body_parts = {}
        self.condition_database = {}
        self.medication_database = {}
        self.emergency_keywords = {}
        self._initialize_databases()

    def _initialize_databases(self):
        """Initialize all medical databases"""
        self._initialize_symptom_database()
        self._initialize_body_parts()
        self._initialize_condition_database()
        self._initialize_medication_database()
        self._initialize_emergency_keywords()

    def _initialize_symptom_database(self):
        """Initialize symptom database with severity scores and body systems"""
        self.symptom_database = {
            # Pain-related symptoms
            'headache': {'severity': 6, 'system': 'neurological', 'keywords': ['head pain', 'migraine', 'head ache']},
            'chest pain': {'severity': 9, 'system': 'cardiovascular', 'keywords': ['chest discomfort', 'heart pain']},
            'abdominal pain': {'severity': 7, 'system': 'gastrointestinal', 'keywords': ['stomach pain', 'belly ache']},
            'back pain': {'severity': 6, 'system': 'musculoskeletal', 'keywords': ['backache', 'spinal pain']},
            'joint pain': {'severity': 5, 'system': 'musculoskeletal', 'keywords': ['arthralgia', 'joint discomfort']},

            # Respiratory symptoms
            'cough': {'severity': 4, 'system': 'respiratory', 'keywords': ['coughing', 'hacking']},
            'shortness of breath': {'severity': 8, 'system': 'respiratory',
                                    'keywords': ['dyspnea', 'breathing difficulty']},
            'wheezing': {'severity': 6, 'system': 'respiratory', 'keywords': ['whistling breath']},

            # Gastrointestinal symptoms
            'nausea': {'severity': 5, 'system': 'gastrointestinal', 'keywords': ['queasy', 'sick to stomach']},
            'vomiting': {'severity': 6, 'system': 'gastrointestinal', 'keywords': ['throwing up', 'emesis']},
            'diarrhea': {'severity': 5, 'system': 'gastrointestinal', 'keywords': ['loose stools']},
            'constipation': {'severity': 3, 'system': 'gastrointestinal', 'keywords': ['irregularity']},

            # Neurological symptoms
            'dizziness': {'severity': 5, 'system': 'neurological', 'keywords': ['vertigo', 'lightheaded']},
            'fainting': {'severity': 7, 'system': 'neurological', 'keywords': ['syncope', 'passing out']},
            'numbness': {'severity': 6, 'system': 'neurological', 'keywords': ['loss of sensation']},
            'tingling': {'severity': 4, 'system': 'neurological', 'keywords': ['pins and needles']},
            'seizure': {'severity': 9, 'system': 'neurological', 'keywords': ['convulsion', 'fit']},

            # Cardiovascular symptoms
            'palpitations': {'severity': 6, 'system': 'cardiovascular',
                             'keywords': ['heart racing', 'irregular heartbeat']},
            'swelling': {'severity': 5, 'system': 'cardiovascular', 'keywords': ['edema', 'fluid retention']},

            # General symptoms
            'fever': {'severity': 6, 'system': 'general', 'keywords': ['high temperature', 'pyrexia']},
            'fatigue': {'severity': 4, 'system': 'general', 'keywords': ['tiredness', 'exhaustion']},
            'weakness': {'severity': 5, 'system': 'general', 'keywords': ['loss of strength']},
            'weight loss': {'severity': 6, 'system': 'general', 'keywords': ['unintentional weight loss']},

            # Dermatological symptoms
            'rash': {'severity': 4, 'system': 'dermatological', 'keywords': ['skin eruption', 'hives']},
            'itching': {'severity': 3, 'system': 'dermatological', 'keywords': ['pruritus']},
            'redness': {'severity': 3, 'system': 'dermatological', 'keywords': ['erythema']},

            # Additional symptoms
            'bleeding': {'severity': 7, 'system': 'hematological', 'keywords': ['hemorrhage', 'blood loss']},
            'bruising': {'severity': 4, 'system': 'hematological', 'keywords': ['ecchymosis']},
            'vision changes': {'severity': 7, 'system': 'ophthalmological',
                               'keywords': ['blurred vision', 'visual disturbance']},
            'hearing loss': {'severity': 6, 'system': 'otolaryngological', 'keywords': ['deafness']},
        }

    def _initialize_body_parts(self):
        """Initialize body parts database"""
        self.body_parts = {
            'head': ['scalp', 'forehead', 'temple', 'crown'],
            'face': ['eye', 'ear', 'nose', 'mouth', 'chin', 'cheek'],
            'neck': ['throat', 'cervical', 'nape'],
            'chest': ['breast', 'rib', 'sternum', 'lung', 'heart'],
            'abdomen': ['stomach', 'belly', 'umbilicus', 'pelvis'],
            'back': ['spine', 'lumbar', 'thoracic', 'coccyx'],
            'limbs': ['arm', 'leg', 'hand', 'foot', 'shoulder', 'elbow', 'wrist', 'knee', 'ankle'],
            'internal': ['liver', 'kidney', 'spleen', 'pancreas', 'intestine']
        }

    def _initialize_condition_database(self):
        """Initialize condition database"""
        self.condition_database = {
            'migraine': {'symptoms': ['headache', 'nausea', 'sensitivity to light'], 'severity': 7},
            'influenza': {'symptoms': ['fever', 'cough', 'fatigue', 'body aches'], 'severity': 6},
            'pneumonia': {'symptoms': ['cough', 'fever', 'shortness of breath', 'chest pain'], 'severity': 8},
            'myocardial infarction': {'symptoms': ['chest pain', 'shortness of breath', 'nausea'], 'severity': 10},
            'gastroenteritis': {'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal pain'], 'severity': 6},
            'urinary tract infection': {'symptoms': ['painful urination', 'frequent urination', 'abdominal pain'],
                                        'severity': 5},
            'hypertension': {'symptoms': ['headache', 'dizziness', 'palpitations'], 'severity': 7},
            'diabetes': {'symptoms': ['fatigue', 'weight loss', 'increased thirst'], 'severity': 7},
            'asthma': {'symptoms': ['wheezing', 'shortness of breath', 'cough'], 'severity': 7},
            'arthritis': {'symptoms': ['joint pain', 'swelling', 'stiffness'], 'severity': 6},
        }

    def _initialize_medication_database(self):
        """Initialize medication database"""
        self.medication_database = {
            'pain': ['ibuprofen', 'acetaminophen', 'naproxen', 'aspirin'],
            'fever': ['acetaminophen', 'ibuprofen'],
            'infection': ['amoxicillin', 'azithromycin', 'doxycycline'],
            'allergy': ['loratadine', 'cetirizine', 'diphenhydramine'],
            'hypertension': ['lisinopril', 'amlodipine', 'metoprolol'],
            'diabetes': ['metformin', 'insulin', 'glipizide']
        }

    def _initialize_emergency_keywords(self):
        """Initialize emergency detection keywords"""
        self.emergency_keywords = {
            'critical': [
                'chest pain', 'heart attack', 'cardiac arrest', 'unconscious',
                'not breathing', 'severe bleeding', 'stroke symptoms', 'anaphylaxis',
                'suicidal', 'homicidal', 'seizure lasting', 'severe trauma'
            ],
            'urgent': [
                'difficulty breathing', 'moderate bleeding', 'high fever with rash',
                'severe pain', 'chemical exposure', 'eye injury', 'broken bone'
            ],
            'semi-urgent': [
                'persistent vomiting', 'dehydration', 'moderate pain',
                'worsening infection', 'allergic reaction'
            ]
        }