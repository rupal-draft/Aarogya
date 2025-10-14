from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from .config import Config
from src.routes.chat_routes import bp as chat_bp
from src.routes.medical_routes import bp as medical_bp
from src.routes.utility_routes import bp as utility_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, supports_credentials=True)
    JWTManager(app)

    app.register_blueprint(chat_bp)
    app.register_blueprint(medical_bp)
    app.register_blueprint(utility_bp)

    return app