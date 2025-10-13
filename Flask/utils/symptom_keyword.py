from typing import Dict

class SymptomKeyword:

    def _load_comprehensive_symptom_keywords(self) -> Dict:
        """Load comprehensive symptom keywords with medical terminology"""
        return {
            # Pain-related symptoms
            'itching': [
                'itching', 'itchy', 'scratching', 'pruritus', 'skin itching',
                'irritated skin', 'itchy skin', 'itchy feeling', 'uncontrollable itching'
            ],
            'skin_rash': [
                'rash', 'skin rash', 'red spots', 'skin irritation', 'dermatitis',
                'eczema', 'hives', 'urticaria', 'skin eruption', 'bumps on skin',
                'skin redness', 'skin inflammation'
            ],
            'nodal_skin_eruptions': [
                'skin nodules', 'nodular rash', 'skin bumps', 'lumpy skin',
                'nodular eruptions', 'skin lesions', 'raised skin bumps'
            ],
            'continuous_sneezing': [
                'sneezing', 'continuous sneezing', 'frequent sneezing',
                'sneezing fits', 'persistent sneezing', 'allergic sneezing'
            ],
            'shivering': [
                'shivering', 'shaking', 'trembling', 'chills', 'rigors',
                'uncontrollable shaking', 'body shakes'
            ],
            'chills': [
                'chills', 'cold chills', 'shivering', 'feeling cold', 'goosebumps',
                'cold sweats', 'fever chills'
            ],
            'joint_pain': [
                'joint pain', 'arthralgia', 'arthritis', 'achy joints',
                'joint stiffness', 'painful joints', 'knee pain', 'hip pain',
                'shoulder pain', 'elbow pain', 'wrist pain', 'ankle pain'
            ],
            'stomach_pain': [
                'stomach pain', 'abdominal pain', 'belly ache', 'tummy pain',
                'gastralgia', 'stomach cramps', 'abdominal cramps'
            ],
            'acidity': [
                'acid reflux', 'heartburn', 'indigestion', 'gastric acidity',
                'stomach acid', 'burning stomach', 'hyperacidity'
            ],
            'ulcers_on_tongue': [
                'tongue ulcers', 'mouth ulcers', 'oral ulcers', 'tongue sores',
                'canker sores', 'painful tongue', 'tongue lesions'
            ],
            'muscle_wasting': [
                'muscle loss', 'muscle atrophy', 'shrinking muscles',
                'weak muscles', 'muscle degeneration', 'reduced muscle mass'
            ],
            'vomiting': [
                'vomiting', 'throwing up', 'puking', 'emesis', 'nausea',
                'retching', 'heaving', 'regurgitation'
            ],
            'burning_micturition': [
                'burning urination', 'painful urination', 'dysuria',
                'urinary discomfort', 'stinging urine', 'urethral burning'
            ],
            'spotting_urination': [
                'spotting urine', 'blood in urine', 'hematuria',
                'pink urine', 'red urine', 'discolored urine'
            ],
            'fatigue': [
                'tiredness', 'exhaustion', 'lethargy', 'weakness',
                'low energy', 'weariness', 'constant tiredness'
            ],
            'weight_gain': [
                'gaining weight', 'increased weight', 'obesity',
                'putting on weight', 'unexplained weight gain'
            ],
            'anxiety': [
                'nervousness', 'worry', 'panic', 'apprehension',
                'uneasiness', 'stress', 'tension'
            ],
            'cold_hands_and_feets': [
                'cold extremities', 'cold fingers', 'cold toes',
                'poor circulation', 'chilly hands', 'chilly feet'
            ],
            'mood_swings': [
                'mood changes', 'emotional instability', 'irritability',
                'temper swings', 'emotional lability'
            ],
            'weight_loss': [
                'losing weight', 'unintentional weight loss', 'wasting',
                'reduced weight', 'emaciation'
            ],
            'restlessness': [
                'agitation', 'nervous energy', 'can\'t sit still',
                'fidgeting', 'uneasiness'
            ],
            'lethargy': [
                'sluggishness', 'drowsiness', 'listlessness',
                'lack of energy', 'apathy'
            ],
            'patches_in_throat': [
                'throat patches', 'white patches throat', 'oral thrush',
                'throat spots', 'throat lesions'
            ],
            'irregular_sugar_level': [
                'blood sugar fluctuations', 'diabetes symptoms',
                'hypoglycemia', 'hyperglycemia', 'unstable glucose'
            ],
            'cough': [
                'coughing', 'hacking cough', 'dry cough', 'wet cough',
                'persistent cough', 'chronic cough'
            ],
            'high_fever': [
                'fever', 'pyrexia', 'elevated temperature', 'hyperthermia',
                'febrile', 'temperature spike'
            ],
            'sunken_eyes': [
                'hollow eyes', 'dark circles', 'eye sockets',
                'dehydrated eyes', 'tired eyes'
            ],
            'breathlessness': [
                'shortness of breath', 'dyspnea', 'labored breathing',
                'air hunger', 'can\'t catch breath'
            ],
            'sweating': [
                'perspiration', 'excessive sweating', 'diaphoresis',
                'night sweats', 'clammy skin'
            ],
            'dehydration': [
                'dry mouth', 'thirst', 'fluid loss', 'dry skin',
                'low hydration', 'tenting skin'
            ],
            'indigestion': [
                'dyspepsia', 'upset stomach', 'bloating', 'gassiness',
                'stomach discomfort', 'digestive problems'
            ],
            'headache': [
                'head pain', 'migraine', 'cephalgia', 'tension headache',
                'sinus headache', 'throbbing head'
            ],
            'yellowish_skin': [
                'jaundice', 'yellow skin', 'icterus', 'yellow tint',
                'liver discoloration'
            ],
            'dark_urine': [
                'brown urine', 'tea-colored urine', 'concentrated urine',
                'liver urine', 'bilirubin urine'
            ],
            'nausea': [
                'queasiness', 'sick to stomach', 'feeling vomit',
                'morning sickness', 'gastric upset'
            ],
            'loss_of_appetite': [
                'anorexia', 'not hungry', 'reduced appetite',
                'food aversion', 'lack of hunger'
            ],
            'pain_behind_the_eyes': [
                'eye socket pain', 'orbital pain', 'eye pressure',
                'ocular pain', 'retro-orbital pain'
            ],
            'back_pain': [
                'spinal pain', 'lumbar pain', 'dorsalgia', 'sciatica',
                'vertebral pain', 'disc pain'
            ],
            'constipation': [
                'irregularity', 'hard stools', 'infrequent bowel movements',
                'straining', 'bowel obstruction'
            ],
            'abdominal_pain': [
                'stomach ache', 'belly pain', 'tummy ache',
                'intestinal pain', 'gut pain'
            ],
            'diarrhoea': [
                'loose stools', 'watery diarrhea', 'frequent bowel movements',
                'the runs', 'intestinal upset'
            ],
            'mild_fever': [
                'low-grade fever', 'slight temperature', 'subfebrile',
                'warmth', 'elevated temperature'
            ],
            'yellow_urine': [
                'dark yellow urine', 'amber urine', 'concentrated urine',
                'urobilin urine', 'dehydration urine'
            ],
            'yellowing_of_eyes': [
                'scleral icterus', 'yellow eyes', 'jaundice eyes',
                'liver eyes', 'bilirubin eyes'
            ],
            'acute_liver_failure': [
                'liver shutdown', 'hepatic failure', 'liver dysfunction',
                'jaundice', 'hepatic encephalopathy'
            ],
            'fluid_overload': [
                'edema', 'swelling', 'water retention', 'puffiness',
                'fluid accumulation'
            ],
            'swelling_of_stomach': [
                'abdominal distension', 'bloated stomach', 'ascites',
                'protruding belly', 'swollen abdomen'
            ],
            'swelled_lymph_nodes': [
                'lymphadenopathy', 'swollen glands', 'enlarged lymph nodes',
                'node swelling', 'neck lumps'
            ],
            'malaise': [
                'general discomfort', 'uneasiness', 'feeling unwell',
                'body aches', 'flu-like symptoms'
            ],
            'blurred_and_distorted_vision': [
                'blurry vision', 'visual distortion', 'double vision',
                'fuzzy sight', 'eye focus problems'
            ],
            'phlegm': [
                'sputum', 'mucus', 'chest mucus', 'respiratory secretions',
                'coughed up phlegm'
            ],
            'throat_irritation': [
                'sore throat', 'scratchy throat', 'throat tickle',
                'throat discomfort', 'pharyngeal irritation'
            ],
            'redness_of_eyes': [
                'bloodshot eyes', 'conjunctival redness', 'pink eye',
                'ocular redness', 'eye inflammation'
            ],
            'sinus_pressure': [
                'sinus pain', 'facial pressure', 'sinus headache',
                'nasal congestion', 'sinus congestion'
            ],
            'runny_nose': [
                'rhinorrhea', 'nasal discharge', 'dripping nose',
                'postnasal drip', 'watery nose'
            ],
            'congestion': [
                'nasal blockage', 'stuffy nose', 'sinus blockage',
                'breathing difficulty', 'nose obstruction'
            ],
            'chest_pain': [
                'thoracic pain', 'heart pain', 'angina', 'pleuritic pain',
                'chest tightness', 'sternum pain'
            ],
            'weakness_in_limbs': [
                'limb weakness', 'arm weakness', 'leg weakness',
                'muscle weakness', 'reduced strength'
            ],
            'fast_heart_rate': [
                'tachycardia', 'palpitations', 'racing heart',
                'heart pounding', 'rapid pulse'
            ],
            'pain_during_bowel_movements': [
                'defecation pain', 'painful poop', 'rectal pain',
                'anal pain', 'straining pain'
            ],
            'pain_in_anal_region': [
                'anal discomfort', 'rectal discomfort', 'anus pain',
                'perianal pain', 'hemorrhoid pain'
            ],
            'bloody_stool': [
                'hematochezia', 'rectal bleeding', 'blood in stool',
                'maroon stool', 'tarry stool'
            ],
            'irritation_in_anus': [
                'anal itching', 'perianal irritation', 'anus discomfort',
                'rectal itching', 'hemorrhoid irritation'
            ],
            'neck_pain': [
                'cervical pain', 'stiff neck', 'neck stiffness',
                'crick in neck', 'torticollis'
            ],
            'dizziness': [
                'vertigo', 'lightheadedness', 'unsteadiness',
                'wooziness', 'room spinning'
            ],
            'cramps': [
                'muscle cramps', 'spasms', 'charley horse',
                'abdominal cramps', 'menstrual cramps'
            ],
            'bruising': [
                'ecchymosis', 'contusions', 'black and blue marks',
                'easy bruising', 'skin discoloration'
            ],
            'obesity': [
                'overweight', 'excess weight', 'high BMI',
                'adiposity', 'morbid obesity'
            ],
            'swollen_legs': [
                'leg edema', 'puffy legs', 'ankle swelling',
                'fluid legs', 'dependent edema'
            ],
            'swollen_blood_vessels': [
                'varicose veins', 'spider veins', 'vascular distension',
                'visible veins', 'phlebitis'
            ],
            'puffy_face_and_eyes': [
                'facial edema', 'periorbital edema', 'moon face',
                'swollen face', 'eye puffiness'
            ],
            'enlarged_thyroid': [
                'goiter', 'thyroid swelling', 'neck bulge',
                'thyroid enlargement', 'thyromegaly'
            ],
            'brittle_nails': [
                'weak nails', 'splitting nails', 'fragile nails',
                'ridged nails', 'nail abnormalities'
            ],
            'swollen_extremeties': [
                'peripheral edema', 'swollen arms', 'swollen hands',
                'swollen feet', 'limb swelling'
            ],
            'excessive_hunger': [
                'polyphagia', 'ravenous hunger', 'constant eating',
                'insatiable appetite', 'hyperphagia'
            ],
            'extra_marital_contacts': [
                'unprotected sex', 'multiple partners', 'high-risk behavior',
                'sexual exposure', 'STD risk'
            ],
            'drying_and_tingling_lips': [
                'chapped lips', 'lip numbness', 'lip paresthesia',
                'xerostomia', 'dry mouth'
            ],
            'slurred_speech': [
                'dysarthria', 'mumbled speech', 'unclear speech',
                'speech difficulty', 'articulation problems'
            ],
            'knee_pain': [
                'arthritic knee', 'patellar pain', 'knee discomfort',
                'knee swelling', 'knee joint pain'
            ],
            'hip_joint_pain': [
                'coxalgia', 'hip discomfort', 'groin pain',
                'hip arthritis', 'hip stiffness'
            ],
            'muscle_weakness': [
                'myasthenia', 'reduced strength', 'fatigued muscles',
                'difficulty lifting', 'weak limbs'
            ],
            'stiff_neck': [
                'neck rigidity', 'limited neck movement', 'cervical stiffness',
                'nuchal rigidity', 'painful neck movement'
            ],
            'swelling_joints': [
                'joint edema', 'puffy joints', 'arthritic swelling',
                'inflamed joints', 'joint effusion'
            ],
            'movement_stiffness': [
                'bradykinesia', 'rigidity', 'slowed movement',
                'muscle stiffness', 'parkinsonism'
            ],
            'spinning_movements': [
                'vertigo', 'dizziness', 'room spinning',
                'rotational vertigo', 'vestibular symptoms'
            ],
            'loss_of_balance': [
                'ataxia', 'unsteadiness', 'falling tendency',
                'coordination problems', 'gait disturbance'
            ],
            'unsteadiness': [
                'balance problems', 'disequilibrium', 'staggering',
                'off balance', 'postural instability'
            ],
            'weakness_of_one_body_side': [
                'hemiparesis', 'one-sided weakness', 'arm leg weakness',
                'facial droop', 'stroke symptoms'
            ],
            'loss_of_smell': [
                'anosmia', 'no smell', 'reduced olfaction',
                'can\'t smell', 'olfactory dysfunction'
            ],
            'bladder_discomfort': [
                'cystitis', 'urinary discomfort', 'bladder pain',
                'pelvic discomfort', 'interstitial cystitis'
            ],
            'foul_smell_of_urine': [
                'strong urine odor', 'malodorous urine', 'urine stench',
                'ammonia smell', 'concentrated urine smell'
            ],
            'continuous_feel_of_urine': [
                'urinary urgency', 'frequent urination', 'overactive bladder',
                'constant need to urinate', 'bladder pressure'
            ],
            'passage_of_gases': [
                'flatulence', 'gas', 'bloating', 'farting',
                'intestinal gas', 'belching'
            ],
            'internal_itching': [
                'visceral itching', 'deep itching', 'internal pruritus',
                'systemic itching', 'whole body itch'
            ],
            'toxic_look_(typhos)': [
                'toxic appearance', 'septic look', 'febrile appearance',
                'ill appearance', 'systemic illness look'
            ],
            'depression': [
                'low mood', 'sadness', 'hopelessness', 'melancholy',
                'depressive symptoms', 'mood disorder'
            ],
            'irritability': [
                'moodiness', 'short temper', 'anger', 'frustration',
                'agitation', 'emotional lability'
            ],
            'muscle_pain': [
                'myalgia', 'muscle soreness', 'body aches',
                'fibromyalgia', 'muscle tenderness'
            ],
            'altered_sensorium': [
                'confusion', 'disorientation', 'mental status changes',
                'delirium', 'cognitive impairment'
            ],
            'red_spots_over_body': [
                'petechiae', 'rash', 'skin spots', 'erythema',
                'maculopapular rash', 'skin redness'
            ],
            'belly_pain': [
                'abdominal pain', 'stomach ache', 'tummy pain',
                'gastric pain', 'intestinal pain'
            ],
            'abnormal_menstruation': [
                'irregular periods', 'menstrual irregularities', 'heavy bleeding',
                'missed periods', 'dysmenorrhea'
            ],
            'dischromic_patches': [
                'skin discoloration', 'hyperpigmentation', 'hypopigmentation',
                'uneven skin tone', 'skin patches'
            ],
            'watering_from_eyes': [
                'epiphora', 'tearing', 'watery eyes', 'eye discharge',
                'lachrymation', 'excess tears'
            ],
            'increased_appetite': [
                'hyperphagia', 'excessive hunger', 'constant eating',
                'polyphagia', 'ravenous appetite'
            ],
            'polyuria': [
                'excessive urination', 'frequent urination', 'large urine volume',
                'nocturia', 'urinary frequency'
            ],
            'family_history': [
                'genetic predisposition', 'hereditary condition', 'family medical history',
                'inherited disease', 'familial disorder'
            ],
            'mucoid_sputum': [
                'mucus production', 'phlegm', 'respiratory secretions',
                'white sputum', 'clear sputum'
            ],
            'rusty_sputum': [
                'blood-tinged sputum', 'brown sputum', 'hemoptysis',
                'pneumonia sputum', 'discolored phlegm'
            ],
            'lack_of_concentration': [
                'attention problems', 'focus issues', 'distractibility',
                'mental fog', 'cognitive difficulties'
            ],
            'visual_disturbances': [
                'vision problems', 'eye issues', 'sight abnormalities',
                'visual changes', 'ocular symptoms'
            ],
            'receiving_blood_transfusion': [
                'transfusion history', 'blood products', 'donor blood',
                'transfusion reaction', 'blood administration'
            ],
            'receiving_unsterile_injections': [
                'contaminated needles', 'dirty injections', 'infection risk',
                'needle sharing', 'unsafe injections'
            ],
            'coma': [
                'unconsciousness', 'unresponsiveness', 'altered consciousness',
                'vegetative state', 'loss of consciousness'
            ],
            'stomach_bleeding': [
                'gastrointestinal bleeding', 'GI bleed', 'hematemesis',
                'melena', 'bloody vomit'
            ],
            'distention_of_abdomen': [
                'abdominal swelling', 'bloating', 'protuberant abdomen',
                'abdominal distension', 'swollen belly'
            ],
            'history_of_alcohol_consumption': [
                'alcohol use', 'drinking history', 'ethanol consumption',
                'alcohol abuse', 'chronic drinking'
            ],
            'blood_in_sputum': [
                'hemoptysis', 'coughing blood', 'blood-streaked sputum',
                'pulmonary bleeding', 'respiratory bleeding'
            ],
            'prominent_veins_on_calf': [
                'varicose veins', 'visible veins', 'venous distension',
                'leg veins', 'vascular prominence'
            ],
            'palpitations': [
                'heart fluttering', 'irregular heartbeat', 'skipped beats',
                'heart awareness', 'cardiac sensations'
            ],
            'painful_walking': [
                'difficulty walking', 'ambulation pain', 'gait pain',
                'limping', 'movement discomfort'
            ],
            'pus_filled_pimples': [
                'pustules', 'acne', 'skin abscess', 'boils',
                'infected pimples', 'skin infection'
            ],
            'blackheads': [
                'comedones', 'clogged pores', 'open comedones',
                'skin blemishes', 'acne spots'
            ],
            'scurring': [
                'skin scabs', 'healing wounds', 'crusting',
                'scar formation', 'wound healing'
            ],
            'skin_peeling': [
                'desquamation', 'flaking skin', 'exfoliation',
                'dry peeling', 'skin shedding'
            ],
            'silver_like_dusting': [
                'scaly skin', 'silver scales', 'psoriasis',
                'dandruff', 'skin flakes'
            ],
            'small_dents_in_nails': [
                'nail pitting', 'nail abnormalities', 'pitted nails',
                'nail deformities', 'psoriatic nails'
            ],
            'inflammatory_nails': [
                'paronychia', 'nail infection', 'red nails',
                'swollen nail beds', 'nail inflammation'
            ],
            'blister': [
                'vesicles', 'skin bubbles', 'fluid-filled lesions',
                'burns', 'friction blisters'
            ],
            'red_sore_around_nose': [
                'nasal sores', 'nose irritation', 'perinasal rash',
                'nose redness', 'nasal dermatitis'
            ],
            'yellow_crust_ooze': [
                'impetigo', 'skin infection', 'weeping sores',
                'honey-colored crust', 'bacterial skin infection'
            ],
            'prognosis': [
                'outcome', 'disease course', 'recovery chance',
                'survival rate', 'medical outlook'
            ]
        }
