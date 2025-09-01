package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTemplateRequest {
    @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
    private String name;

    private String description;

    @Size(min = 1, max = 500, message = "Diagnosis must be between 1 and 500 characters")
    private String diagnosis;

    private String notes;
    private List<PrescribedMedicineDto> medicines;
    private List<String> tags;
    private List<String> applicableConditions;
    private Boolean isFavorite;
    private Boolean isShared;
    private String categoryId;
}
