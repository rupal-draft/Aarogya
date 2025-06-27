package com.aarogya.doctor_service.dto.appointments;

import com.aarogya.doctor_service.dto.doctor.DoctorResponseDTO;
import com.aarogya.doctor_service.dto.patient.PatientResponseDTO;
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
    private String review;
    private DoctorResponseDTO doctor;
    private String status;
    private LocalDateTime createdAt;

    private String predictedDisease;
    private String symptoms;
    private String description;
    private String precautions;
    private String diet;
    private String workout;

    private PatientResponseDTO patient;
}
