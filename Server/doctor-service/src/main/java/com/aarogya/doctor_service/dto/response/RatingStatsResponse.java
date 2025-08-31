package com.aarogya.doctor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingStatsResponse {
    private Integer totalRatings;
    private Integer ratingsThisMonth;
    private Integer ratingsThisWeek;
    private Integer helpfulVotesReceived;
    private Integer averageResponseTime;
    private Double patientSatisfactionScore;
}
