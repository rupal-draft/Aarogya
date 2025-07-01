from functools import wraps
from flask import request, jsonify

from utils.token_helper import extract_token_from_request, get_user_id_from_token


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = extract_token_from_request(request)
        user_id = get_user_id_from_token(token)

        if not user_id:
            return jsonify({"error": "Authentication required"}), 401

        request.user_id = user_id
        return f(*args, **kwargs)
    return decorated
