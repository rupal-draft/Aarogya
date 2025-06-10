package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drug_interactions")
public class DrugInteraction {

    @Id
    private String id;

    @Indexed
    private String patientId;

    @Indexed
    private String prescriptionId;

    private String drug1;
    private String drug2;
    private String interactionType;
    private String severity;
    private String description;

    private String source;
    private String referenceUrl;

    private String status;
    private LocalDateTime detectedAt;

    private String resolution;
    private String resolvedBy;
    private LocalDateTime resolvedAt;
}

