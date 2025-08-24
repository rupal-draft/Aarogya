package com.aarogya.patient_management_service.dto.response;

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
public class HealthAnalyticsResponse {

    private String patientId;
    private int analysisPeriodDays;
    private double overallHealthScore;
    private String healthTrend;
    private VitalsAnalytics vitalsAnalytics;
    private MedicationAnalytics medicationAnalytics;
    private SymptomAnalytics symptomAnalytics;
    private GoalAnalytics goalAnalytics;
    private List<HealthAlert> healthAlerts;
    private List<HealthRecommendation> recommendations;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VitalsAnalytics {
        private Map<String, Double> averageVitals;
        private Map<String, String> vitalsTrends;
        private List<String> abnormalVitals;
        private int totalVitalsRecords;
        private String lastRecordedDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MedicationAnalytics {
        private int totalMedications;
        private int activeMedications;
        private double adherenceRate;
        private int missedDoses;
        private List<String> upcomingRefills;
        private List<String> expiringSoon;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SymptomAnalytics {
        private int totalSymptoms;
        private Map<String, Integer> symptomFrequency;
        private List<String> mostCommonSymptoms;
        private String symptomTrend;
        private List<String> concerningPatterns;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GoalAnalytics {
        private int totalGoals;
        private int activeGoals;
        private int completedGoals;
        private double averageProgress;
        private List<String> nearingDeadline;
        private List<String> overdue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HealthAlert {
        private String id;
        private String type;
        private String severity;
        private String title;
        private String message;
        private String actionRequired;
        private String createdAt;
        private boolean isRead;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HealthRecommendation {
        private String id;
        private String category;
        private String title;
        private String description;
        private String priority;
        private String actionType;
        private String createdAt;
    }

    public String getHealthScoreText() {
        if (overallHealthScore >= 90) return "Excellent";
        if (overallHealthScore >= 80) return "Very Good";
        if (overallHealthScore >= 70) return "Good";
        if (overallHealthScore >= 60) return "Fair";
        return "Needs Attention";
    }

    public String getHealthScoreColor() {
        if (overallHealthScore >= 80) return "green";
        if (overallHealthScore >= 60) return "yellow";
        return "red";
    }

    public String getHealthTrend() {
        return healthTrend != null ? healthTrend : "Stable";
    }
}
