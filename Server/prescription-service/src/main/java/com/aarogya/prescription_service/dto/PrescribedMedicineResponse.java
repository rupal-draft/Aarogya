package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescribedMedicineResponse {
    private String medicineId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private Integer duration;
    private String instructions;
    private Boolean isSubstitute;
    private String originalMedicineId;
    private List<String> potentialInteractions;
}
