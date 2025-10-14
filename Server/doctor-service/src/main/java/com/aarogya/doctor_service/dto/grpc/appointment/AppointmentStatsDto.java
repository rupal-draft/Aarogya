package com.aarogya.doctor_service.dto.grpc.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
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
