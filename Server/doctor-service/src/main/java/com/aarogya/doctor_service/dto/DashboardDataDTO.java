package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDataDTO {
    private DashboardStatsDTO stats;
    private List<AppointmentDTO> upcomingAppointments;
    private List<AppointmentDTO> todayAppointments;
    private List<ArticleDTO> recentArticles;
    private List<DoctorRatingDTO> recentRatings;
    private List<ReviewDTO> pendingReviews;
    private Map<String, Integer> appointmentsByHour;
    private Map<String, Integer> patientsByGender;
    private Map<String, Integer> patientsByAgeGroup;
    private Double averageRating;
    private Integer totalRatings;
    private Double averageConsultationTime;
    private Double averageWaitTime;
    private Integer totalPatientsThisMonth;
    private Integer totalAppointmentsThisMonth;
    private Integer totalPrescriptionsThisMonth;
    private List<DoctorNotificationDTO> recentNotifications;
}
