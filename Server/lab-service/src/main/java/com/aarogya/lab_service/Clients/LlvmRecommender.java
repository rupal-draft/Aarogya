package com.aarogya.lab_service.Clients;

import com.aarogya.lab_service.dto.request.FollowUpRequest;
import com.aarogya.lab_service.dto.request.PreventiveCareRequest;
import com.aarogya.lab_service.dto.request.SymptomAnalysisRequest;
import com.aarogya.lab_service.dto.response.GeminiRecommendationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "llm-recommender", url = "${gemini.service.url}")
public interface LlvmRecommender {

    @PostMapping("/recommend/tests")
    GeminiRecommendationResponse getTestRecommendations(
            @RequestBody SymptomAnalysisRequest request);

    @PostMapping("/recommend/preventive")
    GeminiRecommendationResponse getPreventiveRecommendations(
            @RequestBody PreventiveCareRequest request);

    @PostMapping("/recommend/followup")
    GeminiRecommendationResponse getFollowUpRecommendations(
            @RequestBody FollowUpRequest request);
}
