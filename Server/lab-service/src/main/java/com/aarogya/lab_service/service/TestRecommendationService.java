package com.aarogya.lab_service.service;


import com.aarogya.lab_service.dto.request.SymptomAnalysisRequestDto;
import com.aarogya.lab_service.dto.response.TestRecommendationResponseDto;

import java.util.List;

public interface TestRecommendationService {


    TestRecommendationResponseDto getTestRecommendationsForSymptoms(SymptomAnalysisRequestDto requestDto);


    List<TestRecommendationResponseDto> getPreventiveCareRecommendations(String patientId, int age, String gender);


    TestRecommendationResponseDto getFollowUpRecommendations(String patientId, String previousTestId);


    List<String> getSmartTestSuggestions(String searchQuery);


    TestRecommendationResponseDto getLLMEnhancedTestRecommendations(SymptomAnalysisRequestDto requestDto);


    List<TestRecommendationResponseDto> getPersonalizedPreventiveRecommendations(
            String patientId, int age, String gender, String medicalHistory);


    TestRecommendationResponseDto getLLMEnhancedFollowUpRecommendations(
            String patientId, String previousTestId, String previousTestResults);


    TestRecommendationResponseDto setRecommendationStatus(
            String recommendationId, boolean accepted, String notes);


    List<TestRecommendationResponseDto> markRecommendationsAsOrdered(List<String> recommendationIds);


    List<TestRecommendationResponseDto> getRecommendationHistory(String patientId, int limit);
}
