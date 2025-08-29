package com.aarogya.prescription_service.dto;

import com.aarogya.prescription_service.enums.Severity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInteractionCheck {
    private String medicineId1;
    private String medicineId2;
    private String interactionDescription;
    private Severity severity;
}
