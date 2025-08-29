package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescribedMedicineDto {
    @NotBlank(message = "Medicine ID is required")
    private String medicineId;

    @NotBlank(message = "Dosage is required")
    private String dosage;

    @NotBlank(message = "Frequency is required")
    private String frequency;

    @Min(value = 1, message = "Duration must be at least 1 day")
    private Integer duration;

    private String instructions;
    private Boolean isSubstitute = false;
    private String originalMedicineId;
}
