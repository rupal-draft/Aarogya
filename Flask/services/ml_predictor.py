import pickle
import numpy as np
from typing import List, Dict, Optional
import os


class MLPredictor:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.feature_names = None
        self.model_loaded = False

    def load_model(self) -> bool:
        """Load the trained ML model"""
        try:
            # Load model files
            model_path = 'models/symptoms/final_model.pkl'
            encoder_path = 'models/symptoms/label_encoder.pkl'
            features_path = 'models/symptoms/symptom_cols.pkl'

            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)

            if os.path.exists(encoder_path):
                with open(encoder_path, 'rb') as f:
                    self.label_encoder = pickle.load(f)

            if os.path.exists(features_path):
                with open(features_path, 'rb') as f:
                    self.feature_names = pickle.load(f)
            else:
                # Fallback feature names
                self.feature_names = [
                    'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing',
                    'shivering', 'chills', 'joint_pain', 'stomach_pain', 'acidity',
                    'ulcers_on_tongue', 'muscle_wasting', 'vomiting', 'burning_micturition',
                    'spotting_urination', 'fatigue', 'weight_gain', 'anxiety',
                    'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness',
                    'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough',
                    'high_fever', 'sunken_eyes', 'breathlessness', 'sweating', 'dehydration'
                ]

            self.model_loaded = (self.model is not None and
                                 self.label_encoder is not None and
                                 self.feature_names is not None)

            return self.model_loaded

        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False

    def predict_diseases(self, symptoms: List[str], patient: Dict) -> List[Dict]:
        """Predict diseases based on symptoms"""
        if not self.model_loaded:
            return self._get_fallback_predictions(symptoms)

        try:
            # Create symptom vector
            symptom_vector = self._create_symptom_vector(symptoms)

            # Get predictions
            probabilities = self.model.predict_proba(symptom_vector)[0]

            # Get top 3 predictions
            top_indices = np.argsort(probabilities)[-3:][::-1]

            predictions = []
            for idx in top_indices:
                disease_name = self.label_encoder.inverse_transform([idx])[0]
                confidence = probabilities[idx]

                if confidence > 0.05:  # Only include if confidence > 5%
                    predictions.append({
                        'disease': disease_name,
                        'confidence': float(confidence),
                        'risk_level': self._assess_disease_risk(disease_name, confidence)
                    })

            return predictions

        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            return self._get_fallback_predictions(symptoms)

    def _create_symptom_vector(self, symptoms: List[str]) -> np.ndarray:
        """Create binary symptom vector for model input"""
        symptom_vector = np.zeros(len(self.feature_names))

        # Map symptoms to feature vector
        for symptom in symptoms:
            # Clean symptom name
            symptom_clean = symptom.lower().replace(' ', '_')

            # Find matching feature
            if symptom_clean in self.feature_names:
                idx = self.feature_names.index(symptom_clean)
                symptom_vector[idx] = 1
            else:
                # Try partial matching
                for i, feature in enumerate(self.feature_names):
                    if symptom_clean in feature or feature in symptom_clean:
                        symptom_vector[i] = 1
                        break

        return symptom_vector.reshape(1, -1)

    def _assess_disease_risk(self, disease_name: str, confidence: float) -> str:
        """Assess risk level based on disease and confidence"""
        high_risk_diseases = [
            'pneumonia', 'malaria', 'dengue', 'typhoid', 'hepatitis',
            'heart attack', 'stroke', 'meningitis', 'sepsis'
        ]

        moderate_risk_diseases = [
            'diabetes', 'hypertension', 'asthma', 'bronchitis',
            'gastroenteritis', 'migraine', 'arthritis'
        ]

        disease_lower = disease_name.lower()

        # Check for high-risk diseases
        if any(high_risk in disease_lower for high_risk in high_risk_diseases):
            return 'high' if confidence > 0.6 else 'moderate'

        # Check for moderate-risk diseases
        elif any(mod_risk in disease_lower for mod_risk in moderate_risk_diseases):
            return 'moderate' if confidence > 0.7 else 'low'

        # Default risk assessment based on confidence
        elif confidence > 0.8:
            return 'moderate'
        else:
            return 'low'

    def _get_fallback_predictions(self, symptoms: List[str]) -> List[Dict]:
        """Provide fallback predictions when model is unavailable"""

        # Simple rule-based predictions
        fallback_predictions = []

        symptom_text = ' '.join(symptoms).lower()

        if any(s in symptom_text for s in ['fever', 'cough', 'headache']):
            fallback_predictions.append({
                'disease': 'Common Cold',
                'confidence': 0.7,
                'risk_level': 'low'
            })

        if any(s in symptom_text for s in ['stomach', 'nausea', 'vomiting']):
            fallback_predictions.append({
                'disease': 'Gastroenteritis',
                'confidence': 0.6,
                'risk_level': 'moderate'
            })

        if any(s in symptom_text for s in ['skin', 'rash', 'itching']):
            fallback_predictions.append({
                'disease': 'Skin Allergy',
                'confidence': 0.5,
                'risk_level': 'low'
            })

        if not fallback_predictions:
            fallback_predictions.append({
                'disease': 'General Malaise',
                'confidence': 0.4,
                'risk_level': 'low'
            })

        return fallback_predictions
