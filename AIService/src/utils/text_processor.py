import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import spacy
import warnings
from tqdm import tqdm

warnings.filterwarnings('ignore')


class TextProcessor:
    """Advanced text processing for medical text analysis (with progress tracking)"""

    def __init__(self, medical_databases):
        print("🧠 Initializing TextProcessor...")
        self.medical_databases = medical_databases
        self.lemmatizer = WordNetLemmatizer()
        self.nlp = self._load_spacy_model()
        self.processed_count = 0
        print("✅ TextProcessor initialized successfully!\n")

    def _load_spacy_model(self):
        """Load spaCy model with fallback"""
        print("🔍 Loading spaCy model...")
        try:
            nlp = spacy.load("en_core_web_sm")
            print("✅ spaCy model 'en_core_web_sm' loaded successfully!\n")
            return nlp
        except OSError:
            print("⚠️ spaCy English model not found. Using basic NLP features.\n")
            return None

    def advanced_clean_text(self, text):
        """Advanced text cleaning with lemmatization and medical term preservation"""
        self.processed_count += 1

        # Show progress every 1000 texts
        if self.processed_count % 1000 == 0:
            print(f"📊 Processed {self.processed_count} texts...")

        if pd.isna(text):
            return ""

        # Convert to lowercase
        text = text.lower()

        # Remove special characters but keep medical terms and numbers
        text = re.sub(r'[^a-z0-9\s\-\.%]+', ' ', text)

        # Remove extra spaces
        text = ' '.join(text.split())

        # Advanced processing with spaCy if available
        if self.nlp:
            doc = self.nlp(text)
            tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
        else:
            tokens = word_tokenize(text)
            tokens = [self.lemmatizer.lemmatize(token) for token in tokens if token not in stopwords.words('english')]

        cleaned_text = ' '.join(tokens)
        return cleaned_text

    def extract_symptoms(self, text):
        """Enhanced symptom extraction with severity and body part association"""
        symptoms_found = []
        text_lower = text.lower()

        for symptom, info in self.medical_databases.symptom_database.items():
            if symptom in text_lower:
                symptoms_found.append({
                    'symptom': symptom,
                    'severity': info['severity'],
                    'system': info['system'],
                    'body_part': self._find_associated_body_part(text_lower, symptom)
                })
                continue

            for keyword in info['keywords']:
                if keyword in text_lower:
                    symptoms_found.append({
                        'symptom': symptom,
                        'severity': info['severity'],
                        'system': info['system'],
                        'body_part': self._find_associated_body_part(text_lower, symptom)
                    })
                    break

        return symptoms_found

    def _find_associated_body_part(self, text, symptom):
        """Find body part associated with symptom"""
        for body_part, variations in self.medical_databases.body_parts.items():
            if body_part in text:
                return body_part

            for variation in variations:
                if variation in text:
                    return body_part

        return "unknown"

    def extract_conditions(self, text):
        """Enhanced condition extraction using pattern matching and database"""
        conditions_found = []
        text_lower = text.lower()

        condition_patterns = [
            r'diagnosed with (\w+(?:\s+\w+)*)',
            r'suffering from (\w+(?:\s+\w+)*)',
            r'symptoms of (\w+(?:\s+\w+)*)',
            r'(\w+(?:\s+\w+)*) infection',
            r'(\w+(?:\s+\w+)*) disease',
            r'(\w+(?:\s+\w+)*) syndrome',
            r'(\w+(?:\s+\w+)*) disorder'
        ]

        for pattern in condition_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                if self._is_valid_condition(match):
                    conditions_found.append({
                        'condition': match,
                        'severity': self.medical_databases.condition_database.get(match, {}).get('severity', 5)
                    })

        return conditions_found

    def _is_valid_condition(self, condition):
        """Check if extracted condition is valid"""
        invalid_terms = ['the', 'and', 'or', 'but', 'if', 'when', 'how', 'what', 'why']
        words = condition.split()

        if len(words) > 4:
            return False

        if any(word in invalid_terms for word in words):
            return False

        return True

    def extract_medications(self, text):
        """Extract medications mentioned in text"""
        medications_found = []
        text_lower = text.lower()

        for category, meds in self.medical_databases.medication_database.items():
            for med in meds:
                if med in text_lower:
                    medications_found.append({
                        'medication': med,
                        'category': category
                    })

        return medications_found