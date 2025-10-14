from datetime import datetime
from typing import Dict, List
from .dataclasses import UrgencyLevel, SymptomDetail
from .data_loader import DataLoader
from .symptom_analyzer import SymptomAnalyzer
from .emergency_handler import EmergencyHandler
from .response_handler import ResponseHandler
from .flow_manager import FlowManager
from .assessment_tools import AssessmentTools


class EnhancedConversationManager:
    def __init__(self, db):
        self.db = db
        self.data_loader = DataLoader()
        self.symptom_analyzer = SymptomAnalyzer(self.data_loader)
        self.emergency_handler = EmergencyHandler(self.data_loader)
        self.flow_manager = FlowManager(self.data_loader)
        self.response_handler = ResponseHandler(self.data_loader, self.flow_manager)
        self.assessment_tools = AssessmentTools()

        from utils.symptom_keyword import SymptomKeyword
        self.symptom_keyword_manager = SymptomKeyword()
        self.symptom_keywords = self.symptom_keyword_manager._load_comprehensive_symptom_keywords()

    def process_message(self, session_id: str, user_message: str) -> Dict:
        """Enhanced message processing with comprehensive analysis"""
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        # Check for emergency
        if self.emergency_handler.detect_emergency(user_message):
            return self.emergency_handler.handle_emergency_response()

        # Add user message to session
        session['messages'].append({
            'role': 'user',
            'content': user_message,
            'timestamp': datetime.utcnow(),
            'processed': False
        })

        # Extract comprehensive symptom information
        extracted_symptoms = self.symptom_analyzer.extract_comprehensive_symptoms(
            user_message, self.symptom_keywords
        )

        # Update collected data with detailed symptoms
        if extracted_symptoms:
            existing_symptoms = session['collected_data'].get('detailed_symptoms', [])
            for new_symptom in extracted_symptoms:
                existing_found = False
                for existing_symptom in existing_symptoms:
                    if existing_symptom['name'] == new_symptom.name:
                        if new_symptom.severity:
                            existing_symptom['severity'] = new_symptom.severity
                        if new_symptom.duration:
                            existing_symptom['duration'] = new_symptom.duration
                        if new_symptom.location:
                            existing_symptom['location'] = new_symptom.location
                        if new_symptom.quality:
                            existing_symptom['quality'] = new_symptom.quality
                        existing_found = True
                        break

                if not existing_found:
                    existing_symptoms.append({
                        'name': new_symptom.name,
                        'severity': new_symptom.severity,
                        'duration': new_symptom.duration,
                        'location': new_symptom.location,
                        'quality': new_symptom.quality,
                        'triggers': new_symptom.triggers,
                        'relievers': new_symptom.relievers
                    })

            session['collected_data']['detailed_symptoms'] = existing_symptoms
            session['collected_data']['symptoms'] = list(set(
                session['collected_data'].get('symptoms', []) +
                [s.name for s in extracted_symptoms]
            ))

        # Check completion status
        is_completion = self.response_handler.is_completion_response(user_message)

        # Assess urgency
        detailed_symptoms = [
            SymptomDetail(
                name=s['name'],
                severity=s.get('severity'),
                duration=s.get('duration'),
                location=s.get('location'),
                quality=s.get('quality')
            ) for s in session['collected_data'].get('detailed_symptoms', [])
        ]
        urgency = self.emergency_handler.assess_urgency(detailed_symptoms)

        # Generate intelligent response
        current_step = session.get('current_step', 'symptom_collection')
        response = self.response_handler.generate_intelligent_response(
            session, current_step, user_message, is_completion, urgency
        )

        # Add assistant response
        session['messages'].append({
            'role': 'assistant',
            'content': response['message'],
            'timestamp': datetime.utcnow(),
            'step': current_step,
            'urgency': urgency.value
        })

        # Update session
        session['current_step'] = response.get('next_step', current_step)
        session['urgency_level'] = urgency.value
        session['last_updated'] = datetime.utcnow()
        session['messages'][-2]['processed'] = True

        # Save session
        self.db.update_chat_session(session_id, session)

        return response

    def get_comprehensive_summary(self, session_id: str) -> Dict:
        """Get comprehensive conversation and health summary"""
        session = self.db.get_chat_session(session_id)
        if not session:
            return {'error': 'Session not found'}

        collected_data = session['collected_data']
        detailed_symptoms = collected_data.get('detailed_symptoms', [])
        total_messages = len(session['messages'])
        user_messages = len([m for m in session['messages'] if m['role'] == 'user'])
        completeness_score = self.assessment_tools.calculate_completeness_score(collected_data)

        return {
            'session_id': session_id,
            'conversation_metrics': {
                'total_messages': total_messages,
                'user_messages': user_messages,
                'current_step': session.get('current_step'),
                'completeness_score': completeness_score,
                'urgency_level': session.get('urgency_level', 'low')
            },
            'symptom_analysis': {
                'primary_symptom': collected_data.get('primary_symptom'),
                'total_symptoms': len(collected_data.get('symptoms', [])),
                'detailed_symptoms': detailed_symptoms,
                'symptom_summary': self.response_handler.generate_symptom_summary(detailed_symptoms)
            },
            'medical_context': {
                'symptom_details': collected_data.get('symptom_details', {}),
                'medical_history': collected_data.get('medical_history'),
                'medications': collected_data.get('medications'),
                'triggers_relievers': collected_data.get('triggers_relievers'),
                'lifestyle_factors': collected_data.get('lifestyle_factors')
            },
            'assessment_readiness': {
                'ready_for_prediction': completeness_score >= 0.7,
                'missing_information': self.assessment_tools.identify_missing_information(collected_data),
                'recommendation': self.assessment_tools.get_next_step_recommendation(collected_data, completeness_score)
            }
        }