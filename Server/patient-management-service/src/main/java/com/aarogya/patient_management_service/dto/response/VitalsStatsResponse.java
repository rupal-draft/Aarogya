package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class VitalsStatsResponse {

    private VitalStats bloodPressure;
    private VitalStats heartRate;
    private VitalStats temperature;
    private VitalStats oxygenSaturation;
    private VitalStats weight;
    private String overallHealthStatus;
    private String healthTrend;
    private LocalDateTime lastRecorded;
    private Integer totalRecords;
    private Integer daysAnalyzed;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VitalStats {
        private BigDecimal current;
        private BigDecimal average;
        private BigDecimal minimum;
        private BigDecimal maximum;
        private String trend;
        private String status;
        private BigDecimal changeFromPrevious;
        private String changePercentage;
    }
}

