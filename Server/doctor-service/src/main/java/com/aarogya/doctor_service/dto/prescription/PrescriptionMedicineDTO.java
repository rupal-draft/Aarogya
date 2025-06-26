package com.aarogya.doctor_service.dto.prescription;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionMedicineDTO {
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
}
