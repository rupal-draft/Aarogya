package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescription_analytics")
public class PrescriptionAnalytics {

    @Id
    private String id;

    @Indexed
    private String doctorId;

    @Indexed
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

    @CreatedDate
    private LocalDateTime createdAt;
}
