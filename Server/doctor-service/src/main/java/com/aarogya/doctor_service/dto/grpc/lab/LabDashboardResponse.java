package com.aarogya.doctor_service.dto.grpc.lab;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LabDashboardResponse {
    private Long totalTestsOrdered;
    private Long completedResults;
    private Long pendingResults;
    private Long verifiedResults;
    private Long criticalResults;
    private Double avgTurnaroundTimeHours;
    private List<TopLabTestDto> topTests;
    private Long abnormalParameters;
    private Long doctorNotificationsSent;
    private Long uniquePatientsTested;
    private List<LabTestTrendDto> monthlyTestTrend;
}
