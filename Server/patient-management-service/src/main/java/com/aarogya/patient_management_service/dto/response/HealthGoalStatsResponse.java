package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthGoalStatsResponse {
    private int totalGoals;
    private int activeGoals;
    private int completedGoals;
    private int overdueGoals;
    private double completionRate;
}
