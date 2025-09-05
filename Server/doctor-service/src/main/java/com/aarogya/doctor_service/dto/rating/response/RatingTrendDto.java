package com.aarogya.doctor_service.dto.rating.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingTrendDto {
    private int year;
    private int month;
    private Double avgRating;
    private Long ratingCount;
}
