import numpy as np
from typing import List, Dict


class PredictionHandler:
    def create_symptom_vector(self, symptoms: List[str], feature_names: List[str]) -> np.ndarray:
        """Create binary symptom vector for model input"""
        symptom_vector = np.zeros(len(feature_names))

        # Map symptoms to feature vector
        for symptom in symptoms:
            # Clean symptom name
            symptom_clean = symptom.lower().replace(' ', '_')

            # Find matching feature
            if symptom_clean in feature_names:
                idx = feature_names.index(symptom_clean)
                symptom_vector[idx] = 1
            else:
                # Try partial matching
                for i, feature in enumerate(feature_names):
                    if symptom_clean in feature or feature in symptom_clean:
                        symptom_vector[i] = 1
                        break

        return symptom_vector.reshape(1, -1)

    def make_predictions(self, symptom_vector: np.ndarray, model, label_encoder) -> List[Dict]:
        """Make predictions using the loaded model"""
        probabilities = model.predict_proba(symptom_vector)[0]

        # Get top 3 predictions
        top_indices = np.argsort(probabilities)[-3:][::-1]

        predictions = []
        for idx in top_indices:
            disease_name = label_encoder.inverse_transform([idx])[0]
            confidence = probabilities[idx]

            if confidence > 0.05:  # Only include if confidence > 5%
                predictions.append({
                    'disease': disease_name,
                    'confidence': float(confidence)
                })

        return predictions