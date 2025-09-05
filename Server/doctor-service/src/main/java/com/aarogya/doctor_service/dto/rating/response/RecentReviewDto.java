package com.aarogya.doctor_service.dto.rating.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecentReviewDto {
    private String patientName;
    private Integer rating;
    private String review;
    private Boolean isVerified;
    private Boolean isAnonymous;
    private LocalDateTime createdAt;
}
