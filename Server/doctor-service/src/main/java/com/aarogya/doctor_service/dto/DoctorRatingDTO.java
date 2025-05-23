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
public class DoctorRatingDTO {
    private String id;
    private String doctorId;
    private String patientId;
    private String appointmentId;
    private Integer rating;
    private String review;
    private LocalDateTime createdAt;
    private String patientName;
}
