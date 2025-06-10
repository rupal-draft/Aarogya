package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrugInteractionDTO {

    private String id;
    private String prescriptionId;
    private String patientId;
    private String drug1;
    private String drug2;
    private String interactionType;
    private String severity;
    private String description;
    private String clinicalEffect;
    private String mechanism;
    private String management;
    private String recommendation;

    private String source;
    private String evidenceLevel;
    private String referenceUrl;

    private String status;
    private String resolution;
    private String resolvedBy;
    private LocalDateTime resolvedAt;

    private LocalDateTime detectedAt;
}
