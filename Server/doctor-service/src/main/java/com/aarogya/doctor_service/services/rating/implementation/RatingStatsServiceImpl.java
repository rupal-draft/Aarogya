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
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

                Aggregation.project()
                        .andExpression("dateToString('%Y', createdAt)").as("yearStr")
                        .andExpression("dateToString('%m', createdAt)").as("monthStr")
                        .and("rating").as("rating"),

                Aggregation.group("yearStr", "monthStr")
                        .avg("rating").as("avgRating")
                        .count().as("ratingCount"),

                Aggregation.sort(Sort.by(Sort.Order.asc("_id.yearStr"), Sort.Order.asc("_id.monthStr"))),
                Aggregation.limit(12)
        );
        List<Document> rawResults = mongoTemplate.aggregate(agg, DoctorRating.class, Document.class)
                .getMappedResults();
        return rawResults.stream()
                .map(doc -> {
                    Document idDoc = (Document) doc.get("_id");

                    String yearStr = idDoc.getString("yearStr");
                    String monthStr = idDoc.getString("monthStr");

                    Number avgRatingNum = (Number) doc.get("avgRating");
                    Number ratingCountNum = (Number) doc.get("ratingCount");

                    return RatingTrendDto.builder()
                            .year(yearStr != null ? Integer.parseInt(yearStr) : 0)
                            .month(monthStr != null ? Integer.parseInt(monthStr) : 0)
                            .avgRating(avgRatingNum != null ? avgRatingNum.doubleValue() : 0.0)
                            .ratingCount(ratingCountNum != null ? ratingCountNum.longValue() : 0L)
                            .build();
                })
                .collect(Collectors.toList());
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
