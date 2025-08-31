package com.aarogya.doctor_service.services.rating;

import com.aarogya.doctor_service.dto.rating.request.CreateRatingRequest;
import com.aarogya.doctor_service.dto.rating.request.HelpfulVoteRequest;
import com.aarogya.doctor_service.dto.rating.request.RatingFilterRequest;
import com.aarogya.doctor_service.dto.rating.response.RatingResponse;
import com.aarogya.doctor_service.dto.rating.response.RatingStatsResponse;
import com.aarogya.doctor_service.dto.rating.response.RatingSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RatingService {
    RatingResponse createRating(CreateRatingRequest request);
    RatingResponse updateRating(String ratingId, CreateRatingRequest request);
    void deleteRating(String ratingId);
    RatingResponse getRating(String ratingId);
    Page<RatingResponse> getDoctorRatings(String doctorId, RatingFilterRequest filter, Pageable pageable);
    RatingSummaryResponse getRatingSummary(String doctorId);
    RatingStatsResponse getRatingStats(String doctorId);
    RatingResponse voteHelpful(HelpfulVoteRequest request);
}
