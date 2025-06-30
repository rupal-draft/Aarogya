import os
import jwt
from flask import request
from typing import Optional

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

def extract_token_from_request(request_obj) -> Optional[str]:
    """Extract token from cookie or Authorization header"""
    cookie_names = ['access_token', 'token', 'auth_token', 'jwt_token']
    for name in cookie_names:
        if name in request_obj.cookies:
            return request_obj.cookies.get(name)

    # Fallback to Authorization header
    auth_header = request_obj.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        return auth_header.split(' ')[1]

    return None


def decode_jwt_token(token: str) -> Optional[dict]:
    """Decode a JWT token and return the payload"""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except Exception as e:
        print(f"❌ Token decode error: {e}")
        return None


def get_user_id_from_token(token: str) -> Optional[str]:
    """Extract user ID from token payload"""
    payload = decode_jwt_token(token)
    if not payload:
        return None
    return str(payload.get('sub') or payload.get('user_id') or payload.get('id'))


def get_user_info(request_obj) -> Optional[dict]:
    """Extract full user info (user_id, email, role...) from request"""
    token = extract_token_from_request(request_obj)
    if not token:
        return None

    payload = decode_jwt_token(token)
    if not payload:
        return None

    return {
        'user_id': str(payload.get('sub') or payload.get('user_id') or payload.get('id')),
        'email': payload.get('email'),
        'role': payload.get('role'),
        'full_payload': payload
    }
