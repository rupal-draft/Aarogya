package com.aarogya.prescription_service.dto.response;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineDto {
    @NotBlank(message = "Medicine name is required")
    private String name;

    private List<String> substitutes;
    private List<String> sideEffects;
    private List<String> uses;
    private String chemicalClass;
    private Boolean habitForming;
    private String therapeuticClass;
    private String actionClass;
}
