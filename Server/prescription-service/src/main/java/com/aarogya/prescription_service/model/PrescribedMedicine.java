package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescribedMedicine {
    private String medicineId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private Integer duration;
    private String instructions;
    private Boolean isSubstitute;
    private String originalMedicineId;
}
