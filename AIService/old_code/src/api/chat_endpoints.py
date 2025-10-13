from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import pandas as pd
import base64

from configs.model_config import ModelConfig
from configs.settings import DATA_PATH
from old_code.src.models import EnhancedMedicalAssistantChatbot

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
    comprehensive_analysis: Optional[Dict[str, Any]] = None


class HealthResponse(BaseModel):
    status: str
    message: str
    dataset_size: int
    features_loaded: int
    ai_models_loaded: Dict[str, bool]
    medical_databases_loaded: Dict[str, int]


class ImageAnalysisRequest(BaseModel):
    image_data: str  # base64 encoded image
    analysis_type: Optional[str] = "general"
    context: Optional[str] = ""


class MedicalDatabaseResponse(BaseModel):
    symptoms: Dict[str, Any]
    conditions: Dict[str, Any]
    medications: Dict[str, Any]
    lab_tests: Dict[str, Any]
    procedures: Dict[str, Any]
    body_parts: Dict[str, Any]
    medical_specialties: Dict[str, Any]
    emergency_keywords: Dict[str, Any]
    medical_abbreviations: Dict[str, Any]
    anatomical_terms: Dict[str, Any]
    diagnostic_criteria: Dict[str, Any]


# Global chatbot instance
chatbot = None


def initialize_chatbot():
    """Initialize the chatbot with dataset and AI models"""
    global chatbot
    try:
        print("🔄 Loading medical dialogue dataset and AI models...")

        # Initialize with model configuration
        model_config = ModelConfig()
        chatbot = EnhancedMedicalAssistantChatbot(DATA_PATH, model_config)
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
            ai_models_loaded={"medgemma": False, "medsiglip": False},
            medical_databases_loaded={}
        )

    ai_models_status = {
        "medgemma": chatbot.medgemma is not None and hasattr(chatbot.medgemma,
                                                             'is_initialized') and chatbot.medgemma.is_initialized,
        "medsiglip": chatbot.medsiglip is not None and hasattr(chatbot.medsiglip,
                                                               'is_initialized') and chatbot.medsiglip.is_initialized
    }

    # Get medical database statistics
    medical_db_stats = {}
    if hasattr(chatbot, 'medical_databases'):
        db = chatbot.medical_databases
        medical_db_stats = {
            "symptoms": len(db.symptom_database) if hasattr(db, 'symptom_database') else 0,
            "conditions": len(db.condition_database) if hasattr(db, 'condition_database') else 0,
            "medications": len(db.medication_database) if hasattr(db, 'medication_database') else 0,
            "lab_tests": len(db.lab_tests) if hasattr(db, 'lab_tests') else 0,
            "procedures": len(db.procedures) if hasattr(db, 'procedures') else 0,
            "body_parts": len(db.body_parts) if hasattr(db, 'body_parts') else 0,
            "medical_specialties": len(db.medical_specialties) if hasattr(db, 'medical_specialties') else 0,
            "emergency_keywords": len(db.emergency_keywords) if hasattr(db, 'emergency_keywords') else 0,
            "medical_abbreviations": len(db.medical_abbreviations) if hasattr(db, 'medical_abbreviations') else 0,
            "anatomical_terms": len(db.anatomical_terms) if hasattr(db, 'anatomical_terms') else 0,
            "diagnostic_criteria": len(db.diagnostic_criteria) if hasattr(db, 'diagnostic_criteria') else 0
        }

    return HealthResponse(
        status="healthy",
        message="Enhanced Medical Assistant Chatbot with AI models is running",
        dataset_size=len(chatbot.df) if hasattr(chatbot, 'df') and chatbot.df is not None else 0,
        features_loaded=chatbot.knowledge_base.shape[1] if hasattr(chatbot,
                                                                   'knowledge_base') and chatbot.knowledge_base is not None else 0,
        ai_models_loaded=ai_models_status,
        medical_databases_loaded=medical_db_stats
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
            comprehensive_analysis = result.get('comprehensive_analysis', {})
            follow_up_questions = chatbot.generate_follow_up_questions(comprehensive_analysis)

        return ChatResponse(
            response=result,
            follow_up_questions=follow_up_questions,
            emergency=result.get('emergency', False),
            model_used=result.get('model_used', 'traditional'),
            comprehensive_analysis=result.get('comprehensive_analysis')
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
        # Use the enhanced AI analysis method
        result = chatbot._enhanced_ai_analysis(request.query, {})
        return {
            "analysis": result.get('ai_analysis', ''),
            "symptoms": result.get('comprehensive_analysis', {}).get('symptoms', []),
            "success": True,
            "model_used": "medgemma"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing symptoms: {str(e)}")


@router.get("/medical-databases", response_model=MedicalDatabaseResponse)
async def get_medical_databases():
    """Get comprehensive medical databases information"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    try:
        db = chatbot.medical_databases
        return MedicalDatabaseResponse(
            symptoms=db.symptom_database,
            conditions=db.condition_database,
            medications=db.medication_database,
            lab_tests=db.lab_tests,
            procedures=db.procedures,
            body_parts=db.body_parts,
            medical_specialties=db.medical_specialties,
            emergency_keywords=db.emergency_keywords,
            medical_abbreviations=db.medical_abbreviations,
            anatomical_terms=db.anatomical_terms,
            diagnostic_criteria=db.diagnostic_criteria
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving medical databases: {str(e)}")


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


@router.get("/medications")
async def get_medications_database():
    """Get available medications database"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "medications": chatbot.medical_databases.medication_database,
        "total_categories": len(chatbot.medical_databases.medication_database)
    }


@router.get("/lab-tests")
async def get_lab_tests_database():
    """Get available lab tests database"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "lab_tests": chatbot.medical_databases.lab_tests,
        "total_categories": len(chatbot.medical_databases.lab_tests)
    }


@router.get("/procedures")
async def get_procedures_database():
    """Get available procedures database"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    return {
        "procedures": chatbot.medical_databases.procedures,
        "total_categories": len(chatbot.medical_databases.procedures)
    }


@router.get("/models/status")
async def get_models_status():
    """Get status of AI models"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    medgemma_loaded = chatbot.medgemma is not None
    medsiglip_loaded = chatbot.medsiglip is not None

    return {
        "medgemma": {
            "loaded": medgemma_loaded,
            "description": "Medical text generation and analysis",
            "capabilities": ["symptom analysis", "diagnosis prediction",
                             "treatment recommendations"] if medgemma_loaded else []
        },
        "medsiglip": {
            "loaded": medsiglip_loaded,
            "description": "Medical image analysis and classification",
            "capabilities": ["skin condition analysis", "x-ray interpretation",
                             "MRI/CT analysis"] if medsiglip_loaded else []
        },
        "traditional_models": {
            "loaded": True,
            "description": "TF-IDF based similarity matching and medical entity extraction",
            "capabilities": ["symptom extraction", "condition matching", "medication identification",
                             "lab test recognition", "procedure identification"]
        }
    }


@router.post("/comprehensive-analysis")
async def comprehensive_analysis_endpoint(request: ChatRequest):
    """Perform comprehensive medical analysis using all database components"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    try:
        # Perform comprehensive analysis
        comprehensive_analysis = chatbot.text_processor.comprehensive_medical_analysis(request.query)

        return {
            "comprehensive_analysis": comprehensive_analysis,
            "analysis_timestamp": pd.Timestamp.now().isoformat(),
            "entities_extracted": {
                "symptoms": len(comprehensive_analysis.get('symptoms', [])),
                "conditions": len(comprehensive_analysis.get('conditions', [])),
                "medications": len(comprehensive_analysis.get('medications', [])),
                "lab_tests": len(comprehensive_analysis.get('lab_tests', [])),
                "procedures": len(comprehensive_analysis.get('procedures', [])),
                "abbreviations": len(comprehensive_analysis.get('abbreviations', [])),
                "anatomical_terms": len(comprehensive_analysis.get('anatomical_terms', [])),
                "body_systems": len(comprehensive_analysis.get('body_systems_affected', [])),
                "diagnostic_criteria_matches": len(comprehensive_analysis.get('diagnostic_criteria_matches', []))
            },
            "emergency_level": comprehensive_analysis.get('emergency_level', 'non_urgent'),
            "recommended_specialists": comprehensive_analysis.get('recommended_specialists', [])
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error performing comprehensive analysis: {str(e)}")


@router.get("/cache/info")
async def get_cache_info():
    """Get cache information"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    try:
        cache_info = chatbot.cache_manager.get_cache_info()
        return cache_info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving cache info: {str(e)}")


@router.post("/cache/clear")
async def clear_cache():
    """Clear the cache"""
    if chatbot is None:
        raise HTTPException(status_code=503, detail="Chatbot not initialized")

    try:
        success = chatbot.cache_manager.clear_cache()
        return {"success": success, "message": "Cache cleared successfully" if success else "Failed to clear cache"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing cache: {str(e)}")


# Initialize chatbot when module is imported
@router.on_event("startup")
async def startup_event():
    """Initialize chatbot on startup"""
    print("🚀 Starting up Enhanced Medical Assistant Chatbot API...")
    success = initialize_chatbot()
    if success:
        print("✅ Chatbot API started successfully!")
    else:
        print("❌ Failed to initialize chatbot API")