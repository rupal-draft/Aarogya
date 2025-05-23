package com.aarogya.doctor_service.dto;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {
    private AppointmentStatsDTO appointmentStats;
    private RatingStatsDTO ratingStats;
    private List<PatientDemographicsDTO> patientDemographics;
    private List<DoctorRatingDTO> reviews;
}
