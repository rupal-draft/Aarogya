package com.aarogya.appointment_service.dto.grpc;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
@NotBlank
public class AppointmentStatsDto {
    int todayAppointments;
    int upcomingAppointments; // next 7 days
    int completedAppointments;
    int inProgressAppointments;
    int rejectedAppointments;
    int followupAppointments;
    int emergencyAppointments;
    int overdueFollowupAppointments;
    int pendingFollowupAppointments;
}
