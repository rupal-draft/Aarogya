package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "drug_allergies")
public class DrugAllergy {

    @Id
    private String id;

    @Indexed
    private String patientId;

    private String allergen;
    private String allergenType;
    private String severity;
    private String reaction;
    private String symptoms;

    private String onsetDate;
    private String diagnosedBy;
    private String verificationStatus;

    private String notes;
    private boolean isActive;
    private String inactivatedBy;
    private LocalDateTime inactivatedAt;
    private String inactivationReason;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
