from pymongo import MongoClient
from datetime import datetime, timedelta
from bson import ObjectId
import os
from typing import Dict, List, Optional


class DatabaseManager:
    def __init__(self):
        # MongoDB connection
        self.mongo_uri = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client['medical_history']
        # Collections
        self.consultations = self.db['consultations']
        self.diseases = self.db['diseases']
        self.chat_sessions = self.db['chat_sessions']

        # Create indexes
        self._create_indexes()

    def _create_indexes(self):
        """Create database indexes for better performance"""
        self.consultations.create_index("user_id")
        self.consultations.create_index("created_at")
        self.chat_sessions.create_index("user_id")
        self.chat_sessions.create_index("session_id", unique=True)

    # Consultation Management
    def save_consultation(self, consultation_data: Dict) -> str:
        """Save a complete consultation"""
        consultation_data.update({
            'created_at': datetime.utcnow(),
            'consultation_id': self._generate_consultation_id()
        })
        result = self.consultations.insert_one(consultation_data)
        return str(result.inserted_id)

    def get_user_consultations(self, user_id: str, limit: int = 10) -> List[Dict]:
        """Get user's consultation history"""
        return list(self.consultations.find(
            {'user_id': user_id}
        ).sort('created_at', -1).limit(limit))

    def get_consultation_by_id(self, consultation_id: str) -> Optional[Dict]:
        """Get specific consultation"""
        return self.consultations.find_one({'consultation_id': consultation_id})

    # Chat Session Management
    def create_chat_session(self, session_data: Dict) -> str:
        """Create a new chat session"""
        session_data.update({
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'status': 'active'
        })
        result = self.chat_sessions.insert_one(session_data)
        return str(result.inserted_id)

    def update_chat_session(self, session_id: str, update_data: Dict) -> bool:
        """Update chat session"""
        update_data['updated_at'] = datetime.utcnow()
        result = self.chat_sessions.update_one(
            {'session_id': session_id},
            {'$set': update_data}
        )
        return result.modified_count > 0

    def get_chat_session(self, session_id: str) -> Optional[Dict]:
        """Get chat session"""
        return self.chat_sessions.find_one({'session_id': session_id})

    # Disease Information Management
    def save_disease_info(self, disease_data: Dict) -> str:
        """Save disease information from Ollama"""
        disease_data.update({
            'created_at': datetime.utcnow(),
            'source': 'ollama_gemma3'
        })
        result = self.diseases.insert_one(disease_data)
        return str(result.inserted_id)

    def get_disease_info(self, disease_name: str) -> Optional[Dict]:
        """Get cached disease information"""
        return self.diseases.find_one({'disease_name': disease_name})

    # Utility Methods
    def _generate_consultation_id(self) -> str:
        """Generate unique consultation ID"""
        from uuid import uuid4
        return f"CONS_{uuid4().hex[:8].upper()}"


# Updated database schemas
CONSULTATION_SCHEMA = {
    "consultation_id": "CONS_12345678",
    "user_id": "user_12345678",  # From JWT token
    "session_id": "session_uuid",
    "symptoms": ["fever", "headache", "nausea"],
    "symptom_details": {
        "fever": {"severity": "high", "duration": "2 days"},
        "headache": {"severity": "moderate", "duration": "1 day"}
    },
    "predicted_diseases": [
        {
            "disease": "Malaria",
            "confidence": 0.85,
            "risk_level": "high"
        }
    ],
    "ai_recommendations": {
        "disease": "Malaria",
        "precautions": ["Rest", "Stay hydrated"],
        "diet": ["Light foods", "Plenty of fluids"],
        "medications": ["Consult doctor for antimalarials"],
        "when_to_see_doctor": "Immediately due to high risk",
        "specialist_type": "Infectious Disease Specialist",
        "emergency_signs": ["High fever", "Severe headache"]
    },
    "risk_assessment": "high",
    "doctor_recommendation": "immediate",
    "created_at": "datetime"
}

CHAT_SESSION_SCHEMA = {
    "session_id": "session_uuid",
    "user_id": "user_12345678",  # From JWT token
    "messages": [
        {
            "role": "assistant",
            "content": "Hello! I'm your medical assistant.",
            "timestamp": "datetime"
        },
        {
            "role": "user",
            "content": "I have a fever",
            "timestamp": "datetime"
        }
    ],
    "current_step": "symptom_collection",
    "collected_data": {
        "symptoms": [],
        "user_info": {}
    },
    "status": "active",
    "created_at": "datetime",
    "updated_at": "datetime"
}
