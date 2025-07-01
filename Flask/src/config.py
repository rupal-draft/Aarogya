import os
from datetime import timedelta


class Config:
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')