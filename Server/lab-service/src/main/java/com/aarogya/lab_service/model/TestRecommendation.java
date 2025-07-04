package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.RecommendationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Document(collection = "test_recommendations")
public class TestRecommendation {

    @Id
    private String id;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private List<String> symptoms;

    private List<RecommendedTest> recommendedTests;

    private String aiInsight;

    private Double confidenceScore;

    private RecommendationType type;

    private String reasoning;

    private Boolean isAcceptedByDoctor = false;

    private Boolean isOrderedByDoctor = false;

    @CreatedDate
    private LocalDateTime createdAt;


    @AllArgsConstructor
    @NoArgsConstructor
    @Data
    @Builder
    public static class RecommendedTest {
        private String testId;
        private String testName;
        private String reason;
        private String urgency;
        private Double relevanceScore;
    }
}
