package com.aarogya.doctor_service.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatsDTO {
    private Integer totalAppointments;
    private Integer completedAppointments;
    private Integer cancelledAppointments;
    private Integer uniquePatients;
    private Integer avgConsultationMinutes;
}
