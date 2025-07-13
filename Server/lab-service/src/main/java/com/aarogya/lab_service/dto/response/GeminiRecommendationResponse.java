package com.aarogya.lab_service.dto.response;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeminiRecommendationResponse {
    @NotEmpty
    private List<@Valid GeminiTestRecommendation> recommendations = new ArrayList<>();

    @Min(0) @Max(1)
    private Double confidenceScore = 0.5;

    @NotBlank
    private String aiInsight = "No insights provided";
}
