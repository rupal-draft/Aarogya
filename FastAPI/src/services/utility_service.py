from flask import jsonify
from datetime import datetime

from src.database.database import DatabaseManager
from predictor import MLPredictor
from src.utils.spacy_utils import SpacyUtils


class UtilityService:
    def __init__(self):
        self.spacy_utils = SpacyUtils()
        self.db = DatabaseManager()
        self.ml_predictor = MLPredictor()

    def health_check(self):
        try:
            # Check database connection
            db_status = "connected" if self.db.client.admin.command('ping') else "disconnected"

            # Check ML model
            ml_status = "loaded" if self.ml_predictor.model_loaded else "not_loaded"

            return jsonify({
                'status': 'healthy',
                'database': db_status,
                'ml_model': ml_status,
                'timestamp': datetime.utcnow().isoformat()
            }), 200

        except Exception as e:
            return jsonify({
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.utcnow().isoformat()
            }), 500

    def extract_medicines(self, request):
        data = request.get_json()
        text = data.get("text")
        medicine_list = data.get("medicine_list", [])

        medicines_found = self.spacy_utils.extract_medicines(text, medicine_list)

        return jsonify({"medicines_found": medicines_found})