package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.RecommendationType;
import com.aarogya.lab_service.model.TestRecommendation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestRecommendationResponseDto {

    private String id;
    private String patientId;
    private String doctorId;
    private List<String> symptoms;
    private List<TestRecommendation.RecommendedTest> recommendedTests;
    private String aiInsight;
    private Double confidenceScore;
    private RecommendationType type;
    private String reasoning;
    private Boolean isAcceptedByDoctor;
    private Boolean isOrderedByDoctor;
    private LocalDateTime createdAt;
    private String confidenceLevel;
    private String urgencyLevel;


    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
        this.confidenceLevel = calculateConfidenceLevel(confidenceScore);
    }

    private String calculateConfidenceLevel(Double score) {
        if (score >= 0.8) return "HIGH";
        if (score >= 0.6) return "MEDIUM";
        return "LOW";
    }
}
