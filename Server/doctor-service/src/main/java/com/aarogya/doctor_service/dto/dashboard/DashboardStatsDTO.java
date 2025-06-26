package com.aarogya.doctor_service.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private Integer todayAppointments;
    private Integer pendingAppointments;
    private Integer totalPatients;
}
