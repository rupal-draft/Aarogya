package com.aarogya.doctor_service.dto.doctor;

import com.aarogya.doctor_service.dto.dashboard.DailyMetricsDTO;
import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorPerformanceDTO {
    private Integer totalAppointments;
    private Integer totalCancellations;
    private Integer totalNewPatients;
    private Integer totalReturningPatients;
    private Double averageConsultationTime;
    private Double averageWaitTime;
    private Integer totalPrescriptions;
    private Integer totalRatings;
    private Double averageRating;
    private List<DailyMetricsDTO> dailyMetrics;
}
