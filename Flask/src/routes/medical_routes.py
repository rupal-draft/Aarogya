from flask import Blueprint, jsonify, request

from src.services.medical_service import MedicalService
from src.utils.auth_utils import require_auth

bp = Blueprint('medical', __name__, url_prefix='/medical')
medical_service = MedicalService()

@bp.route('/predict', methods=['POST'])
@require_auth
def predict_disease():
    return medical_service.predict_disease(request)

@bp.route('/consultation/<consultation_id>', methods=['GET'])
@require_auth
def get_consultation(consultation_id):
    return medical_service.get_consultation(consultation_id, request.user_id)

@bp.route('/history', methods=['GET'])
@require_auth
def get_medical_history():
    return medical_service.get_medical_history(request.user_id, request.args.get('limit', 10, type=int))