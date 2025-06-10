package com.aarogya.doctor_service.services.implementations;

import com.aarogya.doctor_service.dto.ReviewDTO;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.Review;
import com.aarogya.doctor_service.repositories.ReviewRepository;
import com.aarogya.doctor_service.services.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public ReviewDTO createReview(String diseaseId, String doctorId) {
        Review review = Review.builder()
                .diseaseId(diseaseId)
                .doctorId(doctorId)
                .status("sent")
                .build();

        Review savedReview = reviewRepository.save(review);
        return modelMapper.map(savedReview, ReviewDTO.class);
    }

    @Override
    @Cacheable(value = "reviews", key = "'sent:' + #doctorId")
    public List<ReviewDTO> getSentReviews(String doctorId) {

        List<Review> reviews = reviewRepository.findByDoctorIdAndStatus(doctorId, "sent");

        // TODO: Fetch disease and patient details via gRPC

        return reviews.stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "reviews", key = "#doctorId + ':' + #reviewId")
    public ReviewDTO getReviewById(String doctorId, String reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Review does not belong to this doctor");
        }

        // TODO: Fetch disease and patient details via gRPC

        return modelMapper.map(review, ReviewDTO.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = "reviews", allEntries = true)
    public ReviewDTO updateReviewStatus(String doctorId, String reviewId, String status) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        if (!review.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Review does not belong to this doctor");
        }

        if (!"sent".equals(review.getStatus()) && !"reviewed".equals(status)) {
            throw new BadRequestException("Invalid status transition");
        }

        review.setStatus(status);
        Review updatedReview = reviewRepository.save(review);

        return modelMapper.map(updatedReview, ReviewDTO.class);
    }
}
