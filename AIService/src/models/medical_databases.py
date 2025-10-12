class ComprehensiveMedicalDatabases:
    """EXTENSIVE medical databases for comprehensive symptom analysis and diagnosis"""

    def __init__(self):
        self.symptom_database = {}
        self.body_parts = {}
        self.condition_database = {}
        self.medication_database = {}
        self.emergency_keywords = {}
        self.lab_tests = {}
        self.procedures = {}
        self.medical_specialties = {}
        self.medical_abbreviations = {}
        self.anatomical_terms = {}
        self.diagnostic_criteria = {}
        self._initialize_databases()

    def _initialize_databases(self):
        """Initialize all comprehensive medical databases"""
        self._initialize_symptom_database()
        self._initialize_body_parts()
        self._initialize_condition_database()
        self._initialize_medication_database()
        self._initialize_emergency_keywords()
        self._initialize_lab_tests()
        self._initialize_procedures()
        self._initialize_medical_specialties()
        self._initialize_medical_abbreviations()
        self._initialize_anatomical_terms()
        self._initialize_diagnostic_criteria()

    def _initialize_symptom_database(self):
        """Comprehensive symptom database with severity scores and body systems"""
        self.symptom_database = {
            # ==================== NEUROLOGICAL SYMPTOMS ====================
            'headache': {'severity': 6, 'system': 'neurological',
                         'keywords': ['head pain', 'migraine', 'head ache', 'cephalalgia', 'cephalgia',
                                      'tension headache', 'cluster headache', 'throbbing headache']},
            'migraine': {'severity': 7, 'system': 'neurological',
                         'keywords': ['migraine headache', 'hemicrania', 'sick headache', 'migraine with aura',
                                      'migraine without aura', 'ophthalmic migraine', 'retinal migraine']},
            'dizziness': {'severity': 5, 'system': 'neurological',
                          'keywords': ['vertigo', 'lightheaded', 'dizzy spells', 'unsteadiness', 'wooziness',
                                       'disequilibrium', 'presyncope', 'giddiness']},
            'vertigo': {'severity': 6, 'system': 'neurological',
                        'keywords': ['spinning sensation', 'room spinning', 'balance problems', 'rotational vertigo',
                                     'positional vertigo', 'benign paroxysmal positional vertigo', 'BPPV']},
            'fainting': {'severity': 7, 'system': 'neurological',
                         'keywords': ['syncope', 'passing out', 'loss of consciousness', 'blackout',
                                      'vasovagal syncope',
                                      'cardiac syncope', 'neurocardiogenic syncope']},
            'seizure': {'severity': 9, 'system': 'neurological',
                        'keywords': ['convulsion', 'fit', 'epilepsy', 'tonic-clonic', 'grand mal', 'petit mal',
                                     'absence seizure', 'complex partial seizure', 'simple partial seizure',
                                     'status epilepticus']},
            'numbness': {'severity': 6, 'system': 'neurological',
                         'keywords': ['loss of sensation', 'paresthesia', 'tingling numbness', 'hypoesthesia',
                                      'anesthesia', 'sensory loss', 'glove and stocking distribution']},
            'tingling': {'severity': 4, 'system': 'neurological',
                         'keywords': ['pins and needles', 'paresthesia', 'tingly sensation', 'formication',
                                      'dysesthesia', 'burning sensation', 'electric shock sensation']},
            'tremor': {'severity': 5, 'system': 'neurological',
                       'keywords': ['shaking', 'trembling', 'essential tremor', 'resting tremor', 'intention tremor',
                                    'parkinsonian tremor', 'cerebellar tremor', 'physiological tremor']},
            'memory loss': {'severity': 7, 'system': 'neurological',
                            'keywords': ['amnesia', 'forgetfulness', 'cognitive decline', 'dementia',
                                         'mild cognitive impairment',
                                         'anterograde amnesia', 'retrograde amnesia', 'transient global amnesia']},
            'confusion': {'severity': 7, 'system': 'neurological',
                          'keywords': ['disorientation', 'mental fog', 'delirium', 'encephalopathy',
                                       'altered mental status',
                                       'clouding of consciousness', 'sundowning', 'acute confusional state']},
            'speech difficulty': {'severity': 8, 'system': 'neurological',
                                  'keywords': ['dysarthria', 'slurred speech', 'aphasia', 'expressive aphasia',
                                               'receptive aphasia',
                                               'global aphasia', 'dysphonia', 'hoarseness', 'vocal cord dysfunction']},
            'ataxia': {'severity': 7, 'system': 'neurological',
                       'keywords': ['unsteady gait', 'clumsiness', 'cerebellar ataxia', 'sensory ataxia',
                                    'vestibular ataxia',
                                    'truncal ataxia', 'limb ataxia', 'gait disturbance']},
            'dysphagia': {'severity': 7, 'system': 'neurological',
                          'keywords': ['difficulty swallowing', 'neurogenic dysphagia', 'oropharyngeal dysphagia',
                                       'esophageal dysphagia',
                                       'transfer dysphagia', 'transport dysphagia']},

            # ==================== CARDIOVASCULAR SYMPTOMS ====================
            'chest pain': {'severity': 9, 'system': 'cardiovascular',
                           'keywords': ['chest discomfort', 'heart pain', 'angina', 'thoracic pain', 'precordial pain',
                                        'retrosternal pain', 'pleuritic chest pain', 'non-cardiac chest pain']},
            'palpitations': {'severity': 6, 'system': 'cardiovascular',
                             'keywords': ['heart racing', 'irregular heartbeat', 'pounding heart', 'arrhythmia',
                                          'tachycardia',
                                          'bradycardia', 'ectopic beats', 'premature ventricular contractions', 'PVCs',
                                          'atrial fibrillation']},
            'shortness of breath': {'severity': 8, 'system': 'cardiovascular',
                                    'keywords': ['dyspnea', 'breathing difficulty', 'air hunger', 'breathlessness',
                                                 'exertional dyspnea',
                                                 'resting dyspnea', 'paroxysmal nocturnal dyspnea', 'orthopnea',
                                                 'platypnea']},
            'edema': {'severity': 5, 'system': 'cardiovascular',
                      'keywords': ['swelling', 'fluid retention', 'pitting edema', 'ankle swelling', 'pedal edema',
                                   'pretibial edema',
                                   'dependent edema', 'anasarca', 'generalized edema']},
            'leg swelling': {'severity': 6, 'system': 'cardiovascular',
                             'keywords': ['lower extremity edema', 'bilateral leg swelling', 'unilateral leg swelling',
                                          'leg edema',
                                          'calf swelling', 'thigh swelling', 'phlebedema']},
            'orthopnea': {'severity': 7, 'system': 'cardiovascular',
                          'keywords': ['shortness of breath lying down', 'breathing difficulty when lying flat',
                                       'need to sleep propped up',
                                       'paroxysmal nocturnal dyspnea', 'PND']},
            'syncope': {'severity': 8, 'system': 'cardiovascular',
                        'keywords': ['fainting', 'passing out', 'loss of consciousness', 'cardiogenic syncope',
                                     'reflex syncope',
                                     'situational syncope', 'carotid sinus syncope']},
            'claudication': {'severity': 6, 'system': 'cardiovascular',
                             'keywords': ['leg pain with walking', 'intermittent claudication', 'vascular claudication',
                                          'neurogenic claudication',
                                          'buttock pain walking', 'calf pain exercise']},

            # ==================== RESPIRATORY SYMPTOMS ====================
            'cough': {'severity': 4, 'system': 'respiratory',
                      'keywords': ['coughing', 'hacking', 'productive cough', 'dry cough', 'non-productive cough',
                                   'paroxysmal cough',
                                   'whooping cough', 'pertussis', 'brassy cough', 'barking cough']},
            'productive cough': {'severity': 5, 'system': 'respiratory',
                                 'keywords': ['cough with phlegm', 'sputum production', 'chesty cough',
                                              'mucopurulent sputum', 'purulent sputum',
                                              'frothy sputum', 'pink frothy sputum', 'rusty sputum']},
            'hemoptysis': {'severity': 8, 'system': 'respiratory',
                           'keywords': ['coughing blood', 'blood in sputum', 'frank hemoptysis', 'massive hemoptysis',
                                        'blood-streaked sputum']},
            'wheezing': {'severity': 6, 'system': 'respiratory',
                         'keywords': ['whistling breath', 'bronchospasm', 'asthmatic breathing', 'expiratory wheeze',
                                      'inspiratory wheeze',
                                      'polyphonic wheeze', 'monophonic wheeze']},
            'stridor': {'severity': 8, 'system': 'respiratory',
                        'keywords': ['high pitched breathing', 'inspiratory wheeze', 'laryngeal stridor',
                                     'tracheal stridor', 'biphasic stridor']},
            'pleuritic pain': {'severity': 7, 'system': 'respiratory',
                               'keywords': ['pleurisy', 'chest pain breathing', 'painful inspiration',
                                            'pleuritic chest pain', 'pleural rub']},
            'cyanosis': {'severity': 9, 'system': 'respiratory',
                         'keywords': ['blue lips', 'blue skin', 'cyanotic', 'central cyanosis', 'peripheral cyanosis',
                                      'acrocyanosis']},
            'tachypnea': {'severity': 7, 'system': 'respiratory',
                          'keywords': ['rapid breathing', 'increased respiratory rate', 'hyperventilation',
                                       'respiratory alkalosis',
                                       'Kussmaul breathing', 'Cheyne-Stokes respiration']},

            # ==================== GASTROINTESTINAL SYMPTOMS ====================
            'abdominal pain': {'severity': 7, 'system': 'gastrointestinal',
                               'keywords': ['stomach pain', 'belly ache', 'tummy pain', 'abdominal discomfort',
                                            'epigastric pain',
                                            'right upper quadrant pain', 'left upper quadrant pain',
                                            'right lower quadrant pain',
                                            'left lower quadrant pain', 'suprapubic pain', 'periumbilical pain',
                                            'flank pain']},
            'nausea': {'severity': 5, 'system': 'gastrointestinal',
                       'keywords': ['queasy', 'sick to stomach', 'nauseated', 'feeling sick', 'nausea without vomiting',
                                    'nausea with vomiting', 'morning sickness']},
            'vomiting': {'severity': 6, 'system': 'gastrointestinal',
                         'keywords': ['throwing up', 'emesis', 'vomitus', 'regurgitation', 'projectile vomiting',
                                      'non-bilious vomiting',
                                      'bilious vomiting', 'feculent vomiting', 'coffee ground emesis']},
            'hematemesis': {'severity': 9, 'system': 'gastrointestinal',
                            'keywords': ['vomiting blood', 'blood in vomit', 'frank hematemesis',
                                         'coffee ground vomiting']},
            'diarrhea': {'severity': 5, 'system': 'gastrointestinal',
                         'keywords': ['loose stools', 'watery bowel movements', 'the runs', 'acute diarrhea',
                                      'chronic diarrhea',
                                      'infectious diarrhea', 'osmotic diarrhea', 'secretory diarrhea',
                                      'inflammatory diarrhea']},
            'constipation': {'severity': 3, 'system': 'gastrointestinal',
                             'keywords': ['irregularity', 'hard stools', 'infrequent bowel movements', 'obstipation',
                                          'functional constipation',
                                          'slow transit constipation', 'outlet dysfunction constipation']},
            'bloating': {'severity': 4, 'system': 'gastrointestinal',
                         'keywords': ['abdominal distension', 'feeling full', 'gas', 'flatulence', 'borborygmi',
                                      'abdominal tympany']},
            'dysphagia': {'severity': 7, 'system': 'gastrointestinal',
                          'keywords': ['difficulty swallowing', 'trouble swallowing', 'oropharyngeal dysphagia',
                                       'esophageal dysphagia',
                                       'transfer dysphagia', 'transport dysphagia']},
            'odynophagia': {'severity': 7, 'system': 'gastrointestinal',
                            'keywords': ['painful swallowing', 'swallowing pain', 'esophageal pain swallowing']},
            'heartburn': {'severity': 4, 'system': 'gastrointestinal',
                          'keywords': ['acid reflux', 'GERD', 'pyrosis', 'indigestion', 'dyspepsia',
                                       'gastroesophageal reflux',
                                       'water brash', 'acid regurgitation']},
            'melena': {'severity': 9, 'system': 'gastrointestinal',
                       'keywords': ['black tarry stools', 'digested blood in stool', 'melenic stools',
                                    'guiac positive stools']},
            'hematochezia': {'severity': 8, 'system': 'gastrointestinal',
                             'keywords': ['bright red blood in stool', 'rectal bleeding', 'maroon colored stools',
                                          'frank rectal bleeding']},
            'jaundice': {'severity': 8, 'system': 'gastrointestinal',
                         'keywords': ['yellow skin', 'yellow eyes', 'icterus', 'scleral icterus',
                                      'pre-hepatic jaundice',
                                      'hepatic jaundice', 'post-hepatic jaundice', 'obstructive jaundice']},
            'ascites': {'severity': 7, 'system': 'gastrointestinal',
                        'keywords': ['abdominal fluid', 'distended abdomen', 'shifting dullness', 'fluid wave',
                                     'tense ascites']},

            # ==================== MUSCULOSKELETAL SYMPTOMS ====================
            'back pain': {'severity': 6, 'system': 'musculoskeletal',
                          'keywords': ['backache', 'spinal pain', 'lumbar pain', 'dorsalgia', 'cervical pain',
                                       'thoracic back pain',
                                       'lumbago', 'sciatica', 'radicular pain']},
            'joint pain': {'severity': 5, 'system': 'musculoskeletal',
                           'keywords': ['arthralgia', 'joint discomfort', 'arthritic pain', 'polyarthralgia',
                                        'monoarthralgia',
                                        'inflammatory joint pain', 'mechanical joint pain']},
            'myalgia': {'severity': 5, 'system': 'musculoskeletal',
                        'keywords': ['muscle pain', 'muscle aches', 'body aches', 'polymyalgia', 'localized myalgia',
                                     'generalized myalgia', 'muscle tenderness']},
            'arthralgia': {'severity': 5, 'system': 'musculoskeletal',
                           'keywords': ['joint pain', 'polyarthralgia', 'monoarthralgia', 'inflammatory arthralgia']},
            'stiffness': {'severity': 4, 'system': 'musculoskeletal',
                          'keywords': ['joint stiffness', 'muscle stiffness', 'rigidity', 'morning stiffness',
                                       'gelling phenomenon',
                                       'cogwheel rigidity', 'lead pipe rigidity']},
            'swelling': {'severity': 5, 'system': 'musculoskeletal',
                         'keywords': ['edema', 'inflammation', 'joint swelling', 'soft tissue swelling', 'effusion',
                                      'synovitis', 'tenosynovitis', 'bursitis']},
            'limited range of motion': {'severity': 5, 'system': 'musculoskeletal',
                                        'keywords': ['decreased mobility', 'restricted movement', 'joint contracture',
                                                     'frozen joint',
                                                     'ankylosis', 'pseudoparalysis']},

            # ==================== DERMATOLOGICAL SYMPTOMS ====================
            'rash': {'severity': 4, 'system': 'dermatological',
                     'keywords': ['skin eruption', 'hives', 'skin rash', 'eruption', 'macular rash', 'papular rash',
                                  'vesicular rash', 'pustular rash', 'bullous rash', 'erythematous rash',
                                  'morbilliform rash',
                                  'scarlatiniform rash', 'urticarial rash']},
            'pruritus': {'severity': 3, 'system': 'dermatological',
                         'keywords': ['itching', 'itchy skin', 'cutaneous pruritus', 'generalized pruritus',
                                      'localized pruritus',
                                      'pruritus ani', 'pruritus vulvae', 'uremic pruritus']},
            'erythema': {'severity': 3, 'system': 'dermatological',
                         'keywords': ['redness', 'skin redness', 'inflammatory redness', 'blanchable erythema',
                                      'non-blanchable erythema',
                                      'erythema multiforme', 'erythema nodosum', 'erythema migrans']},
            'urticaria': {'severity': 4, 'system': 'dermatological',
                          'keywords': ['hives', 'wheals', 'nettle rash', 'acute urticaria', 'chronic urticaria',
                                       'physical urticaria',
                                       'dermatographism', 'angioedema']},
            'petechiae': {'severity': 6, 'system': 'dermatological',
                          'keywords': ['pinpoint bleeding', 'small red spots', 'non-blanching purpura', 'ecchymosis',
                                       'purpura',
                                       'palpable purpura', 'non-palpable purpura']},
            'ecchymosis': {'severity': 4, 'system': 'dermatological',
                           'keywords': ['bruising', 'bruises', 'contusion', 'hematoma', 'subcutaneous bleeding']},
            'ulcer': {'severity': 6, 'system': 'dermatological',
                      'keywords': ['skin ulcer', 'sore', 'cutaneous ulcer', 'decubitus ulcer', 'venous ulcer',
                                   'arterial ulcer',
                                   'neuropathic ulcer', 'pressure sore']},
            'blister': {'severity': 4, 'system': 'dermatological',
                        'keywords': ['vesicle', 'bulla', 'fluid-filled lesion', 'clear blister', 'hemorrhagic blister',
                                     'friction blister', 'burn blister']},
            'pustule': {'severity': 4, 'system': 'dermatological',
                        'keywords': ['pus-filled lesion', 'infected pore', 'follicular pustule',
                                     'non-follicular pustule']},
            'scale': {'severity': 3, 'system': 'dermatological',
                      'keywords': ['flaking skin', 'desquamation', 'exfoliation', 'psoriasiform scale',
                                   'ichthyotic scale']},
            'crust': {'severity': 3, 'system': 'dermatological',
                      'keywords': ['scab', 'dried exudate', 'serous crust', 'hemorrhagic crust',
                                   'honey-colored crust']},

            # ==================== GENITOURINARY SYMPTOMS ====================
            'dysuria': {'severity': 5, 'system': 'genitourinary',
                        'keywords': ['painful urination', 'burning urination', 'urination pain', 'urethral pain',
                                     'urethritis']},
            'hematuria': {'severity': 8, 'system': 'genitourinary',
                          'keywords': ['blood in urine', 'red urine', 'urinary bleeding', 'gross hematuria',
                                       'microscopic hematuria',
                                       'initial hematuria', 'terminal hematuria', 'total hematuria']},
            'frequency': {'severity': 4, 'system': 'genitourinary',
                          'keywords': ['frequent urination', 'urinary frequency', 'pollakiuria', 'diurnal frequency',
                                       'nocturnal frequency']},
            'urgency': {'severity': 5, 'system': 'genitourinary',
                        'keywords': ['urinary urgency', 'sudden need to urinate', 'imperative urination',
                                     'overactive bladder']},
            'incontinence': {'severity': 6, 'system': 'genitourinary',
                             'keywords': ['urinary incontinence', 'leakage', 'bladder control issues',
                                          'stress incontinence',
                                          'urge incontinence', 'overflow incontinence', 'mixed incontinence',
                                          'functional incontinence']},
            'nocturia': {'severity': 4, 'system': 'genitourinary',
                         'keywords': ['nighttime urination', 'waking up to urinate', 'nocturnal polyuria']},
            'oliguria': {'severity': 8, 'system': 'genitourinary',
                         'keywords': ['decreased urine output', 'low urine production', 'reduced urinary volume']},
            'anuria': {'severity': 10, 'system': 'genitourinary',
                       'keywords': ['no urine output', 'kidney failure', 'renal shutdown',
                                    'complete urinary obstruction']},
            'proteinuria': {'severity': 6, 'system': 'genitourinary',
                            'keywords': ['protein in urine', 'albuminuria', 'nephrotic range proteinuria',
                                         'non-nephrotic proteinuria']},

            # ==================== ENDOCRINE/METABOLIC SYMPTOMS ====================
            'polyuria': {'severity': 5, 'system': 'endocrine',
                         'keywords': ['excessive urination', 'large urine volume', 'diuresis', 'osmotic diuresis']},
            'polydipsia': {'severity': 5, 'system': 'endocrine',
                           'keywords': ['excessive thirst', 'increased thirst', 'primary polydipsia',
                                        'psychogenic polydipsia']},
            'polyphagia': {'severity': 4, 'system': 'endocrine',
                           'keywords': ['excessive hunger', 'increased appetite', 'hyperphagia', 'bulimia']},
            'heat intolerance': {'severity': 4, 'system': 'endocrine',
                                 'keywords': ['sensitivity to heat', 'cannot tolerate heat', 'preference for cold']},
            'cold intolerance': {'severity': 4, 'system': 'endocrine',
                                 'keywords': ['sensitivity to cold', 'cannot tolerate cold', 'preference for heat']},
            'weight gain': {'severity': 5, 'system': 'endocrine',
                            'keywords': ['increased weight', 'unexplained weight gain', 'obesity', 'overweight',
                                         'central obesity']},
            'weight loss': {'severity': 6, 'system': 'endocrine',
                            'keywords': ['unintentional weight loss', 'weight reduction', 'cachexia', 'wasting']},
            'hirsutism': {'severity': 4, 'system': 'endocrine',
                          'keywords': ['excessive hair growth', 'male pattern hair growth in women',
                                       'androgen excess']},
            'acanthosis nigricans': {'severity': 4, 'system': 'endocrine',
                                     'keywords': ['dark velvety skin', 'skin thickening', 'insulin resistance marker']},

            # ==================== GENERAL SYMPTOMS ====================
            'fever': {'severity': 6, 'system': 'general',
                      'keywords': ['high temperature', 'pyrexia', 'elevated temperature', 'febrile', 'hyperthermia',
                                   'low-grade fever', 'high-grade fever', 'spiking fever', 'remittent fever',
                                   'intermittent fever']},
            'chills': {'severity': 5, 'system': 'general',
                       'keywords': ['shivering', 'rigors', 'feeling cold', 'shaking chills', 'malarial rigors']},
            'fatigue': {'severity': 4, 'system': 'general',
                        'keywords': ['tiredness', 'exhaustion', 'lethargy', 'malaise', 'asthenia', 'adynamia',
                                     'chronic fatigue',
                                     'post-exertional malaise']},
            'weakness': {'severity': 5, 'system': 'general',
                         'keywords': ['loss of strength', 'asthenia', 'debility', 'generalized weakness',
                                      'focal weakness',
                                      'proximal weakness', 'distal weakness']},
            'anorexia': {'severity': 6, 'system': 'general',
                         'keywords': ['loss of appetite', 'decreased appetite', 'anorexia nervosa', 'cachexia']},
            'night sweats': {'severity': 5, 'system': 'general',
                             'keywords': ['nocturnal sweating', 'sweating at night', 'drenching night sweats',
                                          'soaking night sweats']},
            'lymphadenopathy': {'severity': 6, 'system': 'general',
                                'keywords': ['swollen lymph nodes', 'enlarged glands', 'lymph node enlargement',
                                             'localized lymphadenopathy',
                                             'generalized lymphadenopathy', 'reactive lymphadenopathy']},
            'pallor': {'severity': 5, 'system': 'general',
                       'keywords': ['paleness', 'skin pallor', 'conjunctival pallor', 'mucosal pallor']},
            'diaphoresis': {'severity': 4, 'system': 'general',
                            'keywords': ['excessive sweating', 'hyperhidrosis', 'generalized sweating',
                                         'localized sweating']},

            # ==================== PSYCHIATRIC SYMPTOMS ====================
            'anxiety': {'severity': 5, 'system': 'psychiatric',
                        'keywords': ['nervousness', 'worry', 'apprehension', 'generalized anxiety', 'panic attacks',
                                     'anticipatory anxiety', 'performance anxiety', 'social anxiety']},
            'depression': {'severity': 7, 'system': 'psychiatric',
                           'keywords': ['low mood', 'sadness', 'depressive symptoms', 'major depression', 'dysthymia',
                                        'treatment-resistant depression', 'postpartum depression']},
            'insomnia': {'severity': 4, 'system': 'psychiatric',
                         'keywords': ['sleeplessness', 'difficulty sleeping', 'sleep disturbance', 'initial insomnia',
                                      'middle insomnia', 'terminal insomnia', 'sleep maintenance insomnia']},
            'hallucinations': {'severity': 8, 'system': 'psychiatric',
                               'keywords': ['seeing things', 'hearing voices', 'sensory deception',
                                            'auditory hallucinations',
                                            'visual hallucinations', 'tactile hallucinations',
                                            'olfactory hallucinations',
                                            'gustatory hallucinations']},
            'delusions': {'severity': 8, 'system': 'psychiatric',
                          'keywords': ['false beliefs', 'paranoia', 'fixed false beliefs', 'persecutory delusions',
                                       'grandiose delusions', 'somatic delusions', 'bizarre delusions']},
            'mania': {'severity': 8, 'system': 'psychiatric',
                      'keywords': ['elevated mood', 'irritability', 'racing thoughts', 'pressured speech',
                                   'decreased need for sleep',
                                   'grandiosity', 'impulsivity', 'hypomania']},
            'suicidal ideation': {'severity': 10, 'system': 'psychiatric',
                                  'keywords': ['suicidal thoughts', 'death wishes', 'suicide plan',
                                               'passive suicidal ideation',
                                               'active suicidal ideation']},

            # ==================== EYE SYMPTOMS ====================
            'vision changes': {'severity': 7, 'system': 'ophthalmological',
                               'keywords': ['blurred vision', 'visual disturbance', 'dim vision', 'cloudy vision',
                                            'hazy vision',
                                            'fluctuating vision', 'sudden vision loss', 'gradual vision loss']},
            'diplopia': {'severity': 7, 'system': 'ophthalmological',
                         'keywords': ['double vision', 'seeing double', 'binocular diplopia', 'monocular diplopia',
                                      'horizontal diplopia', 'vertical diplopia']},
            'photophobia': {'severity': 4, 'system': 'ophthalmological',
                            'keywords': ['light sensitivity', 'sensitivity to light', 'photophobic',
                                         'ocular photosensitivity']},
            'eye pain': {'severity': 6, 'system': 'ophthalmological',
                         'keywords': ['ocular pain', 'pain in eye', 'orbital pain', 'retro-orbital pain',
                                      'periocular pain']},
            'red eye': {'severity': 5, 'system': 'ophthalmological',
                        'keywords': ['conjunctival injection', 'bloodshot eyes', 'ocular redness',
                                     'conjunctival redness']},
            'floaters': {'severity': 4, 'system': 'ophthalmological',
                         'keywords': ['spots in vision', 'flying spots', 'vitreous floaters', 'muscae volitantes']},
            'flashes': {'severity': 6, 'system': 'ophthalmological',
                        'keywords': ['light flashes', 'photopsia', 'retinal flashes', 'ocular flashes']},

            # ==================== EAR SYMPTOMS ====================
            'hearing loss': {'severity': 6, 'system': 'otolaryngological',
                             'keywords': ['deafness', 'hearing impairment', 'reduced hearing',
                                          'conductive hearing loss',
                                          'sensorineural hearing loss', 'mixed hearing loss', 'sudden hearing loss']},
            'tinnitus': {'severity': 4, 'system': 'otolaryngological',
                         'keywords': ['ringing in ears', 'ear noise', 'buzzing in ears', 'pulsatile tinnitus',
                                      'non-pulsatile tinnitus',
                                      'subjective tinnitus', 'objective tinnitus']},
            'otalgia': {'severity': 5, 'system': 'otolaryngological',
                        'keywords': ['ear pain', 'earache', 'otalgia', 'primary otalgia', 'secondary otalgia',
                                     'referred otalgia']},
            'otorrhea': {'severity': 4, 'system': 'otolaryngological',
                         'keywords': ['ear discharge', 'ear drainage', 'purulent otorrhea', 'serous otorrhea',
                                      'bloody otorrhea']},
            'vertigo': {'severity': 6, 'system': 'otolaryngological',
                        'keywords': ['dizziness', 'spinning sensation', 'vestibular vertigo', 'peripheral vertigo']},

            # ==================== ADDITIONAL CRITICAL SYMPTOMS ====================
            'syncope': {'severity': 8, 'system': 'neurological',
                        'keywords': ['fainting', 'passing out', 'loss of consciousness', 'vasovagal syncope']},
            'hematemesis': {'severity': 9, 'system': 'gastrointestinal',
                            'keywords': ['vomiting blood']},
            'melena': {'severity': 9, 'system': 'gastrointestinal',
                       'keywords': ['black tarry stools']},
            'hematochezia': {'severity': 8, 'system': 'gastrointestinal',
                             'keywords': ['bright red blood per rectum']},
            'hemoptysis': {'severity': 8, 'system': 'respiratory',
                           'keywords': ['coughing up blood']},
            'anaphylaxis': {'severity': 10, 'system': 'allergic',
                            'keywords': ['severe allergic reaction', 'anaphylactic shock']},
            'sepsis': {'severity': 10, 'system': 'infectious',
                       'keywords': ['septic shock', 'systemic inflammatory response', 'SIRS']},
        }

    def _initialize_body_parts(self):
        """Comprehensive body parts database"""
        self.body_parts = {
            'head': ['scalp', 'forehead', 'temple', 'crown', 'occiput', 'vertex', 'parietal', 'frontal', 'temporal',
                     'occipital'],
            'face': ['eye', 'ear', 'nose', 'mouth', 'chin', 'cheek', 'jaw', 'brow', 'eyelid', 'eyebrow', 'nasal bridge',
                     'philtrum', 'temple'],
            'neck': ['throat', 'cervical', 'nape', 'pharynx', 'larynx', 'trachea', 'thyroid', 'carotid', 'jugular',
                     'supraclavicular', 'sternocleidomastoid'],
            'chest': ['breast', 'rib', 'sternum', 'lung', 'heart', 'mediastinum', 'pleura', 'thorax', 'precordium',
                      'mammary', 'axilla', 'intercostal'],
            'abdomen': ['stomach', 'belly', 'umbilicus', 'pelvis', 'epigastrium', 'hypochondrium', 'flank', 'groin',
                        'inguinal', 'suprapubic', 'periumbilical', 'quadrants'],
            'back': ['spine', 'lumbar', 'thoracic', 'coccyx', 'sacrum', 'scapula', 'vertebrae', 'paraspinal',
                     'costovertebral', 'sacroiliac'],
            'upper_limbs': ['arm', 'hand', 'shoulder', 'elbow', 'wrist', 'finger', 'thumb', 'forearm', 'biceps',
                            'triceps', 'deltoid', 'carpal', 'metacarpal', 'phalanges'],
            'lower_limbs': ['leg', 'foot', 'knee', 'ankle', 'thigh', 'calf', 'shin', 'toe', 'hip', 'buttock', 'gluteal',
                            'femoral', 'popliteal', 'plantar', 'dorsal'],
            'internal_organs': ['liver', 'kidney', 'spleen', 'pancreas', 'intestine', 'colon', 'appendix',
                                'gallbladder', 'bladder', 'stomach', 'esophagus', 'adrenal'],
            'neurological': ['brain', 'spinal cord', 'nerves', 'cerebrum', 'cerebellum', 'brainstem', 'meninges',
                             'cortex', 'basal ganglia', 'thalamus', 'hypothalamus'],
            'cardiovascular': ['heart', 'arteries', 'veins', 'aorta', 'coronary', 'carotid', 'femoral', 'pulmonary',
                               'vena cava', 'capillaries'],
            'respiratory': ['lungs', 'bronchi', 'trachea', 'alveoli', 'diaphragm', 'pleura', 'bronchioles', 'larynx',
                            'pharynx'],
            'reproductive': ['uterus', 'ovary', 'testicle', 'prostate', 'vagina', 'penis', 'cervix', 'fallopian',
                             'endometrium', 'scrotum'],
            'endocrine': ['pituitary', 'thyroid', 'parathyroid', 'adrenal', 'pancreas', 'gonads'],
            'lymphatic': ['lymph nodes', 'spleen', 'thymus', 'tonsils', 'adenoids', 'bone marrow'],
        }

    def _initialize_condition_database(self):
        """Comprehensive medical conditions database"""
        self.condition_database = {
            # ==================== CARDIOVASCULAR DISEASES ====================
            'hypertension': {'symptoms': ['headache', 'dizziness', 'palpitations', 'visual changes', 'nosebleed'],
                             'severity': 7},
            'myocardial infarction': {
                'symptoms': ['chest pain', 'shortness of breath', 'nausea', 'diaphoresis', 'arm pain', 'jaw pain'],
                'severity': 10},
            'heart failure': {
                'symptoms': ['shortness of breath', 'edema', 'fatigue', 'orthopnea', 'nocturia', 'weight gain'],
                'severity': 9},
            'angina pectoris': {
                'symptoms': ['chest pain', 'shortness of breath', 'palpitations', 'arm pain', 'jaw pain'],
                'severity': 8},
            'arrhythmia': {'symptoms': ['palpitations', 'dizziness', 'syncope', 'chest pain', 'shortness of breath'],
                           'severity': 7},
            'deep vein thrombosis': {'symptoms': ['leg swelling', 'leg pain', 'redness', 'warmth', 'tenderness'],
                                     'severity': 8},
            'pulmonary embolism': {
                'symptoms': ['shortness of breath', 'chest pain', 'hemoptysis', 'syncope', 'tachycardia'],
                'severity': 10},
            'aortic dissection': {'symptoms': ['chest pain', 'back pain', 'syncope', 'hypertension', 'pulse deficit'],
                                  'severity': 10},
            'cardiomyopathy': {'symptoms': ['shortness of breath', 'fatigue', 'edema', 'palpitations', 'syncope'],
                               'severity': 8},
            'endocarditis': {'symptoms': ['fever', 'chills', 'heart murmur', 'fatigue', 'petechiae'], 'severity': 9},
            'pericarditis': {'symptoms': ['chest pain', 'fever', 'pericardial rub', 'dyspnea', 'tachycardia'],
                             'severity': 7},

            # ==================== RESPIRATORY DISEASES ====================
            'pneumonia': {'symptoms': ['cough', 'fever', 'shortness of breath', 'chest pain', 'sputum production'],
                          'severity': 8},
            'asthma': {
                'symptoms': ['wheezing', 'shortness of breath', 'cough', 'chest tightness', 'nocturnal symptoms'],
                'severity': 7},
            'COPD': {'symptoms': ['shortness of breath', 'cough', 'sputum production', 'wheezing', 'barrel chest'],
                     'severity': 8},
            'bronchitis': {'symptoms': ['cough', 'sputum production', 'shortness of breath', 'wheezing', 'fever'],
                           'severity': 6},
            'pneumothorax': {
                'symptoms': ['sudden chest pain', 'shortness of breath', 'tachypnea', 'decreased breath sounds'],
                'severity': 9},
            'lung cancer': {'symptoms': ['cough', 'hemoptysis', 'chest pain', 'weight loss', 'shortness of breath'],
                            'severity': 9},
            'pulmonary fibrosis': {
                'symptoms': ['shortness of breath', 'dry cough', 'fatigue', 'weight loss', 'clubbing'], 'severity': 8},
            'pleural effusion': {
                'symptoms': ['shortness of breath', 'pleuritic pain', 'dry cough', 'decreased breath sounds'],
                'severity': 7},
            'tuberculosis': {'symptoms': ['cough', 'fever', 'night sweats', 'weight loss', 'hemoptysis'],
                             'severity': 8},
            'cystic fibrosis': {
                'symptoms': ['chronic cough', 'recurrent infections', 'poor growth', 'clubbing', 'shortness of breath'],
                'severity': 8},

            # ==================== GASTROINTESTINAL DISEASES ====================
            'gastroenteritis': {'symptoms': ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever'],
                                'severity': 6},
            'peptic ulcer disease': {'symptoms': ['abdominal pain', 'nausea', 'bloating', 'heartburn', 'hematemesis'],
                                     'severity': 7},
            'gastroesophageal reflux disease': {
                'symptoms': ['heartburn', 'regurgitation', 'chest pain', 'dysphagia', 'chronic cough'], 'severity': 5},
            'inflammatory bowel disease': {
                'symptoms': ['abdominal pain', 'diarrhea', 'weight loss', 'fatigue', 'rectal bleeding'], 'severity': 7},
            'appendicitis': {'symptoms': ['abdominal pain', 'nausea', 'vomiting', 'fever', 'rebound tenderness'],
                             'severity': 9},
            'cholecystitis': {'symptoms': ['abdominal pain', 'nausea', 'vomiting', 'fever', 'murphy sign'],
                              'severity': 8},
            'pancreatitis': {'symptoms': ['abdominal pain', 'nausea', 'vomiting', 'fever', 'elevated amylase'],
                             'severity': 9},
            'hepatitis': {'symptoms': ['jaundice', 'fatigue', 'nausea', 'abdominal pain', 'dark urine'], 'severity': 7},
            'cirrhosis': {'symptoms': ['jaundice', 'ascites', 'fatigue', 'easy bruising', 'hepatic encephalopathy'],
                          'severity': 9},
            'irritable bowel syndrome': {
                'symptoms': ['abdominal pain', 'bloating', 'diarrhea', 'constipation', 'mucus in stool'],
                'severity': 4},
            'celiac disease': {'symptoms': ['diarrhea', 'weight loss', 'bloating', 'fatigue', 'malabsorption'],
                               'severity': 6},
            'diverticulitis': {'symptoms': ['abdominal pain', 'fever', 'nausea', 'constipation', 'diarrhea'],
                               'severity': 8},

            # ==================== NEUROLOGICAL DISEASES ====================
            'migraine': {'symptoms': ['headache', 'nausea', 'photophobia', 'visual aura', 'phonophobia'],
                         'severity': 7},
            'stroke': {'symptoms': ['facial droop', 'arm weakness', 'speech difficulty', 'vision changes', 'ataxia'],
                       'severity': 10},
            'epilepsy': {
                'symptoms': ['seizure', 'loss of consciousness', 'confusion', 'uncontrollable movements', 'aura'],
                'severity': 8},
            'multiple sclerosis': {'symptoms': ['numbness', 'weakness', 'vision problems', 'balance issues', 'fatigue'],
                                   'severity': 8},
            'meningitis': {'symptoms': ['headache', 'fever', 'stiff neck', 'photophobia', 'nausea'], 'severity': 9},
            'brain tumor': {'symptoms': ['headache', 'seizure', 'vision changes', 'nausea', 'personality changes'],
                            'severity': 9},
            "parkinson's disease": {
                'symptoms': ['tremor', 'rigidity', 'bradykinesia', 'postural instability', 'shuffling gait'],
                'severity': 7},
            "alzheimer's disease": {
                'symptoms': ['memory loss', 'confusion', 'personality changes', 'disorientation', 'language problems'],
                'severity': 8},
            'peripheral neuropathy': {
                'symptoms': ['numbness', 'tingling', 'burning pain', 'weakness', 'balance problems'], 'severity': 6},
            'bell palsy': {
                'symptoms': ['facial weakness', 'drooping mouth', 'eye problems', 'loss of taste', 'facial numbness'],
                'severity': 5},
            'guillain-barre syndrome': {
                'symptoms': ['weakness', 'tingling', 'back pain', 'difficulty walking', 'breathing problems'],
                'severity': 9},

            # ==================== ENDOCRINE/METABOLIC DISEASES ====================
            'diabetes mellitus': {'symptoms': ['polyuria', 'polydipsia', 'polyphagia', 'weight loss', 'fatigue'],
                                  'severity': 7},
            'hypothyroidism': {'symptoms': ['fatigue', 'weight gain', 'cold intolerance', 'constipation', 'dry skin'],
                               'severity': 6},
            'hyperthyroidism': {'symptoms': ['weight loss', 'heat intolerance', 'palpitations', 'anxiety', 'tremor'],
                                'severity': 7},
            'adrenal insufficiency': {
                'symptoms': ['fatigue', 'weight loss', 'hypotension', 'hyperpigmentation', 'salt craving'],
                'severity': 8},
            'cushing syndrome': {
                'symptoms': ['weight gain', 'moon face', 'buffalo hump', 'hypertension', 'glucose intolerance'],
                'severity': 7},
            'metabolic syndrome': {'symptoms': ['obesity', 'hypertension', 'glucose intolerance', 'dyslipidemia'],
                                   'severity': 7},
            'pituitary adenoma': {
                'symptoms': ['headache', 'vision changes', 'hormonal imbalances', 'fatigue', 'weight changes'],
                'severity': 7},

            # ==================== INFECTIOUS DISEASES ====================
            'influenza': {'symptoms': ['fever', 'cough', 'fatigue', 'body aches', 'headache'], 'severity': 6},
            'COVID-19': {'symptoms': ['fever', 'cough', 'shortness of breath', 'loss of taste', 'fatigue'],
                         'severity': 8},
            'tuberculosis': {'symptoms': ['cough', 'fever', 'night sweats', 'weight loss', 'hemoptysis'],
                             'severity': 8},
            'urinary tract infection': {'symptoms': ['dysuria', 'frequency', 'urgency', 'suprapubic pain', 'hematuria'],
                                        'severity': 5},
            'sepsis': {'symptoms': ['fever', 'chills', 'tachycardia', 'confusion', 'hypotension'], 'severity': 10},
            'HIV/AIDS': {'symptoms': ['fever', 'weight loss', 'night sweats', 'fatigue', 'lymphadenopathy'],
                         'severity': 9},
            'mononucleosis': {'symptoms': ['fatigue', 'fever', 'sore throat', 'lymphadenopathy', 'splenomegaly'],
                              'severity': 5},
            'hepatitis viral': {'symptoms': ['jaundice', 'fatigue', 'nausea', 'abdominal pain', 'dark urine'],
                                'severity': 7},
            'malaria': {'symptoms': ['fever', 'chills', 'headache', 'sweating', 'fatigue'], 'severity': 8},
            'lyme disease': {'symptoms': ['rash', 'fever', 'fatigue', 'joint pain', 'headache'], 'severity': 6},

            # ==================== MUSCULOSKELETAL DISEASES ====================
            'osteoarthritis': {'symptoms': ['joint pain', 'stiffness', 'swelling', 'limited mobility', 'crepitus'],
                               'severity': 6},
            'rheumatoid arthritis': {'symptoms': ['joint pain', 'morning stiffness', 'swelling', 'fatigue', 'fever'],
                                     'severity': 7},
            'gout': {'symptoms': ['joint pain', 'swelling', 'redness', 'tenderness', 'fever'], 'severity': 7},
            'osteoporosis': {'symptoms': ['back pain', 'height loss', 'fracture susceptibility', 'kyphosis'],
                             'severity': 6},
            'fibromyalgia': {
                'symptoms': ['widespread pain', 'fatigue', 'sleep disturbance', 'cognitive problems', 'tender points'],
                'severity': 5},
            'systemic lupus erythematosus': {'symptoms': ['rash', 'joint pain', 'fatigue', 'fever', 'photosensitivity'],
                                             'severity': 7},
            'ankylosing spondylitis': {
                'symptoms': ['back pain', 'morning stiffness', 'limited mobility', 'fatigue', 'eye inflammation'],
                'severity': 6},
            'carpal tunnel syndrome': {
                'symptoms': ['hand numbness', 'tingling', 'weakness', 'night symptoms', 'thenar atrophy'],
                'severity': 5},

            # ==================== DERMATOLOGICAL DISEASES ====================
            'eczema': {'symptoms': ['rash', 'pruritus', 'redness', 'dry skin', 'lichenification'], 'severity': 4},
            'psoriasis': {'symptoms': ['rash', 'scaling', 'pruritus', 'joint pain', 'nail changes'], 'severity': 5},
            'cellulitis': {'symptoms': ['redness', 'swelling', 'pain', 'fever', 'warmth'], 'severity': 7},
            'melanoma': {
                'symptoms': ['changing mole', 'skin lesion', 'asymmetry', 'border irregularity', 'color variation'],
                'severity': 9},
            'acne vulgaris': {'symptoms': ['pimples', 'blackheads', 'whiteheads', 'inflammation', 'scarring'],
                              'severity': 3},
            'rosacea': {'symptoms': ['facial redness', 'visible blood vessels', 'bumps', 'pustules', 'eye irritation'],
                        'severity': 3},
            'urticaria': {'symptoms': ['hives', 'wheals', 'pruritus', 'angioedema', 'flare-ups'], 'severity': 4},
            'shingles': {'symptoms': ['pain', 'rash', 'blisters', 'itching', 'fever'], 'severity': 6},

            # ==================== PSYCHIATRIC DISEASES ====================
            'major depressive disorder': {
                'symptoms': ['depression', 'anhedonia', 'fatigue', 'sleep disturbance', 'appetite changes'],
                'severity': 8},
            'generalized anxiety disorder': {
                'symptoms': ['anxiety', 'worry', 'restlessness', 'fatigue', 'muscle tension'], 'severity': 6},
            'bipolar disorder': {'symptoms': ['mood swings', 'depression', 'mania', 'irritability', 'racing thoughts'],
                                 'severity': 8},
            'schizophrenia': {
                'symptoms': ['hallucinations', 'delusions', 'disorganized speech', 'social withdrawal', 'flat affect'],
                'severity': 9},
            'obsessive-compulsive disorder': {
                'symptoms': ['obsessions', 'compulsions', 'anxiety', 'rituals', 'intrusive thoughts'], 'severity': 7},
            'post-traumatic stress disorder': {
                'symptoms': ['flashbacks', 'nightmares', 'anxiety', 'hypervigilance', 'avoidance'], 'severity': 7},
            'attention deficit hyperactivity disorder': {
                'symptoms': ['inattention', 'hyperactivity', 'impulsivity', 'distractibility', 'disorganization'],
                'severity': 5},
            'autism spectrum disorder': {
                'symptoms': ['social difficulties', 'communication challenges', 'repetitive behaviors',
                             'sensory issues'], 'severity': 6},
            'eating disorders': {'symptoms': ['weight changes', 'body image distortion', 'binge eating', 'purging',
                                              'restrictive eating'], 'severity': 8},

            # ==================== HEMATOLOGICAL DISEASES ====================
            'anemia': {'symptoms': ['fatigue', 'pallor', 'shortness of breath', 'dizziness', 'tachycardia'],
                       'severity': 6},
            'leukemia': {'symptoms': ['fatigue', 'fever', 'bruising', 'weight loss', 'bone pain'], 'severity': 9},
            'lymphoma': {'symptoms': ['lymphadenopathy', 'fever', 'night sweats', 'weight loss', 'pruritus'],
                         'severity': 8},
            'hemophilia': {'symptoms': ['easy bruising', 'prolonged bleeding', 'joint bleeding', 'muscle bleeding'],
                           'severity': 7},
            'sickle cell disease': {
                'symptoms': ['pain crisis', 'fatigue', 'jaundice', 'swelling hands feet', 'frequent infections'],
                'severity': 8},
            'thrombocytopenia': {'symptoms': ['easy bruising', 'petechiae', 'bleeding', 'nosebleeds', 'heavy periods'],
                                 'severity': 6},

            # ==================== RENAL DISEASES ====================
            'kidney stones': {'symptoms': ['flank pain', 'hematuria', 'nausea', 'urinary frequency', 'urgency'],
                              'severity': 8},
            'acute kidney injury': {'symptoms': ['oliguria', 'edema', 'fatigue', 'nausea', 'confusion'], 'severity': 9},
            'chronic kidney disease': {'symptoms': ['fatigue', 'edema', 'nausea', 'pruritus', 'muscle cramps'],
                                       'severity': 8},
            'glomerulonephritis': {'symptoms': ['hematuria', 'proteinuria', 'edema', 'hypertension', 'oliguria'],
                                   'severity': 7},
            'polycystic kidney disease': {
                'symptoms': ['abdominal pain', 'hematuria', 'hypertension', 'kidney enlargement', 'flank pain'],
                'severity': 7},

            # ==================== ONCOLOGICAL DISEASES ====================
            'breast cancer': {
                'symptoms': ['breast lump', 'nipple changes', 'skin changes', 'breast pain', 'axillary lump'],
                'severity': 9},
            'lung cancer': {'symptoms': ['cough', 'hemoptysis', 'chest pain', 'weight loss', 'shortness of breath'],
                            'severity': 9},
            'prostate cancer': {
                'symptoms': ['urinary symptoms', 'hematuria', 'bone pain', 'erectile dysfunction', 'weight loss'],
                'severity': 8},
            'colorectal cancer': {
                'symptoms': ['rectal bleeding', 'abdominal pain', 'change in bowel habits', 'weight loss', 'anemia'],
                'severity': 8},
            'pancreatic cancer': {'symptoms': ['abdominal pain', 'jaundice', 'weight loss', 'nausea', 'back pain'],
                                  'severity': 9},
            'ovarian cancer': {
                'symptoms': ['abdominal bloating', 'pelvic pain', 'urinary urgency', 'early satiety', 'weight loss'],
                'severity': 9},

            # ==================== AUTOIMMUNE DISEASES ====================
            'rheumatoid arthritis': {'symptoms': ['joint pain', 'morning stiffness', 'swelling', 'fatigue', 'fever'],
                                     'severity': 7},
            'lupus': {'symptoms': ['rash', 'joint pain', 'fatigue', 'fever', 'photosensitivity'], 'severity': 7},
            'multiple sclerosis': {'symptoms': ['numbness', 'weakness', 'vision problems', 'balance issues', 'fatigue'],
                                   'severity': 8},
            'type 1 diabetes': {'symptoms': ['polyuria', 'polydipsia', 'polyphagia', 'weight loss', 'fatigue'],
                                'severity': 7},
            'inflammatory bowel disease': {
                'symptoms': ['abdominal pain', 'diarrhea', 'weight loss', 'fatigue', 'rectal bleeding'], 'severity': 7},
            'hashimoto thyroiditis': {
                'symptoms': ['fatigue', 'weight gain', 'cold intolerance', 'constipation', 'depression'],
                'severity': 6},
            'graves disease': {'symptoms': ['weight loss', 'heat intolerance', 'palpitations', 'anxiety', 'tremor'],
                               'severity': 7},
        }

    def _initialize_medication_database(self):
        """Comprehensive medication database"""
        self.medication_database = {
            'analgesics': [
                'ibuprofen', 'acetaminophen', 'naproxen', 'aspirin', 'diclofenac',
                'celecoxib', 'tramadol', 'oxycodone', 'morphine', 'codeine',
                'hydrocodone', 'fentanyl', 'ketorolac', 'indomethacin', 'meloxicam',
                'nabumetone', 'etodolac', 'sulindac', 'piroxicam', 'ketoprofen'
            ],
            'antibiotics': [
                'amoxicillin', 'azithromycin', 'doxycycline', 'cephalexin', 'ciprofloxacin',
                'levofloxacin', 'clindamycin', 'metronidazole', 'vancomycin', 'penicillin',
                'augmentin', 'ceftriaxone', 'gentamicin', 'trimethoprim-sulfamethoxazole',
                'clarithromycin', 'erythromycin', 'tetracycline', 'minocycline', 'linezolid',
                'daptomycin', 'meropenem', 'imipenem', 'ertapenem', 'cefepime', 'ceftazidime'
            ],
            'antihypertensives': [
                'lisinopril', 'amlodipine', 'metoprolol', 'atenolol', 'losartan',
                'valsartan', 'hydrochlorothiazide', 'furosemide', 'spironolactone',
                'carvedilol', 'diltiazem', 'verapamil', 'clonidine', 'hydralazine',
                'enalapril', 'ramipril', 'quinapril', 'benazepril', 'irbesartan',
                'candesartan', 'olmesartan', 'nebivolol', 'bisoprolol', 'propranolol'
            ],
            'diabetes_medications': [
                'metformin', 'insulin', 'glipizide', 'glyburide', 'pioglitazone',
                'sitagliptin', 'empagliflozin', 'canagliflozin', 'liraglutide',
                'semaglutide', 'dapagliflozin', 'linagliptin', 'saxagliptin',
                'alogliptin', 'repaglinide', 'nateglinide', 'acarbose', 'miglitol'
            ],
            'psychiatric_medications': [
                'sertraline', 'fluoxetine', 'citalopram', 'escitalopram', 'venlafaxine',
                'duloxetine', 'bupropion', 'trazodone', 'alprazolam', 'lorazepam',
                'clonazepam', 'diazepam', 'quetiapine', 'risperidone', 'olanzapine',
                'aripiprazole', 'lithium', 'valproate', 'carbamazepine', 'lamotrigine',
                'haloperidol', 'ziprasidone', 'paliperidone', 'amisulpride'
            ],
            'gastrointestinal_medications': [
                'omeprazole', 'pantoprazole', 'esomeprazole', 'ranitidine', 'famotidine',
                'sucralfate', 'misoprostol', 'ondansetron', 'metoclopramide', 'loperamide',
                'diphenoxylate-atropine', 'docusate', 'bisacodyl', 'polyethylene glycol',
                'lansoprazole', 'rabeprazole', 'dexlansoprazole', 'bismuth subsalicylate',
                'simethicone', 'lubiprostone', 'linaclotide', 'plecanatide'
            ],
            'respiratory_medications': [
                'albuterol', 'ipratropium', 'fluticasone', 'budesonide', 'montelukast',
                'salmeterol', 'formoterol', 'tiotropium', 'prednisone', 'methylprednisolone',
                'levalbuterol', 'arbutamine', 'cromolyn', 'nedocromil', 'omalizumab',
                'mepolizumab', 'benralizumab', 'dupilumab', 'roflumilast'
            ],
            'cardiovascular_medications': [
                'atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'warfarin',
                'apixaban', 'rivaroxaban', 'dabigatran', 'clopidogrel', 'aspirin',
                'nitroglycerin', 'isosorbide', 'digoxin', 'amiodarone', 'flecainide',
                'propafenone', 'sotalol', 'adenosine', 'epinephrine', 'norepinephrine'
            ],
            'endocrine_medications': [
                'levothyroxine', 'methimazole', 'propylthiouracil', 'hydrocortisone',
                'prednisone', 'fludrocortisone', 'testosterone', 'estrogen', 'progesterone',
                'desmopressin', 'octreotide', 'bromocriptine', 'cabergoline', 'liothyronine'
            ],
            'antimicrobials': [
                'acyclovir', 'valacyclovir', 'fluconazole', 'itraconazole', 'voriconazole',
                'amphotericin B', 'pentamidine', 'pyrimethamine', 'sulfadiazine',
                'ganciclovir', 'valganciclovir', 'oseltamivir', 'zanamivir', 'ribavirin'
            ],
            'immunosuppressants': [
                'cyclosporine', 'tacrolimus', 'sirolimus', 'everolimus', 'mycophenolate',
                'azathioprine', 'methotrexate', 'cyclophosphamide', 'infliximab',
                'adalimumab', 'etanercept', 'rituximab', 'basiliximab', 'daclizumab'
            ],
            'hematological_medications': [
                'epoetin alfa', 'darbepoetin alfa', 'filgrastim', 'pegfilgrastim',
                'iron sucrose', 'ferrous sulfate', 'ferrous gluconate', 'warfarin',
                'enoxaparin', 'dalteparin', 'fondaparinux', 'tranexamic acid',
                'aminocaproic acid', 'desmopressin', 'factor VIII', 'factor IX'
            ]
        }

    def _initialize_emergency_keywords(self):
        """Comprehensive emergency detection system"""
        self.emergency_keywords = {
            'critical_emergency': [
                'chest pain', 'heart attack', 'cardiac arrest', 'unconscious', 'not breathing',
                'severe bleeding', 'stroke symptoms', 'anaphylaxis', 'suicidal', 'homicidal',
                'seizure lasting', 'severe trauma', 'suspected stroke', 'suspected heart attack',
                'respiratory arrest', 'cardiac arrest', 'major trauma', 'gunshot wound',
                'stab wound', 'major burns', 'electrocution', 'drowning', 'hanging',
                'severe allergic reaction', 'anaphylactic shock', 'status epilepticus',
                'coma', 'unresponsive', 'suspected meningitis', 'suspected sepsis',
                'aortic dissection', 'tension pneumothorax', 'cardiac tamponade',
                'massive hemoptysis', 'massive hematemesis', 'ectopic pregnancy rupture',
                'testicular torsion', 'orbital compartment syndrome', 'cauda equina syndrome',
                'neuroleptic malignant syndrome', 'serotonin syndrome', 'thyroid storm',
                'adrenal crisis', 'diabetic ketoacidosis', 'hyperosmolar hyperglycemic state'
            ],
            'urgent_emergency': [
                'difficulty breathing', 'moderate bleeding', 'high fever with rash',
                'severe pain', 'chemical exposure', 'eye injury', 'broken bone',
                'head injury with confusion', 'severe abdominal pain', 'testicular pain',
                'sudden vision loss', 'sudden hearing loss', 'facial droop', 'arm weakness',
                'speech difficulty', 'suspected fracture', 'dislocation', 'deep cut',
                'animal bite', 'human bite', 'severe burn', 'head injury with vomiting',
                'severe headache', 'worst headache of life', 'sudden severe headache',
                'foreign body aspiration', 'esophageal obstruction', 'acute urinary retention',
                'renal colic', 'biliary colic', 'acute glaucoma', 'retinal detachment',
                'orbital cellulitis', 'deep space neck infection', 'epiglottitis',
                'peritonsillar abscess', 'septic arthritis', 'compartment syndrome'
            ],
            'semi_urgent': [
                'persistent vomiting', 'dehydration', 'moderate pain', 'worsening infection',
                'allergic reaction', 'fever in infant', 'rash with fever', 'ear pain with fever',
                'sore throat with difficulty swallowing', 'urinary symptoms with fever',
                'abdominal pain with fever', 'back pain with fever', 'joint swelling with fever',
                'eye pain with redness', 'foreign body in eye', 'foreign body ingestion',
                'minor burns', 'sprains', 'mild head injury', 'dizziness with falling',
                'syncope with injury', 'palpitations with dizziness', 'moderate asthma attack',
                'migraine not responding to medication', 'cluster headache', 'acute vertigo',
                'bell palsy onset', 'shingles involving eye', 'cellulitis spreading'
            ],
            'primary_care_urgent': [
                'cough lasting', 'fever without rash', 'sore throat', 'ear pain',
                'sinus pain', 'back pain', 'joint pain', 'skin rash', 'urinary frequency',
                'constipation', 'diarrhea', 'heartburn', 'headache', 'dizziness',
                'fatigue', 'anxiety', 'depression', 'insomnia', 'allergy symptoms',
                'chronic pain', 'medication refill', 'preventive care', 'vaccination',
                'routine follow-up', 'stable chronic disease management'
            ]
        }

    def _initialize_lab_tests(self):
        """Comprehensive laboratory tests database"""
        self.lab_tests = {
            'blood_tests': [
                'complete blood count', 'CBC', 'hemoglobin', 'hematocrit', 'white blood cell count',
                'platelet count', 'basic metabolic panel', 'comprehensive metabolic panel',
                'sodium', 'potassium', 'chloride', 'bicarbonate', 'BUN', 'creatinine', 'glucose',
                'calcium', 'liver function tests', 'AST', 'ALT', 'alkaline phosphatase', 'bilirubin',
                'albumin', 'total protein', 'lipid panel', 'cholesterol', 'triglycerides', 'HDL', 'LDL',
                'thyroid function tests', 'TSH', 'T4', 'T3', 'hemoglobin A1c', 'HbA1c',
                'coagulation studies', 'PT', 'PTT', 'INR', 'troponin', 'BNP', 'CRP', 'ESR',
                'ferritin', 'iron studies', 'transferrin saturation', 'vitamin B12', 'folate',
                'magnesium', 'phosphorus', 'osmolality', 'lactic acid', 'ammonia', 'arterial blood gas'
            ],
            'urine_tests': [
                'urinalysis', 'urine culture', 'urine pregnancy test', 'microalbuminuria',
                'urine protein', 'urine creatinine', 'urine electrolytes', 'urine osmolality',
                'urine cytology', 'urine toxicology', '24-hour urine collection', 'urine protein electrophoresis'
            ],
            'imaging_studies': [
                'chest x-ray', 'abdominal x-ray', 'CT scan', 'MRI', 'ultrasound',
                'echocardiogram', 'electrocardiogram', 'ECG', 'EKG', 'stress test',
                'nuclear stress test', 'PET scan', 'bone scan', 'mammogram',
                'angiogram', 'venogram', 'myelogram', 'discogram', 'arthrogram',
                'hysterosalpingogram', 'intravenous pyelogram', 'barium swallow',
                'upper GI series', 'small bowel follow-through', 'barium enema'
            ],
            'microbiology_tests': [
                'blood culture', 'urine culture', 'sputum culture', 'stool culture',
                'throat culture', 'wound culture', 'COVID-19 test', 'influenza test',
                'strept test', 'monospot test', 'HIV test', 'hepatitis panel',
                'syphilis test', 'gonorrhea test', 'chlamydia test', 'tuberculosis test',
                'fungal culture', 'viral culture', 'parasite examination', 'gram stain'
            ],
            'specialized_tests': [
                'pulmonary function tests', 'spirometry', 'bronchoscopy', 'colonoscopy',
                'endoscopy', 'lumbar puncture', 'bone marrow biopsy', 'skin biopsy',
                'nerve conduction studies', 'electromyography', 'electroencephalogram',
                'polysomnography', 'tilt table test', 'cardiac catheterization'
            ]
        }

    def _initialize_procedures(self):
        """Comprehensive medical procedures database"""
        self.procedures = {
            'diagnostic_procedures': [
                'biopsy', 'endoscopy', 'colonoscopy', 'bronchoscopy', 'lumbar puncture',
                'paracentesis', 'thoracentesis', 'arthrocentesis', 'cardiac catheterization',
                'angiogram', 'myelogram', 'electroencephalogram', 'electromyography',
                'nerve conduction study', 'pulmonary function testing', 'exercise stress test',
                'echocardiogram', 'ultrasound', 'CT scan', 'MRI', 'PET scan',
                'mammography', 'bone density scan', 'hysteroscopy', 'cystoscopy'
            ],
            'surgical_procedures': [
                'appendectomy', 'cholecystectomy', 'hernia repair', 'colectomy',
                'gastrectomy', 'nephrectomy', 'hysterectomy', 'cesarean section',
                'coronary artery bypass', 'valve replacement', 'joint replacement',
                'spinal fusion', 'craniotomy', 'laparotomy', 'thoracotomy',
                'mastectomy', 'prostatectomy', 'thyroidectomy', 'parathyroidectomy',
                'cochlear implantation', 'cataract surgery', 'LASIK', 'rhinoplasty'
            ],
            'therapeutic_procedures': [
                'chemotherapy', 'radiation therapy', 'dialysis', 'plasmapheresis',
                'blood transfusion', 'intravenous fluids', 'wound debridement',
                'incision and drainage', 'suturing', 'casting', 'splinting',
                'physical therapy', 'occupational therapy', 'speech therapy',
                'cardiopulmonary resuscitation', 'defibrillation', 'cardioversion',
                'pacemaker implantation', 'ICD implantation', 'stent placement'
            ],
            'minimally_invasive_procedures': [
                'laparoscopy', 'arthroscopy', 'thoracoscopy', 'mediastinoscopy',
                'endoscopic retrograde cholangiopancreatography', 'ERCP',
                'percutaneous coronary intervention', 'angioplasty',
                'radiofrequency ablation', 'cryoablation', 'embolization',
                'vertebroplasty', 'kyphoplasty', 'needle aspiration'
            ]
        }

    def _initialize_medical_specialties(self):
        """Medical specialties and specialists database"""
        self.medical_specialties = {
            'cardiology': ['chest pain', 'palpitations', 'shortness of breath', 'edema', 'hypertension', 'syncope',
                           'arrhythmia'],
            'pulmonology': ['cough', 'shortness of breath', 'wheezing', 'hemoptysis', 'chest pain', 'pleuritic pain'],
            'gastroenterology': ['abdominal pain', 'nausea', 'vomiting', 'diarrhea', 'constipation', 'heartburn',
                                 'dysphagia', 'jaundice'],
            'neurology': ['headache', 'dizziness', 'seizure', 'numbness', 'weakness', 'memory loss', 'tremor',
                          'speech difficulty'],
            'endocrinology': ['weight changes', 'fatigue', 'heat intolerance', 'cold intolerance', 'polyuria',
                              'polydipsia', 'polyphagia'],
            'nephrology': ['edema', 'decreased urine output', 'hematuria', 'flank pain', 'hypertension',
                           'electrolyte imbalance'],
            'rheumatology': ['joint pain', 'swelling', 'stiffness', 'rash', 'fever', 'muscle pain', 'fatigue'],
            'dermatology': ['rash', 'pruritus', 'skin lesion', 'hair loss', 'nail changes', 'blister', 'ulcer'],
            'psychiatry': ['depression', 'anxiety', 'insomnia', 'hallucinations', 'mood swings', 'suicidal thoughts',
                           'panic attacks'],
            'urology': ['dysuria', 'hematuria', 'frequency', 'urgency', 'flank pain', 'erectile dysfunction',
                        'testicular pain'],
            'orthopedics': ['joint pain', 'back pain', 'fracture', 'swelling', 'limited mobility', 'trauma',
                            'sports injury'],
            'ophthalmology': ['vision changes', 'eye pain', 'red eye', 'diplopia', 'photophobia', 'floaters',
                              'flashes'],
            'otolaryngology': ['hearing loss', 'tinnitus', 'ear pain', 'sore throat', 'nasal congestion', 'hoarseness',
                               'dizziness'],
            'infectious_disease': ['fever', 'chills', 'night sweats', 'lymphadenopathy', 'rash with fever',
                                   'travel history'],
            'hematology': ['fatigue', 'bruising', 'bleeding', 'pallor', 'lymphadenopathy', 'abnormal blood counts'],
            'oncology': ['weight loss', 'fatigue', 'pain', 'lump', 'bleeding', 'lymphadenopathy', 'abnormal screening'],
            'allergy_immunology': ['allergic reactions', 'asthma', 'eczema', 'hives', 'food allergies',
                                   'immune deficiency'],
            'geriatrics': ['multiple chronic conditions', 'functional decline', 'cognitive impairment', 'polypharmacy',
                           'falls'],
            'pediatrics': ['childhood illnesses', 'developmental concerns', 'vaccinations', 'growth problems',
                           'congenital conditions']
        }

    def _initialize_medical_abbreviations(self):
        """Comprehensive medical abbreviations database"""
        self.medical_abbreviations = {
            'common_abbreviations': [
                'BP', 'HR', 'RR', 'T', 'SpO2', 'O2 sat', 'BMI', 'CBC', 'BMP', 'CMP',
                'LFTs', 'PT', 'PTT', 'INR', 'ECG', 'EKG', 'CT', 'MRI', 'US', 'XR',
                'Dx', 'Rx', 'Tx', 'Hx', 'Px', 'Sx', 'Fx', 'D/C', 'STAT', 'PRN'
            ],
            'diagnostic_abbreviations': [
                'CXR', 'AXR', 'KUB', 'CT head', 'CT chest', 'CT abdomen', 'MRI brain',
                'MRI spine', 'ECHO', 'PFTs', 'ABG', 'VQ scan', 'DEXA', 'Mammo'
            ],
            'condition_abbreviations': [
                'MI', 'CHF', 'COPD', 'DM', 'HTN', 'CVA', 'TIA', 'PNA', 'UTI',
                'GERD', 'IBD', 'IBS', 'CAD', 'AFib', 'VT', 'VFib', 'PE', 'DVT'
            ],
            'medication_abbreviations': [
                'PO', 'IV', 'IM', 'SC', 'PR', 'SL', 'OD', 'BID', 'TID', 'QID',
                'QHS', 'QOD', 'AC', 'PC', 'PRN', 'QD', 'QWK'
            ]
        }

    def _initialize_anatomical_terms(self):
        """Comprehensive anatomical terminology database"""
        self.anatomical_terms = {
            'planes': ['sagittal', 'coronal', 'transverse', 'axial', 'frontal', 'median'],
            'directions': ['superior', 'inferior', 'anterior', 'posterior', 'medial', 'lateral',
                           'proximal', 'distal', 'superficial', 'deep', 'ipsilateral', 'contralateral'],
            'movements': ['flexion', 'extension', 'abduction', 'adduction', 'rotation',
                          'circumduction', 'supination', 'pronation', 'inversion', 'eversion'],
            'body_regions': ['cranial', 'cervical', 'thoracic', 'lumbar', 'sacral', 'coccygeal',
                             'upper extremity', 'lower extremity', 'abdominopelvic'],
            'cavities': ['cranial cavity', 'spinal cavity', 'thoracic cavity', 'abdominal cavity',
                         'pelvic cavity', 'pleural cavity', 'pericardial cavity']
        }

    def _initialize_diagnostic_criteria(self):
        """Common diagnostic criteria for major conditions"""
        self.diagnostic_criteria = {
            'metabolic_syndrome': [
                'waist circumference >40 inches (men) or >35 inches (women)',
                'triglycerides ≥150 mg/dL',
                'HDL <40 mg/dL (men) or <50 mg/dL (women)',
                'blood pressure ≥130/85 mmHg',
                'fasting glucose ≥100 mg/dL'
            ],
            'systemic_inflammatory_response_syndrome': [
                'temperature >38°C or <36°C',
                'heart rate >90 beats/minute',
                'respiratory rate >20 breaths/minute or PaCO2 <32 mmHg',
                'white blood cell count >12,000/mm³ or <4,000/mm³ or >10% bands'
            ],
            'major_depressive_disorder': [
                'depressed mood most of the day',
                'markedly diminished interest or pleasure',
                'significant weight change or appetite disturbance',
                'insomnia or hypersomnia',
                'psychomotor agitation or retardation',
                'fatigue or loss of energy',
                'feelings of worthlessness or excessive guilt',
                'diminished ability to think or concentrate',
                'recurrent thoughts of death or suicide'
            ],
            'rheumatoid_arthritis': [
                'morning stiffness >1 hour',
                'arthritis of 3 or more joint areas',
                'arthritis of hand joints',
                'symmetric arthritis',
                'rheumatoid nodules',
                'serum rheumatoid factor positive',
                'radiographic changes'
            ]
        }

    def get_specialist_for_symptoms(self, symptoms):
        """Recommend specialist based on symptoms"""
        specialist_scores = {}

        for specialty, specialty_symptoms in self.medical_specialties.items():
            score = sum(1 for symptom in symptoms if symptom in specialty_symptoms)
            if score > 0:
                specialist_scores[specialty] = score

        return sorted(specialist_scores.items(), key=lambda x: x[1], reverse=True)

    def get_medication_categories_for_symptoms(self, symptoms):
        """Recommend medication categories based on symptoms"""
        category_scores = {}

        symptom_to_category = {
            'pain': 'analgesics',
            'fever': 'analgesics',
            'infection': 'antibiotics',
            'hypertension': 'antihypertensives',
            'diabetes': 'diabetes_medications',
            'anxiety': 'psychiatric_medications',
            'depression': 'psychiatric_medications',
            'nausea': 'gastrointestinal_medications',
            'vomiting': 'gastrointestinal_medications',
            'cough': 'respiratory_medications',
            'shortness of breath': 'respiratory_medications',
            'inflammation': 'immunosuppressants',
            'allergy': 'respiratory_medications',
            'bleeding': 'hematological_medications',
            'seizure': 'psychiatric_medications'
        }

        for symptom in symptoms:
            for key, category in symptom_to_category.items():
                if key in symptom.lower():
                    category_scores[category] = category_scores.get(category, 0) + 1

        return sorted(category_scores.items(), key=lambda x: x[1], reverse=True)

    def get_emergency_level(self, symptoms):
        """Determine emergency level based on symptoms"""
        emergency_level = 'non_urgent'

        for level, keywords in self.emergency_keywords.items():
            for keyword in keywords:
                if any(keyword in symptom.lower() for symptom in symptoms):
                    if level == 'critical_emergency':
                        return 'critical_emergency'
                    elif level == 'urgent_emergency' and emergency_level != 'critical_emergency':
                        emergency_level = 'urgent_emergency'
                    elif level == 'semi_urgent' and emergency_level not in ['critical_emergency', 'urgent_emergency']:
                        emergency_level = 'semi_urgent'

        return emergency_level


# Usage example:
if __name__ == "__main__":
    medical_db = ComprehensiveMedicalDatabases()
    print(f"📊 Symptoms database: {len(medical_db.symptom_database)} symptoms")
    print(f"🏥 Conditions database: {len(medical_db.condition_database)} conditions")
    print(f"💊 Medication categories: {len(medical_db.medication_database)} categories")
    print(f"🔬 Lab tests: {len(medical_db.lab_tests)} categories")
    print(f"🩺 Medical specialties: {len(medical_db.medical_specialties)} specialties")
    print(f"📝 Medical abbreviations: {len(medical_db.medical_abbreviations)} categories")
    print(f"🧬 Anatomical terms: {len(medical_db.anatomical_terms)} categories")
    print(f"📋 Diagnostic criteria: {len(medical_db.diagnostic_criteria)} conditions")

    # Test the enhanced functionality
    test_symptoms = ['chest pain', 'shortness of breath', 'dizziness']
    print(f"\n🔍 Testing with symptoms: {test_symptoms}")
    print(f"🚨 Emergency level: {medical_db.get_emergency_level(test_symptoms)}")
    print(f"👨‍⚕️ Recommended specialists: {medical_db.get_specialist_for_symptoms(test_symptoms)}")
    print(f"💊 Recommended medication categories: {medical_db.get_medication_categories_for_symptoms(test_symptoms)}")