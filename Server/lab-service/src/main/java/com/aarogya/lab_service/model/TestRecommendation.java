package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.RecommendationType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
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

    @Builder.Default
    private List<String> symptoms = new ArrayList<>();

    @Builder.Default
    private List<RecommendedTest> recommendedTests = new ArrayList<>();

    private String aiInsight;

    private Double confidenceScore;

    private RecommendationType type;

    private String reasoning;

    @Min(value = 1, message = "Duration must be at least 1 day")
    @Max(value = 365, message = "Duration cannot exceed 365 days")
    private Integer durationInDays = 1;

    @Pattern(regexp = "MILD|MODERATE|SEVERE", message = "Severity must be MILD, MODERATE, or SEVERE")
    private String severity = "MODERATE";

    private String additionalNotes;

    @Builder.Default
    private Boolean isAcceptedByDoctor = false;

    @Builder.Default
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
