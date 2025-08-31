package com.aarogya.doctor_service.services.implementation;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.clients.AppointmentGrpcClient;
import com.aarogya.doctor_service.clients.UserGrpcClient;
import com.aarogya.doctor_service.dto.grpc.AppointmentDto;
import com.aarogya.doctor_service.dto.grpc.PatientResponseDTO;
import com.aarogya.doctor_service.dto.request.CreateRatingRequest;
import com.aarogya.doctor_service.dto.request.HelpfulVoteRequest;
import com.aarogya.doctor_service.dto.request.RatingFilterRequest;
import com.aarogya.doctor_service.dto.response.RatingResponse;
import com.aarogya.doctor_service.dto.response.RatingStatsResponse;
import com.aarogya.doctor_service.dto.response.RatingSummaryResponse;
import com.aarogya.doctor_service.enums.RatingSortBy;
import com.aarogya.doctor_service.enums.RatingTag;
import com.aarogya.doctor_service.enums.ReportReason;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.DoctorRating;
import com.aarogya.doctor_service.models.DoctorRatingSummary;
import com.aarogya.doctor_service.models.HelpfulVote;
import com.aarogya.doctor_service.repositories.DoctorRatingRepository;
import com.aarogya.doctor_service.repositories.DoctorRatingSummaryRepository;
import com.aarogya.doctor_service.repositories.HelpfulVoteRepository;
import com.aarogya.doctor_service.services.RatingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final DoctorRatingRepository ratingRepository;
    private final DoctorRatingSummaryRepository summaryRepository;
    private final HelpfulVoteRepository helpfulVoteRepository;
    private final UserGrpcClient userGrpcClient;
    private final AppointmentGrpcClient appointmentServiceClient;
    private final MongoTemplate mongoTemplate;

    private static final String RATING_CACHE = "doctorRatings";
    private static final String SUMMARY_CACHE = "ratingSummary";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = RATING_CACHE, key = "#request.doctorId"),
            @CacheEvict(value = SUMMARY_CACHE, key = "#request.doctorId")
    })
    public RatingResponse createRating(CreateRatingRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating rating for doctor {} by patient {}", request.getDoctorId(), patientId);

        validateRatingRequest(request);

        Optional<DoctorRating> existingRating = ratingRepository.findByDoctorIdAndPatientId(
                request.getDoctorId(), patientId);

        if (existingRating.isPresent()) {
            throw new BadRequestException("You have already rated this doctor");
        }

        String patientName = getPatientName(patientId);

        DoctorRating rating = buildRating(request, patientId, patientName);
        DoctorRating savedRating = ratingRepository.save(rating);

        updateRatingSummary(request.getDoctorId());

        log.info("Rating created successfully with ID: {}", savedRating.getId());
        return convertToResponse(savedRating, patientId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = RATING_CACHE, key = "#result.doctorId"),
            @CacheEvict(value = SUMMARY_CACHE, key = "#result.doctorId")
    })
    public RatingResponse updateRating(String ratingId, CreateRatingRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating rating {} by patient {}", ratingId, patientId);

        DoctorRating existingRating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + ratingId));

        validateRatingOwnership(existingRating, patientId);
        validateRatingRequest(request);

        updateRatingFields(existingRating, request);
        DoctorRating updatedRating = ratingRepository.save(existingRating);

        updateRatingSummary(existingRating.getDoctorId());

        log.info("Rating updated successfully with ID: {}", ratingId);
        return convertToResponse(updatedRating, patientId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = RATING_CACHE, key = "#result?.doctorId"),
            @CacheEvict(value = SUMMARY_CACHE, key = "#result?.doctorId")
    })
    public void deleteRating(String ratingId) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting rating {} by patient {}", ratingId, patientId);

        DoctorRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + ratingId));

        validateRatingOwnership(rating, patientId);

        rating.setIsActive(false);
        ratingRepository.save(rating);

        updateRatingSummary(rating.getDoctorId());

        log.info("Rating deleted successfully with ID: {}", ratingId);
    }

    @Override
    @Cacheable(value = RATING_CACHE, key = "#ratingId")
    public RatingResponse getRating(String ratingId) {
        log.debug("Fetching rating with ID: {}", ratingId);

        DoctorRating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + ratingId));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        return convertToResponse(rating, currentUserId);
    }

    @Override
    @Cacheable(value = RATING_CACHE, key = "#doctorId + '_' + #filter.toString() + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<RatingResponse> getDoctorRatings(String doctorId, RatingFilterRequest filter, Pageable pageable) {
        log.debug("Fetching ratings for doctor: {} with filter: {}", doctorId, filter);

        Page<DoctorRating> ratingsPage = applyFilters(doctorId, filter, pageable);
        String currentUserId = UserContextHolder.getUserDetails().getUserId();

        return ratingsPage.map(rating -> convertToResponse(rating, currentUserId));
    }

    @Override
    @Cacheable(value = SUMMARY_CACHE, key = "#doctorId")
    public RatingSummaryResponse getRatingSummary(String doctorId) {
        log.debug("Fetching rating summary for doctor: {}", doctorId);

        DoctorRatingSummary summary = summaryRepository.findByDoctorId(doctorId)
                .orElseGet(() -> createDefaultSummary(doctorId));

        return convertToSummaryResponse(summary);
    }

    @Override
    public RatingStatsResponse getRatingStats(String doctorId) {
        log.debug("Fetching rating stats for doctor: {}", doctorId);

        List<DoctorRating> ratings = ratingRepository.findByDoctorIdAndIsActiveTrue(doctorId);

        Map<String, AppointmentDto> appointmentMap = appointmentServiceClient
                .findByIds(ratings.stream()
                        .map(DoctorRating::getAppointmentId)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList()));

        return RatingStatsResponse.builder()
                .totalRatings(ratings.size())
                .ratingsThisMonth(countRatingsThisMonth(ratings))
                .ratingsThisWeek(countRatingsThisWeek(ratings))
                .helpfulVotesReceived(countHelpfulVotes(ratings))
                .averageResponseTime(calculateAverageResponseTime(ratings, appointmentMap))
                .patientSatisfactionScore(calculateSatisfactionScore(ratings))
                .build();
    }

    @Override
    @Transactional
    public RatingResponse voteHelpful(HelpfulVoteRequest request) {
        String patientId = UserContextHolder.getUserDetails().getUserId();
        log.info("Patient {} voting helpful for rating {}", patientId, request.getRatingId());

        DoctorRating rating = ratingRepository.findById(request.getRatingId())
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found with id: " + request.getRatingId()));

        if (request.getIsHelpful()) {
            addHelpfulVote(request.getRatingId(), patientId);
        } else {
            removeHelpfulVote(request.getRatingId(), patientId);
        }

        DoctorRating updatedRating = ratingRepository.findById(request.getRatingId())
                .orElseThrow(() -> new ResourceNotFoundException("Rating not found after update"));

        return convertToResponse(updatedRating, patientId);
    }

    // Private helper methods
    private void validateRatingRequest(CreateRatingRequest request) {
        if (request.getRating() == null) {
            throw new BadRequestException("Rating is required");
        }

        if (request.getReview() != null && request.getReview().length() > 1000) {
            throw new BadRequestException("Review cannot exceed 1000 characters");
        }

        if (request.getTags() != null) {
            validateTags(request.getTags());
        }
    }

    private void validateTags(List<String> tags) {
        Set<String> validTags = Arrays.stream(RatingTag.values())
                .map(Enum::name)
                .collect(Collectors.toSet());

        for (String tag : tags) {
            if (!validTags.contains(tag)) {
                throw new BadRequestException("Invalid tag: " + tag);
            }
        }
    }

    private void validateRatingOwnership(DoctorRating rating, String patientId) {
        if (!rating.getPatientId().equals(patientId)) {
            throw new BadRequestException("You can only modify your own ratings");
        }
    }

    private void validateReportReason(String reason) {
        try {
            ReportReason.valueOf(reason);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid report reason: " + reason);
        }
    }

    private String getPatientName(String patientId) {
        PatientResponseDTO patientResponseDTO = userGrpcClient.getPatient(patientId);
        log.debug("Fetching patient name for ID: {}", patientId);
        return patientResponseDTO.getFirstName() + patientResponseDTO.getLastName();
    }

    private DoctorRating buildRating(CreateRatingRequest request, String patientId, String patientName) {
        return DoctorRating.builder()
                .doctorId(request.getDoctorId())
                .patientId(patientId)
                .patientName(patientName)
                .rating(request.getRating())
                .review(request.getReview())
                .appointmentId(request.getAppointmentId())
                .prescriptionId(request.getPrescriptionId())
                .tags(request.getTags())
                .wouldRecommend(request.getWouldRecommend())
                .waitTimeRating(request.getWaitTimeRating())
                .staffRating(request.getStaffRating())
                .facilityRating(request.getFacilityRating())
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .isVerified(false)
                .isActive(true)
                .helpfulCount(0)
                .reportCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void updateRatingFields(DoctorRating rating, CreateRatingRequest request) {
        if (request.getRating() != null) {
            rating.setRating(request.getRating());
        }
        if (request.getReview() != null) {
            rating.setReview(request.getReview());
        }
        if (request.getTags() != null) {
            rating.setTags(request.getTags());
        }
        if (request.getWouldRecommend() != null) {
            rating.setWouldRecommend(request.getWouldRecommend());
        }
        if (request.getWaitTimeRating() != null) {
            rating.setWaitTimeRating(request.getWaitTimeRating());
        }
        if (request.getStaffRating() != null) {
            rating.setStaffRating(request.getStaffRating());
        }
        if (request.getFacilityRating() != null) {
            rating.setFacilityRating(request.getFacilityRating());
        }
        if (request.getIsAnonymous() != null) {
            rating.setIsAnonymous(request.getIsAnonymous());
        }
        rating.setUpdatedAt(LocalDateTime.now());
    }

    private RatingResponse convertToResponse(DoctorRating rating, String currentUserId) {
        boolean hasUserVoted = helpfulVoteRepository.existsByRatingIdAndPatientId(rating.getId(), currentUserId);

        return RatingResponse.builder()
                .id(rating.getId())
                .doctorId(rating.getDoctorId())
                .patientId(rating.getPatientId())
                .patientName(rating.getIsAnonymous() ? "Anonymous" : rating.getPatientName())
                .rating(rating.getRating())
                .review(rating.getReview())
                .appointmentId(rating.getAppointmentId())
                .prescriptionId(rating.getPrescriptionId())
                .tags(rating.getTags())
                .wouldRecommend(rating.getWouldRecommend())
                .waitTimeRating(rating.getWaitTimeRating())
                .staffRating(rating.getStaffRating())
                .facilityRating(rating.getFacilityRating())
                .isVerified(rating.getIsVerified())
                .isAnonymous(rating.getIsAnonymous())
                .helpfulCount(rating.getHelpfulCount())
                .hasUserVotedHelpful(hasUserVoted)
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }

    private Page<DoctorRating> applyFilters(String doctorId, RatingFilterRequest filter, Pageable pageable) {
        Query query = new Query();
        query.addCriteria(Criteria.where("doctorId").is(doctorId));

        if (filter != null) {
            if (filter.getMinRating() != null && filter.getMaxRating() != null) {
                query.addCriteria(Criteria.where("rating").gte(filter.getMinRating()).lte(filter.getMaxRating()));
            } else if (filter.getMinRating() != null) {
                query.addCriteria(Criteria.where("rating").gte(filter.getMinRating()));
            } else if (filter.getMaxRating() != null) {
                query.addCriteria(Criteria.where("rating").lte(filter.getMaxRating()));
            }

            if (filter.getTags() != null && !filter.getTags().isEmpty()) {
                query.addCriteria(Criteria.where("tags").all(filter.getTags()));
            }

            if (Boolean.TRUE.equals(filter.getHasReview())) {
                query.addCriteria(Criteria.where("review").ne(null).ne(""));
            }

            if (filter.getWouldRecommend() != null) {
                query.addCriteria(Criteria.where("wouldRecommend").is(filter.getWouldRecommend()));
            }

            if (filter.getIsVerified() != null) {
                query.addCriteria(Criteria.where("isVerified").is(filter.getIsVerified()));
            }
        }

        if (filter != null && filter.getSortBy() != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder())
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            query.with(Sort.by(direction, filter.getSortBy()));
        }

        query.with(pageable);

        List<DoctorRating> results = mongoTemplate.find(query, DoctorRating.class);
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), DoctorRating.class);

        return new PageImpl<>(results, pageable, total);
    }


    private Pageable applySorting(Pageable pageable, RatingFilterRequest filter) {
        if (filter != null && filter.getSortBy() != null) {
            try {
                RatingSortBy sortBy = RatingSortBy.valueOf(filter.getSortBy().toUpperCase());
                Sort.Direction direction = getSortDirection(filter.getSortOrder());

                Sort sort = switch (sortBy) {
                    case NEWEST, OLDEST -> Sort.by(direction, "createdAt");
                    case HIGHEST_RATING, LOWEST_RATING -> Sort.by(direction, "rating");
                    case MOST_HELPFUL -> Sort.by(direction, "helpfulCount");
                };

                return org.springframework.data.domain.PageRequest.of(
                        pageable.getPageNumber(), pageable.getPageSize(), sort);
            } catch (IllegalArgumentException e) {
                log.warn("Invalid sort by value: {}", filter.getSortBy());
            }
        }
        return pageable;
    }

    private Sort.Direction getSortDirection(String sortOrder) {
        if (sortOrder != null && sortOrder.equalsIgnoreCase("desc")) {
            return Sort.Direction.DESC;
        }
        return Sort.Direction.ASC;
    }

    private void updateRatingSummary(String doctorId) {
        List<DoctorRating> ratings = ratingRepository.findByDoctorIdAndIsActiveTrue(doctorId);

        if (ratings.isEmpty()) {
            summaryRepository.findByDoctorId(doctorId).ifPresent(summaryRepository::delete);
            return;
        }

        DoctorRatingSummary summary = calculateSummary(doctorId, ratings);
        summaryRepository.save(summary);
    }

    private DoctorRatingSummary calculateSummary(String doctorId, List<DoctorRating> ratings) {
        Map<Integer, Integer> ratingCounts = new HashMap<>();
        double totalRating = 0;
        double totalWaitTime = 0;
        double totalStaff = 0;
        double totalFacility = 0;
        int recommendCount = 0;
        Map<String, Integer> tagFrequency = new HashMap<>();

        int waitTimeCount = 0;
        int staffCount = 0;
        int facilityCount = 0;
        int recommendTotal = 0;

        for (DoctorRating rating : ratings) {
            ratingCounts.merge(rating.getRating(), 1, Integer::sum);
            totalRating += rating.getRating();

            if (rating.getWaitTimeRating() != null) {
                totalWaitTime += rating.getWaitTimeRating();
                waitTimeCount++;
            }
            if (rating.getStaffRating() != null) {
                totalStaff += rating.getStaffRating();
                staffCount++;
            }
            if (rating.getFacilityRating() != null) {
                totalFacility += rating.getFacilityRating();
                facilityCount++;
            }
            if (rating.getWouldRecommend() != null) {
                recommendTotal++;
                if (rating.getWouldRecommend()) {
                    recommendCount++;
                }
            }

            if (rating.getTags() != null) {
                for (String tag : rating.getTags()) {
                    tagFrequency.merge(tag, 1, Integer::sum);
                }
            }
        }

        return DoctorRatingSummary.builder()
                .doctorId(doctorId)
                .averageRating(ratings.isEmpty() ? 0.0 : totalRating / ratings.size())
                .totalRatings(ratings.size())
                .rating1Count(ratingCounts.getOrDefault(1, 0))
                .rating2Count(ratingCounts.getOrDefault(2, 0))
                .rating3Count(ratingCounts.getOrDefault(3, 0))
                .rating4Count(ratingCounts.getOrDefault(4, 0))
                .rating5Count(ratingCounts.getOrDefault(5, 0))
                .averageWaitTimeRating(waitTimeCount == 0 ? 0.0 : totalWaitTime / waitTimeCount)
                .averageStaffRating(staffCount == 0 ? 0.0 : totalStaff / staffCount)
                .averageFacilityRating(facilityCount == 0 ? 0.0 : totalFacility / facilityCount)
                .recommendationRate(recommendTotal == 0 ? 0.0 : (double) recommendCount / recommendTotal * 100)
                .tagFrequency(tagFrequency)
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private DoctorRatingSummary createDefaultSummary(String doctorId) {
        return DoctorRatingSummary.builder()
                .doctorId(doctorId)
                .averageRating(0.0)
                .totalRatings(0)
                .rating1Count(0)
                .rating2Count(0)
                .rating3Count(0)
                .rating4Count(0)
                .rating5Count(0)
                .averageWaitTimeRating(0.0)
                .averageStaffRating(0.0)
                .averageFacilityRating(0.0)
                .recommendationRate(0.0)
                .tagFrequency(new HashMap<>())
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    private RatingSummaryResponse convertToSummaryResponse(DoctorRatingSummary summary) {
        Map<Integer, Integer> ratingDistribution = Map.of(
                1, summary.getRating1Count(),
                2, summary.getRating2Count(),
                3, summary.getRating3Count(),
                4, summary.getRating4Count(),
                5, summary.getRating5Count()
        );

        return RatingSummaryResponse.builder()
                .doctorId(summary.getDoctorId())
                .averageRating(summary.getAverageRating())
                .totalRatings(summary.getTotalRatings())
                .ratingDistribution(ratingDistribution)
                .averageWaitTimeRating(summary.getAverageWaitTimeRating())
                .averageStaffRating(summary.getAverageStaffRating())
                .averageFacilityRating(summary.getAverageFacilityRating())
                .recommendationRate(summary.getRecommendationRate())
                .tagFrequency(summary.getTagFrequency())
                .lastUpdated(summary.getLastUpdated())
                .build();
    }

    private void addHelpfulVote(String ratingId, String patientId) {
        if (helpfulVoteRepository.existsByRatingIdAndPatientId(ratingId, patientId)) {
            throw new BadRequestException("You have already voted for this rating");
        }

        HelpfulVote vote = HelpfulVote.builder()
                .ratingId(ratingId)
                .patientId(patientId)
                .createdAt(LocalDateTime.now())
                .build();

        helpfulVoteRepository.save(vote);

        ratingRepository.findById(ratingId).ifPresent(rating -> {
            rating.setHelpfulCount(rating.getHelpfulCount() + 1);
            ratingRepository.save(rating);
        });
    }

    private void removeHelpfulVote(String ratingId, String patientId) {
        helpfulVoteRepository.deleteByRatingIdAndPatientId(ratingId, patientId);

        ratingRepository.findById(ratingId).ifPresent(rating -> {
            rating.setHelpfulCount(Math.max(0, rating.getHelpfulCount() - 1));
            ratingRepository.save(rating);
        });
    }

    private Integer countRatingsThisMonth(List<DoctorRating> ratings) {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        return (int) ratings.stream()
                .filter(rating -> rating.getCreatedAt().isAfter(startOfMonth))
                .count();
    }

    private Integer countRatingsThisWeek(List<DoctorRating> ratings) {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);
        return (int) ratings.stream()
                .filter(rating -> rating.getCreatedAt().isAfter(startOfWeek))
                .count();
    }

    private Integer countHelpfulVotes(List<DoctorRating> ratings) {
        return ratings.stream()
                .mapToInt(DoctorRating::getHelpfulCount)
                .sum();
    }

    private Integer calculateAverageResponseTime(List<DoctorRating> ratings, Map<String, AppointmentDto> appointmentMap) {
        if (ratings == null || ratings.isEmpty()) {
            return 0;
        }

        long totalMinutes = 0;
        int count = 0;

        for (DoctorRating rating : ratings) {
            if (rating.getAppointmentId() != null) {
                AppointmentDto appointment = appointmentMap.get(rating.getAppointmentId());

                if (appointment != null && appointment.getCreatedAt() != null && appointment.getStartTime() != null && appointment.getAppointmentDate() != null) {
                    LocalDateTime appointmentStart = LocalDateTime.of(
                            appointment.getAppointmentDate(),
                            appointment.getStartTime()
                    );

                    Duration duration = Duration.between(appointment.getCreatedAt(), appointmentStart);

                    if (!duration.isNegative()) {
                        totalMinutes += duration.toMinutes();
                        count++;
                    }
                }
            }
        }
        if (count == 0) {
            return 0;
        }
        return (int) Math.round((double) totalMinutes / count / 60);
    }


    private Double calculateSatisfactionScore(List<DoctorRating> ratings) {
        if (ratings.isEmpty()) return 0.0;

        double totalScore = ratings.stream()
                .mapToInt(DoctorRating::getRating)
                .average()
                .orElse(0.0);

        return (totalScore / 5.0) * 100;
    }
}
