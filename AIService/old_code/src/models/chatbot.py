from collections import Counter

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from tqdm import tqdm
import logging
from typing import Dict, Any, Optional
import pandas as pd
import base64
from io import BytesIO
from PIL import Image
import time
from configs.model_config import ModelConfig
from configs.settings import TFIDF_MAX_FEATURES, TFIDF_NGRAM_RANGE, TOP_K_RESULTS, SIMILARITY_THRESHOLD
from old_code.src.cache_manager import CacheManager
from old_code.src.models.medical_databases import ComprehensiveMedicalDatabases
from old_code.src.models.medical_models import MedGemmaModel, MedSigLIPModel
from old_code.src.utils import TextProcessor, EmergencyDetector

logger = logging.getLogger(__name__)


class EnhancedMedicalAssistantChatbot:
    """
    Enhanced Medical Assistant Chatbot with comprehensive medical database integration
    """

    def __init__(self, df_path: str, model_config: Optional[ModelConfig] = None):
        logger.info("🧠 Initializing Enhanced Medical Assistant Chatbot...")

        self.df_path = df_path
        self.cache_manager = CacheManager()
        self.medical_databases = ComprehensiveMedicalDatabases()
        self.text_processor = TextProcessor(self.medical_databases)
        self.emergency_detector = EmergencyDetector(self.medical_databases)

        self.model_config = model_config or ModelConfig()
        self.medgemma = None
        self.medsiglip = None

        self.vectorizer = None
        self.knowledge_base = None
        self.symptom_patterns = None
        self.df = None

        self._download_nltk_data()

        if not self._load_from_cache():
            self._load_and_process_data()

        self._initialize_ai_models()

        logger.info("✅ Chatbot initialized successfully with AI models!\n")

    def _load_from_cache(self) -> bool:
        """Try to load processed data from cache"""
        logger.info("🔍 Checking for cached processed data...")

        cache_data = self.cache_manager.load_processed_data(self.df_path)
        if cache_data:
            self.df = cache_data['processed_df']
            self.vectorizer = cache_data['vectorizer']
            self.knowledge_base = cache_data['knowledge_base']
            self.symptom_patterns = cache_data['symptom_patterns']

            logger.info(f"✅ Loaded from cache: {len(self.df)} records")
            logger.info(f"✅ Knowledge base: {self.knowledge_base.shape[1]} features")
            logger.info(f"✅ Symptom patterns: {len(self.symptom_patterns)} patterns")
            return True

        return False

    def _load_and_process_data(self):
        logger.info("📥 Loading dataset from source...")
        start_time = time.time()

        try:
            self.df = pd.read_parquet(self.df_path)
            logger.info(f"✅ Dataset loaded with {len(self.df)} records")

            self._preprocess_data()
            self._build_knowledge_base()
            self._extract_symptom_patterns()

            # Save to cache for future use
            self.cache_manager.save_processed_data(
                self.df, self.vectorizer, self.knowledge_base,
                self.symptom_patterns, self.df_path
            )

            processing_time = time.time() - start_time
            logger.info(f"⏱️ Data processing completed in {processing_time:.2f} seconds")

        except Exception as e:
            logger.error(f"❌ Error loading and processing data: {e}")
            raise

    def _download_nltk_data(self):
        """Download required NLTK data"""
        logger.info("⬇️ Checking and downloading required NLTK packages...")
        nltk_packages = ['punkt', 'stopwords', 'wordnet', 'averaged_perceptron_tagger']
        for package in nltk_packages:
            try:
                if package == 'punkt':
                    nltk.data.find(f'tokenizers/{package}')
                elif package == 'averaged_perceptron_tagger':
                    nltk.data.find(f'taggers/{package}')
                else:
                    nltk.data.find(f'corpora/{package}')
                logger.info(f"✔️ {package} already available")
            except LookupError:
                logger.info(f"📦 Downloading {package}...")
                nltk.download(package)
        logger.info("✅ NLTK setup complete.\n")

    def _initialize_ai_models(self):
        """Initialize MedGemma and MedSigLIP models"""
        try:
            if self.model_config.enable_text_generation:
                logger.info("🔄 Initializing MedGemma for medical text generation...")
                self.medgemma = MedGemmaModel(self.model_config.medgemma)
                self.medgemma.initialize()

            if self.model_config.enable_image_analysis:
                logger.info("🔄 Initializing MedSigLIP for medical image analysis...")
                self.medsiglip = MedSigLIPModel(self.model_config.medsiglip)
                self.medsiglip.initialize()

            logger.info("✅ AI models initialized successfully!")

        except Exception as e:
            logger.error(f"❌ Failed to initialize AI models: {e}")
            # Continue without AI models - chatbot will use traditional methods

    def _preprocess_data(self):
        """Enhanced preprocessing of medical dialogue data using comprehensive medical analysis"""
        logger.info("⚙️ Preprocessing medical dataset...")
        logger.info(f"📊 Processing {len(self.df)} dialogues...")

        # Clean description with progress bar
        logger.info("🧹 Cleaning description texts...")
        tqdm.pandas(desc="Description")
        self.df['clean_description'] = self.df['Description'].progress_apply(self.text_processor.advanced_clean_text)

        logger.info("🧹 Cleaning patient texts...")
        tqdm.pandas(desc="Patient")
        self.df['clean_patient'] = self.df['Patient'].progress_apply(self.text_processor.advanced_clean_text)

        logger.info("🧹 Cleaning doctor texts...")
        tqdm.pandas(desc="Doctor")
        self.df['clean_doctor'] = self.df['Doctor'].progress_apply(self.text_processor.advanced_clean_text)

        logger.info("✅ Text cleaning completed.")

        # Extract comprehensive medical entities
        self._comprehensive_extract_medical_entities()

        # Combine for vectorization
        self.df['combined_text'] = (
                self.df['clean_description'] + ' ' +
                self.df['clean_patient'] + ' ' +
                self.df['clean_doctor']
        )
        logger.info("🧩 Combined text fields for similarity analysis.")

        # Compute severity
        self._calculate_symptom_severity()

        logger.info(f"✅ Preprocessing complete. Total dialogues processed: {len(self.df)}\n")

    def _comprehensive_extract_medical_entities(self):
        """Comprehensive medical entity extraction using all database components"""
        logger.info("🔍 Performing comprehensive medical entity extraction...")

        # Extract all medical entities using the comprehensive analysis
        logger.info("🔬 Performing comprehensive medical analysis...")
        tqdm.pandas(desc="Comprehensive Analysis")
        self.df['comprehensive_analysis'] = self.df['clean_patient'].progress_apply(
            lambda x: self.text_processor.comprehensive_medical_analysis(x)
        )

        # Extract individual components for easier access
        logger.info("📋 Extracting analysis components...")
        tqdm.pandas(desc="Components")
        self.df['symptoms'] = self.df['comprehensive_analysis'].progress_apply(lambda x: x.get('symptoms', []))
        self.df['conditions'] = self.df['comprehensive_analysis'].progress_apply(lambda x: x.get('conditions', []))
        self.df['medications'] = self.df['comprehensive_analysis'].progress_apply(lambda x: x.get('medications', []))
        self.df['lab_tests'] = self.df['comprehensive_analysis'].progress_apply(lambda x: x.get('lab_tests', []))
        self.df['procedures'] = self.df['comprehensive_analysis'].progress_apply(lambda x: x.get('procedures', []))
        self.df['abbreviations'] = self.df['comprehensive_analysis'].progress_apply(
            lambda x: x.get('abbreviations', []))
        self.df['anatomical_terms'] = self.df['comprehensive_analysis'].progress_apply(
            lambda x: x.get('anatomical_terms', []))
        self.df['body_systems'] = self.df['comprehensive_analysis'].progress_apply(
            lambda x: x.get('body_systems_affected', []))
        self.df['emergency_level'] = self.df['comprehensive_analysis'].progress_apply(
            lambda x: x.get('emergency_level', 'non_urgent'))
        self.df['diagnostic_criteria'] = self.df['comprehensive_analysis'].progress_apply(
            lambda x: x.get('diagnostic_criteria_matches', []))

        logger.info("✅ Comprehensive entity extraction complete.\n")

    def _calculate_symptom_severity(self):
        """Calculate overall symptom severity for each case"""
        logger.info("🧮 Calculating overall symptom severity scores...")
        tqdm.pandas(desc="Severity")
        self.df['overall_severity'] = self.df['symptoms'].progress_apply(
            lambda x: np.mean([s['severity'] for s in x]) if x else 0
        )
        logger.info("✅ Severity scores calculated.\n")

    def _build_knowledge_base(self):
        """Build enhanced TF-IDF based knowledge base"""
        logger.info("🧠 Building TF-IDF based knowledge base...")
        self.vectorizer = TfidfVectorizer(
            max_features=TFIDF_MAX_FEATURES,
            stop_words='english',
            ngram_range=TFIDF_NGRAM_RANGE,
            min_df=2,
            max_df=0.8
        )

        logger.info("📊 Vectorizing combined texts...")
        self.knowledge_base = self.vectorizer.fit_transform(self.df['combined_text'])
        logger.info(f"✅ Knowledge base built with {self.knowledge_base.shape[1]} features.\n")

    def _extract_symptom_patterns(self):
        """Extract comprehensive symptom patterns"""
        logger.info("🔬 Extracting symptom patterns from dataset...")
        symptom_groups = {}
        severity_groups = {}
        condition_associations = {}
        medication_associations = {}

        # Use tqdm for progress tracking
        for idx, row in tqdm(self.df.iterrows(), total=len(self.df), desc="Symptom Patterns"):
            symptoms = row.get('symptoms', [])
            conditions = row.get('conditions', [])
            medications = row.get('medications', [])

            if symptoms:
                symptom_names = [s['symptom'] for s in symptoms]
                symptom_signature = tuple(sorted(symptom_names))

                symptom_groups.setdefault(symptom_signature, []).append(idx)
                severity_groups.setdefault(symptom_signature, []).append(row.get('overall_severity', 0))

                # Track condition associations
                if conditions:
                    condition_associations.setdefault(symptom_signature, []).extend(
                        [cond['condition'] for cond in conditions]
                    )

                # Track medication associations
                if medications:
                    medication_associations.setdefault(symptom_signature, []).extend(
                        [med['medication'] for med in medications]
                    )

        self.symptom_patterns = symptom_groups
        self.pattern_severities = severity_groups
        self.condition_associations = condition_associations
        self.medication_associations = medication_associations

        logger.info(f"✅ Extracted {len(symptom_groups)} unique symptom patterns.")
        logger.info(f"✅ Condition associations: {len(condition_associations)} patterns")
        logger.info(f"✅ Medication associations: {len(medication_associations)} patterns\n")

    def assess_symptom_severity(self, symptoms):
        """Assess overall severity based on symptoms"""
        if not symptoms:
            return 0

        max_severity = max([s['severity'] for s in symptoms])
        avg_severity = np.mean([s['severity'] for s in symptoms])
        overall = (max_severity * 0.7) + (avg_severity * 0.3)
        return overall

    def find_similar_cases(self, query, top_k=TOP_K_RESULTS):
        """Enhanced similar case finding with comprehensive medical criteria"""
        clean_query = self.text_processor.advanced_clean_text(query)
        query_vector = self.vectorizer.transform([clean_query])

        similarities = cosine_similarity(query_vector, self.knowledge_base).flatten()
        top_indices = similarities.argsort()[-top_k:][::-1]

        results = []
        for idx in top_indices:
            if similarities[idx] > SIMILARITY_THRESHOLD:
                row = self.df.iloc[idx]
                results.append({
                    'similarity': similarities[idx],
                    'description': row['Description'],
                    'patient_query': row['Patient'],
                    'doctor_response': row['Doctor'],
                    'symptoms': row.get('symptoms', []),
                    'conditions': row.get('conditions', []),
                    'medications': row.get('medications', []),
                    'lab_tests': row.get('lab_tests', []),
                    'procedures': row.get('procedures', []),
                    'abbreviations': row.get('abbreviations', []),
                    'anatomical_terms': row.get('anatomical_terms', []),
                    'body_systems': row.get('body_systems', []),
                    'emergency_level': row.get('emergency_level', 'non_urgent'),
                    'diagnostic_criteria': row.get('diagnostic_criteria', []),
                    'severity_score': row.get('overall_severity', 0)
                })

        return results

    def generate_diagnosis_prediction(self, query: str, image_data: Optional[str] = None) -> Dict[str, Any]:
        """Enhanced diagnosis prediction with comprehensive medical analysis"""
        logger.info(f"🧭 Processing query: {query[:100]}...")

        # Perform comprehensive medical analysis
        comprehensive_analysis = self.text_processor.comprehensive_medical_analysis(query)

        # Check for emergency first
        emergency_level = comprehensive_analysis.get('emergency_level', 'non_urgent')
        if emergency_level in ['critical_emergency', 'urgent_emergency']:
            logger.info(f"🚨 Emergency detected: {emergency_level}")
            return self._generate_emergency_response(comprehensive_analysis)

        # Handle image analysis if image data provided
        if image_data and self.medsiglip:
            image_analysis = self._analyze_medical_image(image_data, query)
            if image_analysis.get('success', False):
                return self._combine_text_and_image_analysis(comprehensive_analysis, image_analysis)

        # Use MedGemma for advanced text analysis if available
        if self.medgemma and self._should_use_medgemma(query):
            return self._enhanced_ai_analysis(query, comprehensive_analysis)

        # Use comprehensive traditional analysis
        return self._comprehensive_traditional_analysis(query, comprehensive_analysis)

    def _analyze_medical_image(self, image_data: str, context_query: str) -> Dict[str, Any]:
        """Analyze medical image using MedSigLIP"""
        try:
            # Decode base64 image data
            image = self._decode_image(image_data)

            # Determine analysis type from context
            analysis_type = self._determine_image_analysis_type(context_query)

            # Perform analysis
            if analysis_type == "skin":
                result = self.medsiglip.classify_skin_condition(image)
            elif analysis_type == "xray":
                xray_type = "chest" if any(
                    word in context_query.lower() for word in ["chest", "lung", "heart"]) else "bone"
                result = self.medsiglip.analyze_xray(image, xray_type)
            elif analysis_type in ["mri", "ct"]:
                scan_type = "brain" if any(
                    word in context_query.lower() for word in ["brain", "head", "neurological"]) else "abdominal"
                result = self.medsiglip.analyze_mri_ct(image, scan_type)
            else:
                result = self.medsiglip.analyze_medical_image(image, analysis_type)

            return result

        except Exception as e:
            logger.error(f"❌ Error analyzing medical image: {e}")
            return {
                "success": False,
                "error": str(e),
                "analysis": "Unable to analyze the medical image. Please try again or consult a healthcare professional."
            }

    def _decode_image(self, image_data: str) -> Image.Image:
        """Decode base64 image data"""
        try:
            # Remove data URL prefix if present
            if ',' in image_data:
                image_data = image_data.split(',')[1]

            image_bytes = base64.b64decode(image_data)
            image = Image.open(BytesIO(image_bytes)).convert('RGB')
            return image
        except Exception as e:
            raise ValueError(f"Invalid image data: {e}")

    def _determine_image_analysis_type(self, query: str) -> str:
        """Determine the type of medical image analysis needed"""
        query_lower = query.lower()

        if any(word in query_lower for word in ["skin", "rash", "dermatology", "lesion", "mole"]):
            return "skin"
        elif any(word in query_lower for word in ["xray", "x-ray", "chest", "bone", "fracture"]):
            return "xray"
        elif any(word in query_lower for word in ["mri", "magnetic resonance", "brain", "spinal"]):
            return "mri"
        elif any(word in query_lower for word in ["ct", "cat scan", "computed tomography"]):
            return "ct"
        elif any(word in query_lower for word in ["ultrasound", "sonogram"]):
            return "ultrasound"
        else:
            return "general"

    def _should_use_medgemma(self, query: str) -> bool:
        """Determine if MedGemma should be used for this query"""
        # Use MedGemma for complex medical queries
        complex_indicators = [
            "interpret", "analyze", "what does this mean", "test results",
            "diagnosis", "prognosis", "treatment options", "medication",
            "side effects", "complications", "risk factors"
        ]

        query_lower = query.lower()
        return any(indicator in query_lower for indicator in complex_indicators)

    def _enhanced_ai_analysis(self, query: str, comprehensive_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Use MedGemma for advanced medical analysis"""
        try:
            # Use MedGemma for analysis with comprehensive context
            gemma_result = self.medgemma.analyze_symptoms(
                query,
                comprehensive_analysis.get('symptoms', [])
            )

            if gemma_result.get('success', False):
                return {
                    'comprehensive_analysis': comprehensive_analysis,
                    'ai_analysis': gemma_result['response'],
                    'model_used': 'med-gemma',
                    'similar_cases_found': 0,
                    'emergency': False,
                    'message': gemma_result['response']
                }
            else:
                # Fall back to traditional analysis if MedGemma fails
                return self._comprehensive_traditional_analysis(query, comprehensive_analysis)

        except Exception as e:
            logger.error(f"❌ Error in AI analysis: {e}")
            return self._comprehensive_traditional_analysis(query, comprehensive_analysis)

    def _comprehensive_traditional_analysis(self, query: str, comprehensive_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Comprehensive traditional analysis using similarity matching"""
        # Find similar cases
        similar_cases = self.find_similar_cases(query, top_k=8)
        if not similar_cases:
            return self._generate_no_match_response(comprehensive_analysis)

        # Perform comprehensive analysis
        analysis = self._comprehensive_case_analysis(similar_cases, comprehensive_analysis)
        return analysis

    def _generate_emergency_response(self, comprehensive_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate emergency response"""
        symptoms = comprehensive_analysis.get('symptoms', [])
        emergency_level = comprehensive_analysis.get('emergency_level', 'non_urgent')

        return {
            'comprehensive_analysis': comprehensive_analysis,
            'similar_cases_found': 0,
            'emergency': True,
            'emergency_level': emergency_level,
            'message': f"🚨 EMERGENCY ALERT: {emergency_level.replace('_', ' ').title()}\n\n"
                       f"Based on your symptoms, this appears to be a medical emergency. "
                       f"Please seek immediate medical attention or call emergency services.\n\n"
                       f"Detected symptoms: {', '.join([s['symptom'] for s in symptoms]) if symptoms else 'Unknown'}"
        }

    def _combine_text_and_image_analysis(self, comprehensive_analysis: Dict[str, Any],
                                         image_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Combine text query analysis with image analysis"""
        return {
            'comprehensive_analysis': comprehensive_analysis,
            'image_analysis': image_analysis['analysis'],
            'image_findings': image_analysis.get('findings', []),
            'analysis_type': image_analysis.get('analysis_type', 'general'),
            'similar_cases_found': 0,
            'emergency': False,
            'message': f"📸 Image Analysis: {image_analysis['analysis']}\n\n"
                       f"📋 Text Analysis: {self._generate_analysis_message(comprehensive_analysis)}\n\n"
                       f"💡 Combined Assessment: Please consult with a healthcare professional for comprehensive diagnosis."
        }

    def _comprehensive_case_analysis(self, similar_cases, comprehensive_analysis):
        """Perform comprehensive medical analysis using similar cases"""
        # Calculate statistics
        avg_severity = np.mean([case['severity_score'] for case in similar_cases])

        # Collect all medical entities from similar cases
        all_conditions = []
        all_medications = []
        all_lab_tests = []
        all_procedures = []
        all_body_systems = []

        for case in similar_cases:
            all_conditions.extend([cond['condition'] for cond in case.get('conditions', [])])
            all_medications.extend([med['medication'] for med in case.get('medications', [])])
            all_lab_tests.extend([test['test'] for test in case.get('lab_tests', [])])
            all_procedures.extend([proc['procedure'] for proc in case.get('procedures', [])])
            all_body_systems.extend(case.get('body_systems', []))

        # Find most common entities
        condition_counts = Counter(all_conditions)
        medication_counts = Counter(all_medications)
        lab_test_counts = Counter(all_lab_tests)
        procedure_counts = Counter(all_procedures)
        body_system_counts = Counter(all_body_systems)

        most_common_conditions = condition_counts.most_common(3)
        most_common_medications = medication_counts.most_common(3)
        most_common_lab_tests = lab_test_counts.most_common(3)
        most_common_procedures = procedure_counts.most_common(3)
        most_common_body_systems = body_system_counts.most_common(3)

        # Build comprehensive response
        analysis = {
            'comprehensive_analysis': comprehensive_analysis,
            'similar_cases_found': len(similar_cases),
            'most_likely_conditions': [cond[0] for cond in most_common_conditions],
            'condition_probabilities': {cond[0]: f"{(cond[1] / len(similar_cases)) * 100:.1f}%" for cond in
                                        most_common_conditions},
            'recommended_medications': [med[0] for med in most_common_medications],
            'suggested_lab_tests': [test[0] for test in most_common_lab_tests],
            'common_procedures': [proc[0] for proc in most_common_procedures],
            'affected_body_systems': [system[0] for system in most_common_body_systems],
            'average_case_severity': avg_severity,
            'emergency': False,
            'message': self._generate_comprehensive_analysis_message(comprehensive_analysis, most_common_conditions,
                                                                     avg_severity)
        }

        return analysis

    def _generate_comprehensive_analysis_message(self, comprehensive_analysis, conditions, severity):
        """Generate comprehensive analysis message"""
        symptoms = comprehensive_analysis.get('symptoms', [])
        lab_tests = comprehensive_analysis.get('lab_tests', [])
        procedures = comprehensive_analysis.get('procedures', [])
        anatomical_terms = comprehensive_analysis.get('anatomical_terms', [])

        if not symptoms:
            return "I couldn't identify specific symptoms in your query. Please describe your symptoms in more detail."

        symptom_list = ", ".join([s['symptom'] for s in symptoms])
        condition_list = ", ".join(conditions) if conditions else "unknown condition"

        message = f"## 📋 Comprehensive Medical Analysis\n\n"
        message += f"**Symptoms Identified**: {symptom_list}\n\n"

        if conditions:
            message += f"**Possible Conditions**: {condition_list}\n\n"

        if lab_tests:
            message += f"**Relevant Lab Tests**: {', '.join([test['test'] for test in lab_tests[:3]])}\n\n"

        if procedures:
            message += f"**Related Procedures**: {', '.join([proc['procedure'] for proc in procedures[:3]])}\n\n"

        if anatomical_terms:
            message += f"**Anatomical Locations**: {', '.join([term['term'] for term in anatomical_terms[:3]])}\n\n"

        # Severity guidance
        if severity > 7:
            message += "🚨 **Severity Assessment**: Your symptoms appear to be severe. Please consult a healthcare provider soon."
        elif severity > 5:
            message += "⚠️ **Severity Assessment**: Your symptoms are moderate. Consider consulting a healthcare provider."
        else:
            message += "✅ **Severity Assessment**: Your symptoms appear to be mild. Monitor them and seek care if they worsen."

        return message

    def _generate_no_match_response(self, comprehensive_analysis):
        """Generate response when no similar cases are found"""
        return {
            'comprehensive_analysis': comprehensive_analysis,
            'similar_cases_found': 0,
            'most_likely_conditions': [],
            'condition_probabilities': {},
            'recommended_medications': [],
            'suggested_lab_tests': [],
            'common_procedures': [],
            'affected_body_systems': [],
            'average_case_severity': 0,
            'emergency': False,
            'message': "I couldn't find similar cases in my database. Please consult a healthcare provider for personalized medical advice."
        }

    def generate_follow_up_questions(self, comprehensive_analysis):
        """Generate relevant follow-up questions based on comprehensive analysis"""
        questions = []
        symptoms = comprehensive_analysis.get('symptoms', [])
        conditions = comprehensive_analysis.get('conditions', [])
        lab_tests = comprehensive_analysis.get('lab_tests', [])

        if not symptoms:
            questions = [
                "Can you describe your symptoms in more detail?",
                "How long have you been experiencing these symptoms?",
                "Are you experiencing any pain or discomfort?",
                "Have you noticed any other changes in your health?"
            ]
        else:
            # Symptom-specific follow-up questions
            for symptom in symptoms[:3]:
                symptom_name = symptom['symptom']
                questions.append(f"How severe is your {symptom_name} on a scale of 1-10?")
                questions.append(f"How long have you been experiencing {symptom_name}?")
                questions.append(f"Does anything make your {symptom_name} better or worse?")

            # Condition-specific questions
            if conditions:
                for condition in conditions[:2]:
                    condition_name = condition['condition']
                    questions.append(f"Have you been diagnosed with {condition_name} before?")
                    questions.append(f"Are you currently receiving treatment for {condition_name}?")

            # Lab test questions
            if lab_tests:
                questions.append("Have you had any recent lab tests or blood work done?")
                questions.append("Do you have access to any recent test results?")

        return questions[:6]  # Return max 6 questions

    def chat(self, query, image_data=None):
        """Enhanced chat interface with comprehensive medical analysis"""
        print(f"\n👤 Patient: {query}\n")
        result = self.generate_diagnosis_prediction(query, image_data)

        print("🤖 Chatbot Response:")
        print(result['message'])

        if not result.get('emergency'):
            comprehensive_analysis = result.get('comprehensive_analysis', {})
            questions = self.generate_follow_up_questions(comprehensive_analysis)
            if questions:
                print("\n📝 Follow-up Questions:")
                for i, q in enumerate(questions, 1):
                    print(f"{i}. {q}")

        return result

    def __del__(self):
        """Cleanup resources"""
        if self.medgemma:
            del self.medgemma
        if self.medsiglip:
            del self.medsiglip