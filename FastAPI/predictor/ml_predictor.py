from typing import List, Dict
from .model_loader import ModelLoader
from .prediction_handler import PredictionHandler
from .risk_assessor import RiskAssessor
from .fallback_predictor import FallbackPredictor


class MLPredictor:
    def __init__(self):
        self.model_loader = ModelLoader()
        self.prediction_handler = PredictionHandler()
        self.risk_assessor = RiskAssessor()
        self.fallback_predictor = FallbackPredictor()
        self.model_loaded = False

    def load_model(self) -> bool:
        """Load the trained ML model"""
        self.model_loaded = self.model_loader.load()
        return self.model_loaded

    def predict_diseases(self, symptoms: List[str], patient: Dict) -> List[Dict]:
        """Predict diseases based on symptoms"""
        if not self.model_loaded:
            return self.fallback_predictor.get_fallback_predictions(symptoms)

        try:
            symptom_vector = self.prediction_handler.create_symptom_vector(
                symptoms,
                self.model_loader.feature_names
            )

            predictions = self.prediction_handler.make_predictions(
                symptom_vector,
                self.model_loader.model,
                self.model_loader.label_encoder
            )

            # Add risk assessment
            for prediction in predictions:
                prediction['risk_level'] = self.risk_assessor.assess_risk(
                    prediction['disease'],
                    prediction['confidence']
                )

            return predictions

        except Exception as e:
            print(f"Error in prediction: {str(e)}")
            return self.fallback_predictor.get_fallback_predictions(symptoms)