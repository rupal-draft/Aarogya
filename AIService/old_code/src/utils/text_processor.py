import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import spacy
import warnings
from tqdm import tqdm

from old_code.src.models.medical_databases import ComprehensiveMedicalDatabases

warnings.filterwarnings('ignore')

# Download required NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')


class TextProcessor:
    """Fully integrated medical text processor using ALL database components"""

    def __init__(self, medical_databases):
        print("🧠 Initializing Fully Integrated TextProcessor...")
        self.medical_databases = medical_databases
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        self.medical_stop_words = self._initialize_medical_stop_words()
        self.nlp = self._load_spacy_model()
        self.processed_count = 0

        # Initialize ALL medical terminology patterns
        self._initialize_comprehensive_medical_patterns()
        print("✅ Fully Integrated TextProcessor initialized successfully!\n")

    def _load_spacy_model(self):
        """Load spaCy model with enhanced medical capabilities"""
        print("🔍 Loading spaCy model...")
        try:
            nlp = spacy.load("en_core_web_sm")

            # Add custom pipeline components for medical text
            if not nlp.has_pipe("medical_sentence_segmenter"):
                nlp.add_pipe("sentencizer")

            print("✅ spaCy model 'en_core_web_sm' loaded successfully with medical enhancements!\n")
            return nlp
        except OSError:
            print("⚠️ spaCy English model not found. Using enhanced NLTK processing.\n")
            return None

    def _initialize_medical_stop_words(self):
        """Initialize medical-specific stop words"""
        medical_stop_words = {
            'patient', 'patients', 'medical', 'medicine', 'medication', 'doctor', 'physician',
            'hospital', 'clinic', 'health', 'healthcare', 'treatment', 'therapy', 'diagnosis',
            'symptom', 'symptoms', 'condition', 'disease', 'illness', 'disorder', 'syndrome',
            'report', 'history', 'physical', 'examination', 'findings', 'assessment', 'plan'
        }
        return medical_stop_words

    def _initialize_comprehensive_medical_patterns(self):
        """Initialize comprehensive regex patterns for ALL medical entities"""
        self.medical_patterns = {
            'symptom_patterns': [
                r'(?:experiencing|having|suffering from|complaining of|reports?)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'symptoms?\s+(?:of|include|are)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'presents?\s+with\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'chief\s+complaint\s*:\s*([^\.]+?)(?:\.|\n)',
                r'complains?\s+of\s+([^\.]+?)(?:\.|\band\b|\,)'
            ],
            'condition_patterns': [
                r'diagnosed with\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'suffering from\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'history of\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'\b(?:has|had)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'confirmed\s+([^\.]+?)(?:\s+diagnosis)',
                r'rule out\s+([^\.]+?)(?:\.|\band\b|\,)'
            ],
            'medication_patterns': [
                r'taking\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'prescribed\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'medications?\s*:\s*([^\.]+?)(?:\.|\n)',
                r'\b(?:on|using)\s+([^\.]+?)(?:\s+therapy|\s+treatment)',
                r'current meds?\s*:\s*([^\.]+?)(?:\.|\n)'
            ],
            'lab_test_patterns': [
                r'(?:lab|test|study)\s+(?:results?|shows?|reveals?)\s*:\s*([^\.]+?)(?:\.|\n)',
                r'(?:elevated|low|high|abnormal)\s+([^\.]+?)(?:\s+levels?)',
                r'(?:blood|urine|stool)\s+(?:test|work[-\s]?up)\s+([^\.]+?)(?:\.|\n)',
                r'\b(CBC|BMP|CMP|LFTs|TSH|HbA1c|ECG|EKG|CT|MRI|X-ray|XR)\b',
                r'(?:ordered|performed)\s+([^\.]+?)(?:\s+test)',
                r'results?\s+(?:of|for)\s+([^\.]+?)(?:\.|\n)'
            ],
            'procedure_patterns': [
                r'(?:underwent|had|performed)\s+([^\.]+?)(?:\s+procedure)',
                r'(?:surgical|operative)\s+(?:procedure|intervention)\s+([^\.]+?)(?:\.|\n)',
                r'\b(biopsy|endoscopy|colonoscopy|surgery|catheterization|angiogram)\b',
                r'(?:diagnostic|therapeutic)\s+([^\.]+?)(?:\.|\n)',
                r'(?:scheduled|planned)\s+for\s+([^\.]+?)(?:\.|\n)'
            ],
            'abbreviation_patterns': [
                r'\b([A-Z]{2,4})\b',  # Capitalized abbreviations (2-4 letters)
                r'(\w+)\s*\(\s*([A-Z]{2,4})\s*\)',  # Abbreviations in parentheses
                r'\b([A-Z][a-z]+)\s+\(([A-Z]{2,4})\)',  # Full form with abbreviation
            ],
            'anatomical_patterns': [
                r'(?:pain|discomfort|tenderness)\s+(?:in|at)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'(?:located|situated)\s+(?:in|at)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'\b(superior|inferior|anterior|posterior|medial|lateral)\s+([^\.]+?)(?:\.|\band\b|\,)',
                r'(?:right|left)\s+([^\.]+?)(?:\.|\band\b|\,)'
            ],
            'severity_patterns': [
                r'(mild|moderate|severe|extreme)\s+(pain|discomfort|symptoms?)',
                r'(sharp|dull|throbbing|stabbing|burning)\s+(pain|discomfort)',
                r'(worsening|improving|stable)\s+(symptoms?|condition)',
                r'(acute|chronic|subacute)\s+(symptoms?|condition)'
            ],
            'temporal_patterns': [
                r'(\d+)\s*(?:days?|weeks?|months?|years?)\s+(?:ago|duration)',
                r'sudden\s+onset',
                r'gradual\s+onset',
                r'intermittent|constant'
            ]
        }

    def advanced_clean_text(self, text, preserve_medical_terms=True, remove_stopwords=True):
        """Advanced medical text cleaning with intelligent term preservation"""
        self.processed_count += 1

        # Show progress every 1000 texts
        if self.processed_count % 1000 == 0:
            print(f"📊 Processed {self.processed_count} texts...")

        if pd.isna(text) or text == "":
            return ""

        # Initial cleaning
        text = str(text).lower().strip()

        # Remove specific unwanted patterns while preserving medical content
        text = re.sub(r'\[\s*\]|\(\s*\)|\{\s*\}', ' ', text)  # Remove empty brackets
        text = re.sub(r'\b(?:please|thank you|hello|hi|dear)\b', ' ', text)  # Remove greetings
        text = re.sub(r'\s+', ' ', text)  # Normalize whitespace

        # Advanced processing with spaCy if available
        if self.nlp and len(text) > 10:  # Only use spaCy for substantial text
            doc = self.nlp(text)
            processed_tokens = []

            for token in doc:
                # Skip stopwords if requested
                if remove_stopwords and (token.is_stop or token.text in self.medical_stop_words):
                    continue

                # Skip punctuation
                if token.is_punct:
                    continue

                # Preserve medical entities and important terms
                if preserve_medical_terms:
                    # Keep medical terms in their original form
                    if self._is_medical_term(token.text):
                        processed_tokens.append(token.text)
                    else:
                        # Lemmatize non-medical terms
                        processed_tokens.append(token.lemma_)
                else:
                    processed_tokens.append(token.lemma_)

            cleaned_text = ' '.join(processed_tokens)
        else:
            # Fallback to NLTK processing
            tokens = word_tokenize(text)
            processed_tokens = []

            for token in tokens:
                if remove_stopwords and (token in self.stop_words or token in self.medical_stop_words):
                    continue

                if token.isalpha():  # Only process alphabetic tokens
                    if preserve_medical_terms and self._is_medical_term(token):
                        processed_tokens.append(token)
                    else:
                        processed_tokens.append(self.lemmatizer.lemmatize(token))

            cleaned_text = ' '.join(processed_tokens)

        # Final cleanup
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        return cleaned_text

    def _is_medical_term(self, token):
        """Check if token is a medical term"""
        token_lower = token.lower()

        # Check against ALL medical databases
        if (token_lower in self.medical_databases.symptom_database or
                token_lower in self.medical_databases.condition_database or
                any(token_lower in med_list for med_list in self.medical_databases.medication_database.values()) or
                any(token_lower in body_list for body_list in self.medical_databases.body_parts.values()) or
                any(token_lower in test_list for test_list in self.medical_databases.lab_tests.values()) or
                any(token_lower in proc_list for proc_list in self.medical_databases.procedures.values()) or
                any(token_lower in abbr_list for abbr_list in self.medical_databases.medical_abbreviations.values()) or
                any(token_lower in anat_list for anat_list in self.medical_databases.anatomical_terms.values())):
            return True

        # Check for medical suffixes/prefixes
        medical_affixes = {
            'itis', 'osis', 'emia', 'algia', 'dynia', 'ectomy', 'otomy', 'ostomy',
            'scopy', 'pathy', 'plasia', 'trophy', 'penia', 'rrhea', 'spasm', 'plegia',
            'pnea', 'uria', 'lysis', 'malacia', 'megaly', 'sclerosis', 'stenosis'
        }

        for affix in medical_affixes:
            if token_lower.endswith(affix) or token_lower.startswith(affix):
                return True

        return False

    # ==================== SYMPTOM EXTRACTION ====================
    def extract_symptoms(self, text, use_pattern_matching=True):
        """Enhanced symptom extraction with context awareness and severity analysis"""
        symptoms_found = []
        text_lower = text.lower()

        # Method 1: Direct database matching
        direct_symptoms = self._extract_symptoms_direct(text_lower)
        symptoms_found.extend(direct_symptoms)

        # Method 2: Pattern-based extraction
        if use_pattern_matching:
            pattern_symptoms = self._extract_symptoms_patterns(text)
            symptoms_found.extend(pattern_symptoms)

        # Method 3: Contextual symptom extraction
        contextual_symptoms = self._extract_symptoms_contextual(text)
        symptoms_found.extend(contextual_symptoms)

        # Remove duplicates and return
        return self._deduplicate_symptoms(symptoms_found)

    def _extract_symptoms_direct(self, text_lower):
        """Extract symptoms using direct database matching"""
        symptoms_found = []

        for symptom, info in tqdm(self.medical_databases.symptom_database.items(),
                                  desc="🔍 Scanning symptoms", leave=False):
            # Direct symptom match
            if symptom in text_lower:
                symptoms_found.append({
                    'symptom': symptom,
                    'severity': info['severity'],
                    'system': info['system'],
                    'body_part': self._find_associated_body_part(text_lower, symptom),
                    'confidence': 'high',
                    'method': 'direct_match'
                })
                continue

            # Keyword matching
            for keyword in info['keywords']:
                if keyword in text_lower:
                    symptoms_found.append({
                        'symptom': symptom,
                        'severity': info['severity'],
                        'system': info['system'],
                        'body_part': self._find_associated_body_part(text_lower, symptom),
                        'confidence': 'medium',
                        'method': 'keyword_match'
                    })
                    break

        return symptoms_found

    def _extract_symptoms_patterns(self, text):
        """Extract symptoms using pattern matching"""
        symptoms_found = []

        for pattern in self.medical_patterns['symptom_patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                symptom_phrase = match.group(1).strip()
                extracted_symptoms = self._parse_symptom_phrase(symptom_phrase)
                symptoms_found.extend(extracted_symptoms)

        return symptoms_found

    def _extract_symptoms_contextual(self, text):
        """Extract symptoms using contextual analysis"""
        symptoms_found = []

        if self.nlp:
            doc = self.nlp(text)

            # Extract noun phrases that might be symptoms
            for chunk in doc.noun_chunks:
                chunk_text = chunk.text.lower()
                for symptom in self.medical_databases.symptom_database:
                    if symptom in chunk_text:
                        info = self.medical_databases.symptom_database[symptom]
                        symptoms_found.append({
                            'symptom': symptom,
                            'severity': info['severity'],
                            'system': info['system'],
                            'body_part': self._find_associated_body_part(chunk_text, symptom),
                            'confidence': 'medium',
                            'method': 'contextual'
                        })

        return symptoms_found

    def _parse_symptom_phrase(self, phrase):
        """Parse symptom phrases into individual symptoms"""
        symptoms_found = []
        phrase_lower = phrase.lower()

        # Common conjunctions to split on
        conjunctions = [' and ', ' or ', ' with ', ' along with ', ' as well as ']

        # Split phrase by conjunctions
        sub_phrases = [phrase_lower]
        for conj in conjunctions:
            new_phrases = []
            for sub_phrase in sub_phrases:
                new_phrases.extend(sub_phrase.split(conj))
            sub_phrases = new_phrases

        # Check each sub-phrase against symptom database
        for sub_phrase in sub_phrases:
            sub_phrase = sub_phrase.strip()
            for symptom, info in self.medical_databases.symptom_database.items():
                if (symptom in sub_phrase or
                        any(keyword in sub_phrase for keyword in info['keywords'])):
                    symptoms_found.append({
                        'symptom': symptom,
                        'severity': info['severity'],
                        'system': info['system'],
                        'body_part': self._find_associated_body_part(sub_phrase, symptom),
                        'confidence': 'low',
                        'method': 'phrase_parsing'
                    })

        return symptoms_found

    def _find_associated_body_part(self, text, symptom):
        """Enhanced body part association with context awareness"""
        best_match = "unknown"
        highest_specificity = 0

        for body_part, variations in self.medical_databases.body_parts.items():
            # Check main body part
            if body_part in text:
                specificity = len(body_part.split())  # Multi-word parts get higher specificity
                if specificity > highest_specificity:
                    highest_specificity = specificity
                    best_match = body_part

            # Check variations
            for variation in variations:
                if variation in text:
                    specificity = len(variation.split()) + 0.5  # Variations get slightly lower priority
                    if specificity > highest_specificity:
                        highest_specificity = specificity
                        best_match = body_part

        return best_match

    # ==================== CONDITION EXTRACTION ====================
    def extract_conditions(self, text, use_context_analysis=True):
        """Enhanced condition extraction with context analysis"""
        conditions_found = []
        text_lower = text.lower()

        # Method 1: Direct database matching
        for condition, info in tqdm(self.medical_databases.condition_database.items(),
                                    desc="🔍 Scanning conditions", leave=False):
            if condition in text_lower:
                conditions_found.append({
                    'condition': condition,
                    'severity': info['severity'],
                    'symptoms': info['symptoms'],
                    'confidence': 'high'
                })

        # Method 2: Pattern-based extraction
        pattern_conditions = self._extract_conditions_patterns(text)
        conditions_found.extend(pattern_conditions)

        # Method 3: Contextual analysis
        if use_context_analysis and self.nlp:
            contextual_conditions = self._extract_conditions_contextual(text)
            conditions_found.extend(contextual_conditions)

        return self._deduplicate_conditions(conditions_found)

    def _extract_conditions_patterns(self, text):
        """Extract conditions using pattern matching"""
        conditions_found = []

        for pattern in self.medical_patterns['condition_patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                condition_phrase = match.group(1).strip()
                # Validate and match against database
                if self._is_valid_medical_condition(condition_phrase):
                    matched_condition = self._match_condition_to_database(condition_phrase)
                    if matched_condition:
                        conditions_found.append(matched_condition)

        return conditions_found

    def _extract_conditions_contextual(self, text):
        """Extract conditions using contextual analysis"""
        conditions_found = []
        doc = self.nlp(text)

        # Look for disease mentions in the text
        for ent in doc.ents:
            if ent.label_ in ["DISEASE", "CONDITION"] or self._is_medical_condition(ent.text):
                matched_condition = self._match_condition_to_database(ent.text)
                if matched_condition:
                    conditions_found.append(matched_condition)

        return conditions_found

    def _is_valid_medical_condition(self, condition):
        """Enhanced validation of medical conditions"""
        invalid_terms = {'the', 'and', 'or', 'but', 'if', 'when', 'how', 'what', 'why',
                         'this', 'that', 'these', 'those', 'some', 'any', 'all'}
        words = condition.lower().split()

        if len(words) > 6:  # Allow longer condition names
            return False

        if any(word in invalid_terms for word in words):
            return False

        # Check if it contains medical terminology indicators
        medical_indicators = {
            'disease', 'syndrome', 'disorder', 'deficiency', 'insufficiency',
            'failure', 'imbalance', 'infection', 'inflammation', 'cancer',
            'tumor', 'neoplasm', 'malignancy', 'benign', 'malignant'
        }

        if any(indicator in condition.lower() for indicator in medical_indicators):
            return True

        return len(words) >= 1  # Single word conditions are possible

    def _is_medical_condition(self, text):
        """Check if text represents a medical condition"""
        text_lower = text.lower()
        return (text_lower in self.medical_databases.condition_database or
                any(keyword in text_lower for keyword in
                    ['disease', 'syndrome', 'disorder', 'deficiency', 'infection']))

    def _match_condition_to_database(self, condition_phrase):
        """Match extracted condition phrase to database"""
        condition_lower = condition_phrase.lower()

        # Direct match
        if condition_lower in self.medical_databases.condition_database:
            info = self.medical_databases.condition_database[condition_lower]
            return {
                'condition': condition_lower,
                'severity': info['severity'],
                'symptoms': info['symptoms'],
                'confidence': 'high'
            }

        # Partial match
        for db_condition, info in self.medical_databases.condition_database.items():
            if (db_condition in condition_lower or
                    any(word in condition_lower for word in db_condition.split())):
                return {
                    'condition': db_condition,
                    'severity': info['severity'],
                    'symptoms': info['symptoms'],
                    'confidence': 'medium'
                }

        return None

    # ==================== MEDICATION EXTRACTION ====================
    def extract_medications(self, text, include_categories=True):
        """Enhanced medication extraction with category analysis"""
        medications_found = []
        text_lower = text.lower()

        # Direct medication matching
        for category, med_list in tqdm(self.medical_databases.medication_database.items(),
                                       desc="💊 Scanning medications", leave=False):
            for medication in med_list:
                if medication in text_lower:
                    med_info = {
                        'medication': medication,
                        'category': category if include_categories else 'unknown'
                    }

                    # Add additional context if available
                    med_info.update(self._extract_medication_context(text, medication))
                    medications_found.append(med_info)

        # Pattern-based extraction
        pattern_meds = self._extract_medications_patterns(text)
        medications_found.extend(pattern_meds)

        return self._deduplicate_medications(medications_found)

    def _extract_medications_patterns(self, text):
        """Extract medications using pattern matching"""
        medications_found = []

        for pattern in self.medical_patterns['medication_patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                med_phrase = match.group(1).strip()
                extracted_meds = self._parse_medication_phrase(med_phrase)
                medications_found.extend(extracted_meds)

        return medications_found

    def _parse_medication_phrase(self, phrase):
        """Parse medication phrases into individual medications"""
        medications_found = []
        phrase_lower = phrase.lower()

        # Split by common separators
        separators = [',', ';', ' and ', ' or ', ' with ']
        med_candidates = [phrase_lower]

        for sep in separators:
            new_candidates = []
            for candidate in med_candidates:
                new_candidates.extend(candidate.split(sep))
            med_candidates = new_candidates

        # Match against medication database
        for candidate in med_candidates:
            candidate = candidate.strip()
            for category, med_list in self.medical_databases.medication_database.items():
                for medication in med_list:
                    if medication in candidate:
                        medications_found.append({
                            'medication': medication,
                            'category': category,
                            'confidence': 'medium',
                            'method': 'phrase_parsing'
                        })

        return medications_found

    def _extract_medication_context(self, text, medication):
        """Extract context around medication mention"""
        context = {}
        text_lower = text.lower()
        med_index = text_lower.find(medication)

        if med_index != -1:
            # Extract surrounding words for context
            start = max(0, med_index - 50)
            end = min(len(text_lower), med_index + len(medication) + 50)
            context_snippet = text_lower[start:end]

            # Look for dosage patterns
            dosage_patterns = [
                r'(\d+\s*(?:mg|mcg|g|ml))\s*' + re.escape(medication),
                medication + r'\s*(\d+\s*(?:mg|mcg|g|ml))',
                r'(\d+)\s*(?:tablet|cap|capsule|tab)s?\s*' + re.escape(medication)
            ]

            for pattern in dosage_patterns:
                match = re.search(pattern, context_snippet)
                if match:
                    context['dosage'] = match.group(1)
                    break

            # Look for frequency
            frequency_terms = ['daily', 'bid', 'tid', 'qid', 'weekly', 'monthly']
            for term in frequency_terms:
                if term in context_snippet:
                    context['frequency'] = term
                    break

        return context

    # ==================== LAB TEST EXTRACTION ====================
    def extract_lab_tests(self, text):
        """Extract laboratory tests and results mentioned in text"""
        lab_tests_found = []
        text_lower = text.lower()

        # Method 1: Direct database matching
        for category, tests in self.medical_databases.lab_tests.items():
            for test in tests:
                if test in text_lower:
                    lab_tests_found.append({
                        'test': test,
                        'category': category,
                        'context': self._extract_lab_context(text, test)
                    })

        # Method 2: Pattern-based extraction
        pattern_tests = self._extract_lab_tests_patterns(text)
        lab_tests_found.extend(pattern_tests)

        # Method 3: Abbreviation matching
        abbreviation_tests = self._extract_lab_abbreviations(text)
        lab_tests_found.extend(abbreviation_tests)

        return self._deduplicate_lab_tests(lab_tests_found)

    def _extract_lab_tests_patterns(self, text):
        """Extract lab tests using pattern matching"""
        lab_tests_found = []

        for pattern in self.medical_patterns['lab_test_patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                test_phrase = match.group(1).strip() if match.groups() else match.group(0)
                # Match against database
                matched_test = self._match_lab_test_to_database(test_phrase)
                if matched_test:
                    lab_tests_found.append(matched_test)

        return lab_tests_found

    def _extract_lab_abbreviations(self, text):
        """Extract lab tests using abbreviation matching"""
        lab_tests_found = []

        # Check common lab abbreviations
        for category, tests in self.medical_databases.lab_tests.items():
            for test in tests:
                # Find abbreviated forms (usually in capitals)
                test_abbr = ''.join(word[0].upper() for word in test.split() if word[0].isalpha())
                if len(test_abbr) >= 2 and test_abbr in text:
                    lab_tests_found.append({
                        'test': test,
                        'category': category,
                        'abbreviation': test_abbr,
                        'context': 'abbreviation_match'
                    })

        return lab_tests_found

    def _match_lab_test_to_database(self, test_phrase):
        """Match extracted test phrase to lab test database"""
        test_lower = test_phrase.lower()

        for category, tests in self.medical_databases.lab_tests.items():
            for test in tests:
                if test in test_lower or any(word in test_lower for word in test.split()):
                    return {
                        'test': test,
                        'category': category,
                        'confidence': 'medium',
                        'method': 'pattern_match'
                    }
        return None

    def _extract_lab_context(self, text, test_name):
        """Extract context around lab test mention (results, values)"""
        context = {}
        text_lower = text.lower()
        test_index = text_lower.find(test_name)

        if test_index != -1:
            # Extract surrounding context
            start = max(0, test_index - 100)
            end = min(len(text_lower), test_index + len(test_name) + 100)
            context_snippet = text_lower[start:end]

            # Look for numerical values (lab results)
            value_patterns = [
                r'(\d+\.?\d*)\s*(?:mg/dL|g/dL|mmol/L|IU/L|U/L)',
                r'(elevated|low|high|normal|abnormal)\s+(?:levels?|values?)',
                r'(positive|negative|reactive|non-reactive)'
            ]

            for pattern in value_patterns:
                match = re.search(pattern, context_snippet)
                if match:
                    context['result'] = match.group(1)
                    break

        return context

    # ==================== PROCEDURE EXTRACTION ====================
    def extract_procedures(self, text):
        """Extract medical procedures mentioned in text"""
        procedures_found = []
        text_lower = text.lower()

        # Method 1: Direct database matching
        for category, procedure_list in self.medical_databases.procedures.items():
            for procedure in procedure_list:
                if procedure in text_lower:
                    procedures_found.append({
                        'procedure': procedure,
                        'category': category,
                        'context': self._extract_procedure_context(text, procedure)
                    })

        # Method 2: Pattern-based extraction
        pattern_procedures = self._extract_procedures_patterns(text)
        procedures_found.extend(pattern_procedures)

        return self._deduplicate_procedures(procedures_found)

    def _extract_procedures_patterns(self, text):
        """Extract procedures using pattern matching"""
        procedures_found = []

        for pattern in self.medical_patterns['procedure_patterns']:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                procedure_phrase = match.group(1).strip() if match.groups() else match.group(0)
                # Match against database
                matched_procedure = self._match_procedure_to_database(procedure_phrase)
                if matched_procedure:
                    procedures_found.append(matched_procedure)

        return procedures_found

    def _match_procedure_to_database(self, procedure_phrase):
        """Match extracted procedure phrase to procedure database"""
        procedure_lower = procedure_phrase.lower()

        for category, procedures in self.medical_databases.procedures.items():
            for procedure in procedures:
                if (procedure in procedure_lower or
                        any(word in procedure_lower for word in procedure.split())):
                    return {
                        'procedure': procedure,
                        'category': category,
                        'confidence': 'medium',
                        'method': 'pattern_match'
                    }
        return None

    def _extract_procedure_context(self, text, procedure_name):
        """Extract context around procedure mention"""
        context = {}
        text_lower = text.lower()
        procedure_index = text_lower.find(procedure_name)

        if procedure_index != -1:
            start = max(0, procedure_index - 150)
            end = min(len(text_lower), procedure_index + len(procedure_name) + 150)
            context_snippet = text_lower[start:end]

            # Look for temporal context
            temporal_terms = ['yesterday', 'last week', 'last month', 'planned', 'scheduled']
            for term in temporal_terms:
                if term in context_snippet:
                    context['timing'] = term
                    break

            # Look for outcome indicators
            outcome_terms = ['successful', 'complicated', 'uneventful', 'recovery']
            for term in outcome_terms:
                if term in context_snippet:
                    context['outcome'] = term
                    break

        return context

    # ==================== MEDICAL ABBREVIATION EXTRACTION ====================
    def extract_medical_abbreviations(self, text):
        """Extract and expand medical abbreviations"""
        abbreviations_found = []

        # Method 1: Direct abbreviation matching
        for category, abbr_list in self.medical_databases.medical_abbreviations.items():
            for abbr in abbr_list:
                if abbr in text:
                    abbreviations_found.append({
                        'abbreviation': abbr,
                        'category': category,
                        'expansion': self._expand_abbreviation(abbr)
                    })

        # Method 2: Pattern-based abbreviation extraction
        pattern_abbrs = self._extract_abbreviations_patterns(text)
        abbreviations_found.extend(pattern_abbrs)

        return abbreviations_found

    def _extract_abbreviations_patterns(self, text):
        """Extract abbreviations using pattern matching"""
        abbreviations_found = []

        for pattern in self.medical_patterns['abbreviation_patterns']:
            matches = re.finditer(pattern, text)
            for match in matches:
                abbr = match.group(1) if match.groups() else match.group(0)
                # Check if it's a known medical abbreviation
                expanded = self._expand_abbreviation(abbr)
                if expanded:
                    abbreviations_found.append({
                        'abbreviation': abbr,
                        'category': 'detected',
                        'expansion': expanded,
                        'confidence': 'medium'
                    })

        return abbreviations_found

    def _expand_abbreviation(self, abbr):
        """Expand medical abbreviation to full form"""
        # Search through all abbreviation categories
        for category, abbr_list in self.medical_databases.medical_abbreviations.items():
            if abbr in abbr_list:
                # For now, return the category as context
                # In a real implementation, you'd have a mapping to full forms
                return f"Medical {category.replace('_', ' ')}"

        # Check if it matches common patterns
        common_expansions = {
            'BP': 'Blood Pressure',
            'HR': 'Heart Rate',
            'RR': 'Respiratory Rate',
            'CBC': 'Complete Blood Count',
            'BMP': 'Basic Metabolic Panel',
            'CMP': 'Comprehensive Metabolic Panel',
            'LFTs': 'Liver Function Tests',
            'ECG': 'Electrocardiogram',
            'EKG': 'Electrocardiogram',
            'CT': 'Computed Tomography',
            'MRI': 'Magnetic Resonance Imaging',
            'XR': 'X-Ray'
        }

        return common_expansions.get(abbr, None)

    # ==================== ANATOMICAL TERM EXTRACTION ====================
    def extract_anatomical_terms(self, text):
        """Extract detailed anatomical locations and relationships"""
        anatomical_found = []
        text_lower = text.lower()

        # Extract anatomical planes and directions
        for category, terms in self.medical_databases.anatomical_terms.items():
            for term in terms:
                if term in text_lower:
                    anatomical_found.append({
                        'term': term,
                        'category': category,
                        'context': self._extract_anatomical_context(text, term)
                    })

        return anatomical_found

    def _extract_anatomical_context(self, text, anatomical_term):
        """Extract context around anatomical term"""
        context = {}
        text_lower = text.lower()
        term_index = text_lower.find(anatomical_term)

        if term_index != -1:
            start = max(0, term_index - 50)
            end = min(len(text_lower), term_index + len(anatomical_term) + 50)
            context_snippet = text_lower[start:end]

            # Look for associated structures or findings
            context['snippet'] = context_snippet

        return context

    # ==================== DIAGNOSTIC CRITERIA MATCHING ====================
    def check_diagnostic_criteria(self, symptoms, conditions):
        """Check if extracted symptoms meet diagnostic criteria for conditions"""
        criteria_matches = []

        for condition in conditions:
            condition_name = condition['condition']
            if condition_name in self.medical_databases.diagnostic_criteria:
                criteria = self.medical_databases.diagnostic_criteria[condition_name]
                symptom_names = [s['symptom'] for s in symptoms]

                # Simple matching - count how many criteria symptoms are present
                matched_criteria = []
                for criterion in criteria:
                    if any(symptom in criterion for symptom in symptom_names):
                        matched_criteria.append(criterion)

                if matched_criteria:
                    criteria_matches.append({
                        'condition': condition_name,
                        'matched_criteria': matched_criteria,
                        'match_count': len(matched_criteria),
                        'total_criteria': len(criteria),
                        'match_percentage': len(matched_criteria) / len(criteria) * 100
                    })

        return criteria_matches

    # ==================== DEDUPLICATION METHODS ====================
    def _deduplicate_symptoms(self, symptoms):
        seen = set()
        unique_symptoms = []
        for symptom in symptoms:
            key = symptom['symptom']
            if key not in seen:
                seen.add(key)
                unique_symptoms.append(symptom)
        return unique_symptoms

    def _deduplicate_conditions(self, conditions):
        seen = set()
        unique_conditions = []
        for condition in conditions:
            key = condition['condition']
            if key not in seen:
                seen.add(key)
                unique_conditions.append(condition)
        return unique_conditions

    def _deduplicate_medications(self, medications):
        seen = set()
        unique_medications = []
        for med in medications:
            key = med['medication']
            if key not in seen:
                seen.add(key)
                unique_medications.append(med)
        return unique_medications

    def _deduplicate_lab_tests(self, lab_tests):
        seen = set()
        unique_tests = []
        for test in lab_tests:
            key = test['test']
            if key not in seen:
                seen.add(key)
                unique_tests.append(test)
        return unique_tests

    def _deduplicate_procedures(self, procedures):
        seen = set()
        unique_procedures = []
        for procedure in procedures:
            key = procedure['procedure']
            if key not in seen:
                seen.add(key)
                unique_procedures.append(procedure)
        return unique_procedures

    # ==================== COMPREHENSIVE ANALYSIS ====================
    def comprehensive_medical_analysis(self, text):
        """COMPREHENSIVE analysis using ALL database components"""
        print("🔬 Performing COMPREHENSIVE medical text analysis...")

        cleaned_text = self.advanced_clean_text(text, preserve_medical_terms=True)

        analysis_results = {
            'original_text': text,
            'cleaned_text': cleaned_text,

            # Core medical entities
            'symptoms': self.extract_symptoms(cleaned_text),
            'conditions': self.extract_conditions(cleaned_text),
            'medications': self.extract_medications(cleaned_text),

            # NEW: Additional medical entities
            'lab_tests': self.extract_lab_tests(cleaned_text),
            'procedures': self.extract_procedures(cleaned_text),
            'abbreviations': self.extract_medical_abbreviations(cleaned_text),
            'anatomical_terms': self.extract_anatomical_terms(cleaned_text),

            # Analysis results
            'emergency_level': 'non_urgent',
            'body_systems_affected': [],
            'recommended_specialists': [],
            'diagnostic_criteria_matches': []
        }

        # Determine emergency level
        symptom_list = [s['symptom'] for s in analysis_results['symptoms']]
        analysis_results['emergency_level'] = self.medical_databases.get_emergency_level(symptom_list)

        # Analyze body systems
        analysis_results['body_systems_affected'] = list(set(
            s['system'] for s in analysis_results['symptoms'] if s['system'] != 'unknown'
        ))

        # Recommend specialists
        analysis_results['recommended_specialists'] = self.medical_databases.get_specialist_for_symptoms(symptom_list)

        # Check diagnostic criteria
        analysis_results['diagnostic_criteria_matches'] = self.check_diagnostic_criteria(
            analysis_results['symptoms'], analysis_results['conditions']
        )

        print("✅ COMPREHENSIVE medical analysis completed!\n")
        return analysis_results

    def batch_process_texts(self, texts, show_progress=True):
        """Process multiple texts with progress tracking"""
        results = []
        texts_to_process = tqdm(texts, desc="📊 Processing texts") if show_progress else texts

        for text in texts_to_process:
            analysis = self.comprehensive_medical_analysis(text)
            results.append(analysis)

        return results


# Example usage and testing
if __name__ == "__main__":
    # Initialize the medical database
    medical_db = ComprehensiveMedicalDatabases()

    # Initialize the text processor
    text_processor = TextProcessor(medical_db)

    # Test with comprehensive medical text
    test_text = """
    Patient presents with severe chest pain radiating to left arm, associated with shortness of breath and diaphoresis.
    History of hypertension and diabetes. Currently taking metformin 500mg twice daily and lisinopril 10mg daily.
    ECG shows ST elevation. CBC revealed leukocytosis with elevated troponin levels.
    Planned for cardiac catheterization. Patient has history of MI and CHF.
    Pain located in anterior chest wall radiating to left arm. BP 150/95, HR 110.
    The pain started suddenly 2 hours ago and is described as pressure-like. 
    Patient appears anxious and diaphoretic. Rule out acute coronary syndrome.
    """

    print("🧪 Testing FULLY INTEGRATED TextProcessor with comprehensive medical text...")
    comprehensive_analysis = text_processor.comprehensive_medical_analysis(test_text)

    print("📊 COMPREHENSIVE ANALYSIS RESULTS:")
    print(f"🚨 Emergency Level: {comprehensive_analysis['emergency_level']}")
    print(f"🔍 Symptoms Found: {len(comprehensive_analysis['symptoms'])}")
    for symptom in comprehensive_analysis['symptoms'][:5]:
        print(f"   - {symptom['symptom']} (Severity: {symptom['severity']}, System: {symptom['system']})")

    print(f"🏥 Conditions Found: {len(comprehensive_analysis['conditions'])}")
    for condition in comprehensive_analysis['conditions'][:3]:
        print(f"   - {condition['condition']} (Severity: {condition['severity']})")

    print(f"💊 Medications Found: {len(comprehensive_analysis['medications'])}")
    for med in comprehensive_analysis['medications']:
        print(f"   - {med['medication']} (Category: {med['category']})")

    print(f"🔬 Lab Tests Found: {len(comprehensive_analysis['lab_tests'])}")
    for test in comprehensive_analysis['lab_tests']:
        print(f"   - {test['test']} (Category: {test['category']})")

    print(f"🛠️ Procedures Found: {len(comprehensive_analysis['procedures'])}")
    for procedure in comprehensive_analysis['procedures']:
        print(f"   - {procedure['procedure']} (Category: {procedure['category']})")

    print(f"📝 Abbreviations Found: {len(comprehensive_analysis['abbreviations'])}")
    for abbr in comprehensive_analysis['abbreviations'][:5]:
        print(f"   - {abbr['abbreviation']}: {abbr['expansion']}")

    print(f"🧬 Anatomical Terms Found: {len(comprehensive_analysis['anatomical_terms'])}")
    for term in comprehensive_analysis['anatomical_terms'][:3]:
        print(f"   - {term['term']} (Category: {term['category']})")

    print(f"🎯 Diagnostic Criteria Matches: {len(comprehensive_analysis['diagnostic_criteria_matches'])}")
    for match in comprehensive_analysis['diagnostic_criteria_matches']:
        print(
            f"   - {match['condition']}: {match['match_count']}/{match['total_criteria']} criteria matched ({match['match_percentage']:.1f}%)")

    print(f"👨‍⚕️ Recommended Specialists: {comprehensive_analysis['recommended_specialists'][:3]}")
    print(f"🩺 Body Systems Affected: {comprehensive_analysis['body_systems_affected']}")