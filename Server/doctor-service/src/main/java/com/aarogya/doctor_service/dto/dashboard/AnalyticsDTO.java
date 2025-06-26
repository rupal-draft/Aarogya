package com.aarogya.doctor_service.dto.dashboard;

import com.aarogya.doctor_service.dto.patient.PatientDemographicsDTO;
import com.aarogya.doctor_service.dto.appointments.RatingStatsDTO;
import com.aarogya.doctor_service.dto.doctor.DoctorRatingDTO;
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
