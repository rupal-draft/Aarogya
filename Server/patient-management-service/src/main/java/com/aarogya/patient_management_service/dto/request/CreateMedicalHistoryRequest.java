package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMedicalHistoryRequest {

    @NotBlank(message = "Condition name is required")
    private String conditionName;

    @NotNull(message = "Diagnosis date is required")
    private LocalDate diagnosisDate;

    private String status = "Active";

    private String notes = "";

    private String severity = "Moderate";

    private String category = "General";

    private boolean isActive = true;
}
