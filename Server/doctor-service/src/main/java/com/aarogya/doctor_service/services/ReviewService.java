package com.aarogya.doctor_service.services;

import com.aarogya.doctor_service.dto.ReviewDTO;

import java.util.List;

public interface ReviewService {

    ReviewDTO createReview(String diseaseId, String doctorId);

    List<ReviewDTO> getSentReviews(String doctorId);

    ReviewDTO getReviewById(String doctorId, String reviewId);

    ReviewDTO updateReviewStatus(String doctorId, String reviewId, String status);
}