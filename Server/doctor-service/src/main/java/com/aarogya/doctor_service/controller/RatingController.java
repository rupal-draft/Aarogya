package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.dto.rating.request.CreateRatingRequest;
import com.aarogya.doctor_service.dto.rating.request.HelpfulVoteRequest;
import com.aarogya.doctor_service.dto.rating.request.RatingFilterRequest;
import com.aarogya.doctor_service.dto.rating.response.RatingResponse;
import com.aarogya.doctor_service.dto.rating.response.RatingStatsResponse;
import com.aarogya.doctor_service.dto.rating.response.RatingSummaryResponse;
import com.aarogya.doctor_service.services.rating.RatingService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
@Slf4j
@RequiredArgsConstructor
@Validated
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @CircuitBreaker(name = "ratingController", fallbackMethod = "createRatingFallback")
    @RateLimiter(name = "ratingController")
    public ResponseEntity<RatingResponse> createRating(@Valid @RequestBody CreateRatingRequest request) {
        log.info("Creating rating for doctor: {}", request.getDoctorId());
        RatingResponse response = ratingService.createRating(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{ratingId}")
    @CircuitBreaker(name = "ratingController", fallbackMethod = "updateRatingFallback")
    public ResponseEntity<RatingResponse> updateRating(
            @PathVariable String ratingId,
            @Valid @RequestBody CreateRatingRequest request) {
        log.info("Updating rating: {}", ratingId);
        RatingResponse response = ratingService.updateRating(ratingId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> deleteRating(@PathVariable String ratingId) {
        log.info("Deleting rating: {}", ratingId);
        ratingService.deleteRating(ratingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{ratingId}")
    public ResponseEntity<RatingResponse> getRating(@PathVariable String ratingId) {
        log.debug("Fetching rating: {}", ratingId);
        RatingResponse response = ratingService.getRating(ratingId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<Page<RatingResponse>> getDoctorRatings(
            @PathVariable String doctorId,
            @ModelAttribute RatingFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        log.debug("Fetching ratings for doctor: {}", doctorId);
        Pageable pageable = PageRequest.of(page, size);
        Page<RatingResponse> response = ratingService.getDoctorRatings(doctorId, filter, pageable);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctor/{doctorId}/summary")
    public ResponseEntity<RatingSummaryResponse> getRatingSummary(@PathVariable String doctorId) {
        log.debug("Fetching rating summary for doctor: {}", doctorId);
        RatingSummaryResponse response = ratingService.getRatingSummary(doctorId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/doctor/{doctorId}/stats")
    public ResponseEntity<RatingStatsResponse> getRatingStats(@PathVariable String doctorId) {
        log.debug("Fetching rating stats for doctor: {}", doctorId);
        RatingStatsResponse response = ratingService.getRatingStats(doctorId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/helpful")
    @CircuitBreaker(name = "ratingController", fallbackMethod = "voteHelpfulFallback")
    public ResponseEntity<RatingResponse> voteHelpful(@Valid @RequestBody HelpfulVoteRequest request) {
        log.info("Voting helpful for rating: {}", request.getRatingId());
        RatingResponse response = ratingService.voteHelpful(request);
        return ResponseEntity.ok(response);
    }

    // Fallback methods
    public ResponseEntity<RatingResponse> createRatingFallback(CreateRatingRequest request, Throwable t) {
        log.error("Fallback triggered for createRating: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<RatingResponse> updateRatingFallback(String ratingId, CreateRatingRequest request, Throwable t) {
        log.error("Fallback triggered for updateRating: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<RatingResponse> voteHelpfulFallback(HelpfulVoteRequest request, Throwable t) {
        log.error("Fallback triggered for voteHelpful: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
