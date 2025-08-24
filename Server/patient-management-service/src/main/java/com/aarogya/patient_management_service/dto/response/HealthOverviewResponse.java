package com.aarogya.patient_management_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HealthOverviewResponse {

    private String overallHealthStatus;
    private Integer healthScore;
    private String healthTrend;

    private Integer activeMedications;
    private Integer criticalAllergies;
    private Integer activeConditions;
    private LocalDateTime lastVitalsCheck;

    private VitalsStatsResponse.VitalStats latestVitals;

    // Health Alerts
    private List<HealthAlert> healthAlerts;

    // Medication Summary
    private MedicationSummary medicationSummary;

    // Upcoming Reminders
    private List<HealthReminder> upcomingReminders;

    // Health Goals Progress
    private List<GoalProgress> goalProgress;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HealthAlert {
        private String type; // CRITICAL, WARNING, INFO
        private String title;
        private String message;
        private LocalDateTime createdAt;
        private String actionRequired;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MedicationSummary {
        private Integer totalMedications;
        private Integer activeMedications;
        private Integer missedDoses;
        private BigDecimal adherenceRate;
        private String adherenceStatus;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class HealthReminder {
        private String type;
        private String title;
        private String description;
        private LocalDateTime dueAt;
        private String priority;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GoalProgress {
        private String goalName;
        private String goalType;
        private BigDecimal currentValue;
        private BigDecimal targetValue;
        private BigDecimal progressPercentage;
        private String status;
        private LocalDateTime targetDate;
    }
}
