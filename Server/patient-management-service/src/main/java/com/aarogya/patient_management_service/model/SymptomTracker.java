package com.aarogya.patient_management_service.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
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

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Symptom name is required")
    private String symptomName;

    @NotNull(message = "Severity is required")
    private Integer severity;

    private String description;

    private List<String> triggers;

    private String duration;

    private String frequency;

    private List<String> associatedSymptoms;

    private String notes;

    @CreatedDate
    private LocalDateTime recordedAt;
}
