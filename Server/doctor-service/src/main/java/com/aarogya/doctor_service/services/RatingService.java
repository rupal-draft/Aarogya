package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.request.CreateRatingRequest;
import com.aarogya.doctor_service.dto.request.HelpfulVoteRequest;
import com.aarogya.doctor_service.dto.request.RatingFilterRequest;
import com.aarogya.doctor_service.dto.response.RatingResponse;
import com.aarogya.doctor_service.dto.response.RatingStatsResponse;
import com.aarogya.doctor_service.dto.response.RatingSummaryResponse;
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
