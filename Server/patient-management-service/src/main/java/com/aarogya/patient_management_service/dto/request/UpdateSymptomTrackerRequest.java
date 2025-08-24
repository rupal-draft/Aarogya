package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateSymptomTrackerRequest {

    private String symptomName;

    @Min(value = 1, message = "Severity must be between 1 and 10")
    @Max(value = 10, message = "Severity must be between 1 and 10")
    private Integer severity;

    private String description;
    private String category;
    private List<String> triggers;
    private String duration;
    private String frequency;
    private List<String> associatedSymptoms;
    private String notes;

    private LocalDateTime recordedAt;

}
