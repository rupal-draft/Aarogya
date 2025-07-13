package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.dto.request.SymptomAnalysisRequestDto;
import com.aarogya.lab_service.dto.response.TestRecommendationResponseDto;
import com.aarogya.lab_service.enums.RecommendationType;
import com.aarogya.lab_service.service.TestRecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.client.circuitbreaker.CircuitBreaker;
import org.springframework.cloud.client.circuitbreaker.CircuitBreakerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/recommendations")
@RequiredArgsConstructor
@Slf4j
public class TestRecommendationController {


    private final TestRecommendationService testRecommendationService;
    private final CircuitBreakerFactory circuitBreakerFactory;

    @PostMapping("/symptoms")
    public ResponseEntity<ApiResponse<TestRecommendationResponseDto>> getTestRecommendationsForSymptoms(
            @Valid @RequestBody SymptomAnalysisRequestDto requestDto) {
        log.info("Received request to analyze symptoms for recommendations");

        CircuitBreaker circuitBreaker = circuitBreakerFactory.create("labService");
        TestRecommendationResponseDto response = circuitBreaker.run(
                () -> testRecommendationService.getTestRecommendationsForSymptoms(requestDto),
                throwable -> fallbackSymptomAnalysis(requestDto.getSymptoms(), throwable)
        );

        log.debug("Generated {} recommendations for symptoms", response.getRecommendedTests().size());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    private TestRecommendationResponseDto fallbackSymptomAnalysis(List<String> symptoms, Throwable throwable) {
        log.warn("Fallback triggered for symptom analysis", throwable);
        TestRecommendationResponseDto fallbackResponse = new TestRecommendationResponseDto();
        fallbackResponse.setAiInsight("Recommendation service is temporarily unavailable. Please try again later.");
        return fallbackResponse;
    }

    @GetMapping("/preventive/{patientId}")
    public ResponseEntity<ApiResponse<List<TestRecommendationResponseDto>>> getPreventiveCareRecommendations(
            @PathVariable String patientId,
            @RequestParam int age,
            @RequestParam String gender) {
        log.info("Received request for preventive care recommendations for patient: {}", patientId);

        List<TestRecommendationResponseDto> response = testRecommendationService
                .getPreventiveCareRecommendations(patientId, age, gender);

        log.debug("Generated {} preventive recommendations", response.size());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/follow-up/{patientId}")
    public ResponseEntity<ApiResponse<TestRecommendationResponseDto>> getFollowUpRecommendations(
            @PathVariable String patientId,
            @RequestParam String previousTestId) {
        log.info("Received request for follow-up recommendations for patient: {}", patientId);

        TestRecommendationResponseDto response = testRecommendationService
                .getFollowUpRecommendations(patientId, previousTestId);

        log.debug("Generated follow-up recommendations for test: {}", previousTestId);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSmartTestSuggestions(@RequestParam String query) {
        log.info("Received request for test suggestions with query: {}", query);

        List<String> response = testRecommendationService.getSmartTestSuggestions(query);

        log.debug("Found {} suggestions for query: {}", response.size(), query);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/patient/{patientId}/history")
    public ResponseEntity<ApiResponse<List<TestRecommendationResponseDto>>> getRecommendationHistory(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Received request for recommendation history for patient: {}", patientId);

        List<TestRecommendationResponseDto> response = testRecommendationService
                .getRecommendationHistory(patientId, limit);

        log.debug("Fetched {} historical recommendations", response.size());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<TestRecommendationResponseDto>> getByDoctor(
            @PathVariable String doctorId) {
        log.info("Received request for recommendations by doctor: {}", doctorId);
        return ResponseEntity.ok(testRecommendationService.getRecommendationsByDoctor(doctorId));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TestRecommendationResponseDto>> getByType(
            @PathVariable String type) {
        log.info("Received request for recommendations by type: {}", type);
        return ResponseEntity.ok(testRecommendationService.getRecommendationsByType(RecommendationType.valueOf(type)));
    }

    @GetMapping("/pending-acceptance")
    public ResponseEntity<List<TestRecommendationResponseDto>> getPendingAcceptance() {
        log.info("Received request for pending acceptance recommendations");
        return ResponseEntity.ok(testRecommendationService.getPendingDoctorAcceptance());
    }

    @GetMapping("/high-confidence")
    public ResponseEntity<List<TestRecommendationResponseDto>> getHighConfidence(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime since) {
        log.info("Received request for high confidence recommendations");
        return ResponseEntity.ok(testRecommendationService.getRecentHighConfidenceRecommendations(since));
    }
}
