from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import logging
import sys
import os
from pathlib import Path

from starlette.responses import JSONResponse

from configs.settings import API_TITLE, API_DESCRIPTION, API_VERSION, API_HOST, API_PORT
from old_code.src.api.chat_endpoints import router as api_router, initialize_chatbot


def setup_unicode_logging():

    os.environ['PYTHONIOENCODING'] = 'utf-8'

    class UnicodeSafeHandler(logging.StreamHandler):
        def __init__(self, stream=None):
            super().__init__(stream)

        def emit(self, record):
            try:
                message = self.format(record)
                if hasattr(self.stream, 'buffer'):
                    self.stream.buffer.write(message.encode('utf-8'))
                    self.stream.buffer.write(self.terminator.encode('utf-8'))
                    self.flush()
                else:
                    safe_message = message.encode('utf-8', 'ignore').decode('utf-8')
                    self.stream.write(safe_message + self.terminator)
                    self.flush()
            except UnicodeEncodeError:
                try:
                    message = self.format(record)
                    emoji_replacements = {
                        '🧠': '[BRAIN]', '🚀': '[ROCKET]', '✅': '[OK]', '❌': '[ERROR]',
                        '🚨': '[ALERT]', '📊': '[CHART]', '🔍': '[SEARCH]', '⚙️': '[GEAR]',
                        '📦': '[PACKAGE]', '🔄': '[SYNC]', '📸': '[CAMERA]', '📋': '[CLIPBOARD]',
                        '💊': '[PILL]', '🩺': '[STETHOSCOPE]', '🔬': '[MICROSCOPE]',
                        '🧪': '[TEST]', '📝': '[NOTES]', '👤': '[USER]', '🤖': '[BOT]',
                        '💡': '[IDEA]', '🎯': '[TARGET]', '📈': '[GRAPH_UP]', '📉': '[GRAPH_DOWN]',
                        '⚠️': '[WARNING]', '🛠️': '[TOOLS]', '🧩': '[PUZZLE]', '🧮': '[CALCULATOR]',
                        '📌': '[PIN]', '📍': '[LOCATION]', '🕒': '[CLOCK]', '📅': '[CALENDAR]',
                        '🌟': '[STAR]', '🔥': '[FIRE]', '💧': '[WATER]', '🌡️': '[THERMOMETER]',
                        '💉': '[SYRINGE]', '🩹': '[BANDAGE]', '🏥': '[HOSPITAL]', '👨‍⚕️': '[DOCTOR]',
                        '📚': '[BOOKS]', '🔒': '[LOCK]', '🔓': '[UNLOCK]', '⚡': '[ZAP]',
                        '🌈': '[RAINBOW]', '🎨': '[ART]', '🚑': '[AMBULANCE]', '💯': '[100]'
                    }

                    safe_message = message
                    for emoji, replacement in emoji_replacements.items():
                        safe_message = safe_message.replace(emoji, replacement)

                    # Final safety: remove any remaining non-ASCII
                    safe_message = safe_message.encode('ascii', 'ignore').decode('ascii')
                    self.stream.write(safe_message + self.terminator)
                    self.flush()
                except Exception:
                    # Ultimate fallback
                    self.stream.write("Log message contains unsupported characters\n")
            except Exception:
                self.handleError(record)

    # Clear existing handlers
    root_logger = logging.getLogger()
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add our Unicode-safe handler
    handler = UnicodeSafeHandler(sys.stdout)
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)

    # Also configure file handler with UTF-8
    file_handler = logging.FileHandler("medical_chatbot.log", encoding='utf-8')
    file_handler.setFormatter(formatter)
    root_logger.addHandler(file_handler)


# Setup logging before anything else
setup_unicode_logging()
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
    Path("static").mkdir(exist_ok=True)
    app.mount("/static", StaticFiles(directory="static"), name="static")

    @app.on_event("startup")
    async def startup_event():
        logger.info("[ROCKET] Starting Enhanced Medical Assistant Chatbot with AI Models...")
        try:
            success = initialize_chatbot()
            if success:
                logger.info("[OK] Chatbot with AI models initialized successfully!")
            else:
                logger.error("[ERROR] Failed to initialize chatbot")
        except Exception as e:
            logger.error(f"[ERROR] Startup initialization failed: {str(e)}")

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
                "GET /api/v1/models/status": "AI models status",
                "GET /api/v1/medical-databases": "Get comprehensive medical databases",
                "POST /api/v1/comprehensive-analysis": "Full medical analysis using all components",
                "GET /api/v1/cache/info": "Get cache information"
            }
        }

    @app.get("/health")
    async def health_check():
        """Simple health check endpoint"""
        return {
            "status": "healthy",
            "service": "Medical Assistant API",
            "version": API_VERSION,
            "unicode_support": True
        }

    # Custom exception handler for Unicode issues
    @app.exception_handler(UnicodeEncodeError)
    async def unicode_exception_handler(request, exc):
        logger.error(f"[ERROR] Unicode encoding error: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"error": "Internal server error - character encoding issue"}
        )

    return app


app = create_app()

if __name__ == "__main__":
    # Configure uvicorn for UTF-8
    uvicorn_config = uvicorn.Config(
        "main:app",
        host=API_HOST,
        port=API_PORT,
        reload=True,
        log_level="info",
        access_log=True,
        # UTF-8 configuration for uvicorn
        log_config={
            "version": 1,
            "disable_existing_loggers": False,
            "formatters": {
                "default": {
                    "()": "uvicorn.logging.DefaultFormatter",
                    "fmt": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                    "use_colors": None,
                },
                "access": {
                    "()": "uvicorn.logging.AccessFormatter",
                    "fmt": '%(asctime)s - %(client_addr)s - "%(request_line)s" %(status_code)s',
                },
            },
            "handlers": {
                "default": {
                    "formatter": "default",
                    "class": "logging.StreamHandler",
                    "stream": "ext://sys.stderr",
                },
                "access": {
                    "formatter": "access",
                    "class": "logging.StreamHandler",
                    "stream": "ext://sys.stdout",
                },
            },
            "loggers": {
                "": {"handlers": ["default"], "level": "INFO"},
                "uvicorn.error": {"level": "INFO"},
                "uvicorn.access": {"handlers": ["access"], "level": "INFO", "propagate": False},
            },
        }
    )

    server = uvicorn.Server(uvicorn_config)

    try:
        logger.info(f"[ROCKET] Starting server on {API_HOST}:{API_PORT}")
        server.run()
    except KeyboardInterrupt:
        logger.info("[OK] Server stopped by user")
    except Exception as e:
        logger.error(f"[ERROR] Server error: {str(e)}")