package com.aarogya.patient_management_service.dto.response;

import com.aarogya.patient_management_service.repository.SymptomTrackerRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class SymptomStatsResponse {
    private List<SymptomSummaryResponse> symptomSummaries;
    private List<SymptomTrackerResponse> recentSymptoms;
    private int totalSymptoms;
    private LocalDateTime generatedAt;
}
