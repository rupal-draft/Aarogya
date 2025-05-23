package com.aarogya.doctor_service.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingStatsDTO {
    private Integer totalRatings;
    private Double averageRating;
    private Integer fiveStarRatings;
}
