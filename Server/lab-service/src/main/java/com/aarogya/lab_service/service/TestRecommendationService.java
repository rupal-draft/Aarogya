package com.aarogya.lab_service.service;


import com.aarogya.lab_service.dto.request.SymptomAnalysisRequestDto;
import com.aarogya.lab_service.dto.response.TestRecommendationResponseDto;
import com.aarogya.lab_service.enums.RecommendationType;

import java.time.LocalDateTime;
import java.util.List;

public interface TestRecommendationService {


    TestRecommendationResponseDto getTestRecommendationsForSymptoms(SymptomAnalysisRequestDto requestDto);


    List<TestRecommendationResponseDto> getPreventiveCareRecommendations(String patientId, int age, String gender);


    TestRecommendationResponseDto getFollowUpRecommendations(String patientId, String previousTestId);


    List<String> getSmartTestSuggestions(String searchQuery);

    TestRecommendationResponseDto setRecommendationDoctorStatus(
            String recommendationId, boolean accepted, String notes);


    List<TestRecommendationResponseDto> markRecommendationsAsOrdered(List<String> recommendationIds);


    List<TestRecommendationResponseDto> getRecommendationHistory(String patientId, int limit);

    List<TestRecommendationResponseDto> getRecommendationsByDoctor(String doctorId);

    List<TestRecommendationResponseDto> getRecommendationsByType(RecommendationType type);

    List<TestRecommendationResponseDto> getPendingDoctorAcceptance();

    List<TestRecommendationResponseDto> getRecentHighConfidenceRecommendations(LocalDateTime since);
}
