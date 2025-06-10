package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionSummaryDTO {

    private Integer totalPrescriptions;
    private Integer activePrescriptions;
    private Integer completedPrescriptions;
    private Integer cancelledPrescriptions;

    private List<DailyCount> dailyCounts;
    private List<DiagnosisCount> topDiagnoses;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyCount {
        private String date;
        private Integer count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiagnosisCount {
        private String diagnosis;
        private Integer count;
    }
}
