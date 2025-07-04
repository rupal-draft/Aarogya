package com.aarogya.lab_service.util;

import java.util.List;

public class PromptBuilder {


    private String buildSymptomPrompt(List<String> symptoms, int age, String gender) {
        return String.format("""
            As a medical expert, recommend the most appropriate diagnostic tests for:
            Symptoms: %s
            Patient age: %d
            Patient gender: %s
            
            Provide your response in this exact JSON format:
            {
              "recommendations": [
                {
                  "test_name": "Test display name",
                  "test_code": "standard_medical_code",
                  "reason": "Brief clinical justification",
                  "relevance_score": 0.0-1.0,
                  "urgency": "HIGH/MEDIUM/LOW"
                }
              ],
              "confidence_score": 0.0-1.0,
              "ai_insight": "Detailed explanation of recommendations"
            }
            """, String.join(", ", symptoms), age, gender);
    }

    private String buildPreventivePrompt(int age, String gender) {
        return String.format("""
            As a preventive care specialist, recommend age and gender appropriate screening tests for:
            Age: %d
            Gender: %s
            
            Use current clinical guidelines and provide response in this exact JSON format:
            {
              "recommendations": [
                {
                  "test_name": "Test display name",
                  "test_code": "standard_medical_code",
                  "reason": "Brief clinical justification",
                  "relevance_score": 0.0-1.0,
                  "urgency": "HIGH/MEDIUM/LOW"
                }
              ],
              "confidence_score": 0.0-1.0,
              "ai_insight": "Detailed explanation of recommendations"
            }
            """, age, gender);
    }

    private String buildFollowUpPrompt(String previousTestName, String previousTestResult) {
        return String.format("""
            As a medical expert, recommend appropriate follow-up tests based on:
            Previous test: %s
            Test result: %s
            
            Provide response in this exact JSON format:
            {
              "recommendations": [
                {
                  "test_name": "Test display name",
                  "test_code": "standard_medical_code",
                  "reason": "Brief clinical justification",
                  "relevance_score": 0.0-1.0,
                  "urgency": "HIGH/MEDIUM/LOW"
                }
              ],
              "confidence_score": 0.0-1.0,
              "ai_insight": "Detailed explanation of recommendations"
            }
            """, previousTestName, previousTestResult);
    }
}
