from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Dict, Any, List, Optional, Union
import pandas as pd
import base64
from io import BytesIO

from configs.model_config import ModelConfig
from configs.settings import DATA_PATH
from src.models import EnhancedMedicalAssistantChatbot

# Initialize router
router = APIRouter()


# Pydantic models for request/response
class ChatRequest(BaseModel):
    query: str
    user_id: Optional[str] = None
    image_data: Optional[str] = None  # base64 encoded image


class ChatResponse(BaseModel):
    response: Dict[str, Any]
    follow_up_questions: List[str]
    emergency: bool
    model_used: Optional[str] = None


class HealthResponse(BaseModel):
    status: str
    message: str
    dataset_size: int
    features_loaded: int
    ai_models_loaded: Dict[str, bool]


class ImageAnalysisRequest(BaseModel):
    image_data: str  # base64 encoded image
    analysis_type: Optional[str] = "general"
    context: Optional[str] = ""


# Global chatbot instance
chatbot = None


def initialize_chatbot():
    """Initialize the chatbot with dataset and AI models"""
    global chatbot
    try:
        print("🔄 Loading medical dialogue dataset and AI models...")
        df = pd.read_parquet(DATA_PATH)
        print(f"✅ Dataset loaded with {len(df)} records")

        # Initialize with model configuration
        model_config = ModelConfig()
        chatbot = EnhancedMedicalAssistantChatbot(df, model_config)
        print("✅ Chatbot with AI models initialized successfully!")
        return True
    except Exception as e:
        print(f"❌ Error initializing chatbot: {e}")
        return False


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    if chatbot is None:
        return HealthResponse(
            status="error",
            message="Chatbot not initialized",
            dataset_size=0,
            features_loaded=0,
            ai_models_loaded={"medgemma": False, "medsiglip": False}
        )

    ai_models_status = {
        "medgemma": chatbot.medgemma is not None and chatbot.medgemma.is_initialized,
        "medsiglip": chatbot.medsiglip is not None and chatbot.medsiglip.is_initialized
    }

    return HealthResponse(
        status="healthy",
        message="Enhanced Medical Assistant Chatbot with AI models is running",
        dataset_size=len(chatbot.df),
        features_loaded=chatbot.knowledge_base.shape[1] if chatbot.knowledge_base else 0,
        ai_models_loaded=ai_models_status
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """Main chat endpoint for medical queries with optional image analysis"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    try:
        # Process the query with optional image data
        result = chatbot.generate_diagnosis_prediction(request.query, request.image_data)

        # Generate follow-up questions if not emergency
        follow_up_questions = []
        if not result.get('emergency', False):
            detected_symptoms = result.get('query_symptoms', [])
            follow_up_questions = chatbot.generate_follow_up_questions(request.query, detected_symptoms)

        return ChatResponse(
            response=result,
            follow_up_questions=follow_up_questions,
            emergency=result.get('emergency', False),
            model_used=result.get('model_used', 'traditional')
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")


@router.post("/analyze-image")
async def analyze_image_endpoint(
        file: UploadFile = File(...),
        analysis_type: str = Form("general"),
        context: str = Form("")
):
    """Dedicated endpoint for medical image analysis"""
    if chatbot is None or chatbot.medsiglip is None:
        raise HTTPException(status_code=503, detail="Image analysis not available")

    try:
        # Read and encode image
        image_bytes = await file.read()
        image_data = base64.b64encode(image_bytes).decode('utf-8')

        # Analyze image
        result = chatbot._analyze_medical_image(image_data, context)

        return {
            "analysis": result.get('analysis', ''),
            "findings": result.get('findings', []),
            "analysis_type": analysis_type,
            "success": result.get('success', False),
            "model_used": "medsiglip"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing image: {str(e)}")


@router.post("/analyze-symptoms")
async def analyze_symptoms_endpoint(request: ChatRequest):
    """Dedicated endpoint for symptom analysis using MedGemma"""
    if chatbot is None or chatbot.medgemma is None:
        raise HTTPException(status_code=503, detail="AI symptom analysis not available")

    try:
        result = chatbot.medgemma.analyze_symptoms(request.query)
        return {
            "analysis": result.get('response', ''),
            "success": result.get('success', False),
            "model_used": "medgemma"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing symptoms: {str(e)}")


@router.get("/symptoms")
async def get_symptoms_database():
    """Get available symptoms database"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "symptoms": chatbot.medical_databases.symptom_database,
        "total_symptoms": len(chatbot.medical_databases.symptom_database)
    }


@router.get("/conditions")
async def get_conditions_database():
    """Get available conditions database"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "conditions": chatbot.medical_databases.condition_database,
        "total_conditions": len(chatbot.medical_databases.condition_database)
    }


@router.get("/models/status")
async def get_models_status():
    """Get status of AI models"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "medgemma": {
            "loaded": chatbot.medgemma is not None and chatbot.medgemma.is_initialized,
            "description": "Medical text generation and analysis"
        },
        "medsiglip": {
            "loaded": chatbot.medsiglip is not None and chatbot.medsiglip.is_initialized,
            "description": "Medical image analysis and classification"
        }
    }