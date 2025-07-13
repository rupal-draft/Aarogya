package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.RecommendationType;
import com.aarogya.lab_service.model.TestRecommendation;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestRecommendationResponseDto {

    private String id;
    private String patientId;
    private String doctorId;
    private List<String> symptoms = new ArrayList<>();
    private List<@Valid RecommendedTestDto> recommendedTests = new ArrayList<>();
    private String aiInsight;
    private Double confidenceScore;
    private RecommendationType type;
    private String reasoning;
    private Boolean isAcceptedByDoctor = false;
    private Boolean isOrderedByDoctor = false;
    private LocalDateTime createdAt;
    private String confidenceLevel = "LOW";
    private String urgencyLevel = "LOW";

    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class RecommendedTestDto {
        private String testId;
        private String testName;
        private String reason;
        private String urgency;
        private Double relevanceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
        this.confidenceLevel = confidenceScore != null ?
                calculateConfidenceLevel(confidenceScore) : "LOW";
    }

    public String calculateConfidenceLevel(Double score) {
        if (score >= 0.8) return "HIGH";
        if (score >= 0.6) return "MEDIUM";
        return "LOW";
    }
}
