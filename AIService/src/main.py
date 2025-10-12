from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import logging

from configs.settings import API_TITLE, API_DESCRIPTION, API_VERSION, API_HOST, API_PORT
from api.chat_endpoints import router as api_router, initialize_chatbot

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("medical_chatbot.log"),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def create_app():
    app = FastAPI(
        title=API_TITLE,
        description=API_DESCRIPTION,
        version=API_VERSION
    )

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include API routes
    app.include_router(api_router, prefix="/api/v1")

    # Mount static files for documentation
    app.mount("/static", StaticFiles(directory="static"), name="static")

    @app.on_event("startup")
    async def startup_event():
        logger.info("🚀 Starting Enhanced Medical Assistant Chatbot with AI Models...")
        success = initialize_chatbot()
        if success:
            logger.info("✅ Chatbot with AI models initialized successfully!")
        else:
            logger.error("❌ Failed to initialize chatbot")

    @app.get("/")
    async def root():
        return {
            "message": "Enhanced Medical Assistant Chatbot API with MedGemma & MedSigLIP",
            "version": API_VERSION,
            "status": "running",
            "features": [
                "Symptom analysis and diagnosis prediction",
                "Medical image analysis (X-Ray, MRI, CT, Skin conditions)",
                "AI-powered medical text generation",
                "Emergency detection and triage",
                "Medication and treatment recommendations"
            ]
        }

    @app.get("/docs")
    async def custom_docs():
        return {
            "message": "API Documentation",
            "endpoints": {
                "POST /api/v1/chat": "Chat with medical assistant (text + optional image)",
                "POST /api/v1/analyze-image": "Analyze medical images",
                "POST /api/v1/analyze-symptoms": "AI-powered symptom analysis",
                "GET /api/v1/health": "System health check",
                "GET /api/v1/models/status": "AI models status"
            }
        }

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=True,
        log_level="info",
        access_log=True
    )