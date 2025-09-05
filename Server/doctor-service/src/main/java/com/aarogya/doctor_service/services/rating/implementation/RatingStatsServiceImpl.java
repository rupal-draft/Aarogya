package com.aarogya.doctor_service.services.rating.implementation;

import com.aarogya.doctor_service.dto.rating.response.DoctorRatingDashboardResponse;
import com.aarogya.doctor_service.dto.rating.response.RatingTrendDto;
import com.aarogya.doctor_service.dto.rating.response.RecentReviewDto;
import com.aarogya.doctor_service.models.rating.DoctorRating;
import com.aarogya.doctor_service.models.rating.DoctorRatingSummary;
import com.aarogya.doctor_service.repositories.rating.DoctorRatingRepository;
import com.aarogya.doctor_service.repositories.rating.DoctorRatingSummaryRepository;
import com.aarogya.doctor_service.repositories.rating.HelpfulVoteRepository;
import com.aarogya.doctor_service.services.rating.RatingStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingStatsServiceImpl implements RatingStatsService {

    private final MongoTemplate mongoTemplate;
    private final DoctorRatingRepository doctorRatingRepository;
    private final DoctorRatingSummaryRepository doctorRatingSummaryRepository;
    private final HelpfulVoteRepository helpfulVoteRepository;

    @Override
    @Cacheable(value = "doctorRatingStats", key = "#doctorId")
    public DoctorRatingDashboardResponse getDoctorRatingStats(String doctorId) {
        DoctorRatingSummary summary = doctorRatingSummaryRepository.findByDoctorId(doctorId)
                .orElseGet(DoctorRatingSummary::new);

        long verifiedReviewsCount = doctorRatingRepository.countByDoctorIdAndIsVerified(doctorId, true);
        long anonymousReviewsCount = doctorRatingRepository.countByDoctorIdAndIsAnonymous(doctorId, true);

        long totalReviews = doctorRatingRepository.countByDoctorIdAndReviewIsNotNull(doctorId);

        long totalHelpfulVotes = helpfulVoteRepository.countByDoctorId(doctorId);

        long reportedReviewsCount = doctorRatingRepository.countByDoctorIdAndReportCountGreaterThan(doctorId, 0);

        List<RatingTrendDto> ratingTrends = getMonthlyRatingTrend(doctorId);

        List<RecentReviewDto> recentReviews = getRecentReviews(doctorId);

        return DoctorRatingDashboardResponse.builder()
                .averageRating(summary.getAverageRating())
                .totalRatings(summary.getTotalRatings())
                .rating1Count(summary.getRating1Count())
                .rating2Count(summary.getRating2Count())
                .rating3Count(summary.getRating3Count())
                .rating4Count(summary.getRating4Count())
                .rating5Count(summary.getRating5Count())
                .averageWaitTimeRating(summary.getAverageWaitTimeRating())
                .averageStaffRating(summary.getAverageStaffRating())
                .averageFacilityRating(summary.getAverageFacilityRating())
                .recommendationRate(summary.getRecommendationRate())
                .verifiedReviewsCount(verifiedReviewsCount)
                .anonymousReviewsCount(anonymousReviewsCount)
                .totalReviews(totalReviews)
                .totalHelpfulVotes(totalHelpfulVotes)
                .reportedReviewsCount(reportedReviewsCount)
                .tagFrequency(summary.getTagFrequency())
                .monthlyRatingTrend(ratingTrends)
                .recentReviews(recentReviews)
                .build();
    }

    private List<RatingTrendDto> getMonthlyRatingTrend(String doctorId) {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.project("rating")
                        .andExpression("year(createdAt)").as("year")
                        .andExpression("month(createdAt)").as("month"),
                Aggregation.group("year", "month")
                        .avg("rating").as("avgRating")
                        .count().as("ratingCount"),
                Aggregation.sort(Sort.Direction.DESC, "_id"),
                Aggregation.limit(12)
        );

        AggregationResults<RatingTrendDto> results = mongoTemplate.aggregate(agg, DoctorRating.class, RatingTrendDto.class);
        return results.getMappedResults();
    }

    private List<RecentReviewDto> getRecentReviews(String doctorId) {
        List<DoctorRating> ratings = doctorRatingRepository
                .findTop5ByDoctorIdOrderByCreatedAtDesc(doctorId);

        return ratings.stream().map(r -> RecentReviewDto.builder()
                .patientName(r.getIsAnonymous() ? "Anonymous" : r.getPatientName())
                .rating(r.getRating())
                .review(r.getReview())
                .isVerified(r.getIsVerified())
                .isAnonymous(r.getIsAnonymous())
                .createdAt(r.getCreatedAt())
                .build()
        ).toList();
    }
}
