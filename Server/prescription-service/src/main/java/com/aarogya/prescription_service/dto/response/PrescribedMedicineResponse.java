package com.aarogya.prescription_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

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
    private Map<String, String> potentialInteractions;
}
