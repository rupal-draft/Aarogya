package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "disease_history")
public class DiseaseHistory {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @Indexed
    @NotBlank(message = "Disease name is required")
    private String diseaseName;

    @NotBlank(message = "Disease code is required")
    private String diseaseCode;

    @NotNull(message = "Diagnosis date is required")
    private LocalDate diagnosisDate;

    private LocalDate recoveryDate;

    @Indexed
    @Builder.Default
    private String status = "Active";

    @Builder.Default
    private String severity = "Mild";

    private String diagnosedBy;

    private String treatmentPlan;

    private List<String> symptoms;

    private List<String> complications;

    private String notes;

    @Builder.Default
    private boolean isChronic = false;

    @Builder.Default
    private boolean isHereditary = false;

    private String familyHistory;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
