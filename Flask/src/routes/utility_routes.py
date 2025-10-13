from flask import Blueprint, jsonify, request

from src.services.utility_service import UtilityService

bp = Blueprint('utility', __name__)
utility_service = UtilityService()

@bp.route('/health', methods=['GET'])
def health_check():
    return utility_service.health_check()

@bp.route("/extract-medicines", methods=["POST"])
def extract_medicines():
    return utility_service.extract_medicines(request)