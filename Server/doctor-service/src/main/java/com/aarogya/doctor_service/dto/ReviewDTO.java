package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDTO {
    private String id;
    private String diseaseId;
    private String doctorId;
    private String status;
    private LocalDateTime createdAt;

    private String predictedDisease;
    private String symptoms;
    private String description;
    private String precautions;
    private String diet;
    private String workout;

    private String patientId;
    private String patientFirstName;
    private String patientLastName;
    private String patientPhone;
    private String patientImageUrl;
}
