package com.aarogya.doctor_service.dto.rating.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorRatingDashboardResponse {
    private Double averageRating;
    private Integer totalRatings;
    private Integer rating1Count;
    private Integer rating2Count;
    private Integer rating3Count;
    private Integer rating4Count;
    private Integer rating5Count;

    private Double averageWaitTimeRating;
    private Double averageStaffRating;
    private Double averageFacilityRating;

    private Double recommendationRate;
    private Long verifiedReviewsCount;
    private Long anonymousReviewsCount;
    private Long totalReviews;
    private Long totalHelpfulVotes;
    private Long reportedReviewsCount;
    private Map<String, Integer> tagFrequency;

    private List<RatingTrendDto> monthlyRatingTrend;
    private List<RecentReviewDto> recentReviews;
}
