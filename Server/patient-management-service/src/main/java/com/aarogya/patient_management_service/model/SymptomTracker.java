package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "symptom_tracker")
public class SymptomTracker {

    @Id
    private String id;

    @Indexed
    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @Indexed
    @NotBlank(message = "Symptom name is required")
    private String symptomName;

    private String category;

    @Indexed
    @NotNull(message = "Severity is required")
    @Min(value = 1, message = "Severity must be between 1 and 10")
    @Max(value = 10, message = "Severity must be between 1 and 10")
    private Integer severity;

    private String description;

    private List<String> triggers;

    private String duration;

    private String frequency;

    private List<String> associatedSymptoms;

    private String notes;

    @Indexed
    private LocalDateTime recordedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
