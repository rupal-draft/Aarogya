package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionAnalyticsDTO {

    private String id;
    private String doctorId;
    private LocalDate date;

    private Integer totalPrescriptions;
    private Integer activePrescriptions;
    private Integer completedPrescriptions;
    private Integer cancelledPrescriptions;
    private Integer refillPrescriptions;

    private Integer totalMedicinesPrescribed;
    private Integer uniqueMedicinesPrescribed;
    private Map<String, Integer> topMedicines;

    private Map<String, Integer> topDiagnoses;

    private Integer uniquePatients;
    private Integer newPatients;
    private Integer returningPatients;

    private Double totalPrescriptionValue;
    private Double averagePrescriptionValue;

    private Integer drugInteractionsDetected;
    private Integer criticalInteractions;
    private Integer allergyWarnings;

    private Map<String, Integer> pharmacyDistribution;
    private Integer electronicPrescriptions;
    private Integer paperPrescriptions;

    private Map<Integer, Integer> prescriptionsByHour;
    private Double averageProcessingTime;

    private LocalDateTime createdAt;
}
