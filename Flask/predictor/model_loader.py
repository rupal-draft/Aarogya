import pickle
import os
from typing import Optional

class ModelLoader:
    def __init__(self):
        self.model = None
        self.label_encoder = None
        self.feature_names = None

    def load(self) -> bool:
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

            return (self.model is not None and
                    self.label_encoder is not None and
                    self.feature_names is not None)

        except Exception as e:
            print(f"Error loading model: {str(e)}")
            return False