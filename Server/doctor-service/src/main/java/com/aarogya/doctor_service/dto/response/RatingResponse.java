package com.aarogya.doctor_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private String id;
    private String doctorId;
    private String patientId;
    private String patientName;
    private Integer rating;
    private String review;
    private String appointmentId;
    private String prescriptionId;
    private List<String> tags;
    private Boolean wouldRecommend;
    private Integer waitTimeRating;
    private Integer staffRating;
    private Integer facilityRating;
    private Boolean isVerified;
    private Boolean isAnonymous;
    private Integer helpfulCount;
    private Boolean hasUserVotedHelpful;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
