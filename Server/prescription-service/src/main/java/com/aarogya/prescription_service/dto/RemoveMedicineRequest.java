package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RemoveMedicineRequest {
    @NotBlank(message = "Medicine ID is required")
    private String medicineId;
}
