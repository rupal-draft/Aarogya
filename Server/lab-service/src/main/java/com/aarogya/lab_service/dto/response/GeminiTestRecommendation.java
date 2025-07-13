package com.aarogya.lab_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiTestRecommendation {
    private String testName;
    private String testCode;
    private String reason;
    private Double relevanceScore;
    private String urgency;
}
