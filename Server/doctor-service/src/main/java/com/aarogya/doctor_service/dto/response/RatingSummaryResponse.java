package com.aarogya.doctor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingSummaryResponse {
    private String doctorId;
    private Double averageRating;
    private Integer totalRatings;
    private Map<Integer, Integer> ratingDistribution;
    private Double averageWaitTimeRating;
    private Double averageStaffRating;
    private Double averageFacilityRating;
    private Double recommendationRate;
    private Map<String, Integer> tagFrequency;
    private LocalDateTime lastUpdated;
}
