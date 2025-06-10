package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionMedicineDTO {

    private String id;
    private String prescriptionId;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String genericName;
    private String brandName;
    private String strength;
    private String dosageForm;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
    private String route;

    private String timing;
    private boolean withFood;
    private String specialTiming;

    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    private Integer quantityDispensed;
    private String unit;

    private String medicineCode;
    private String manufacturer;
    private Double unitPrice;
    private Double totalPrice;

    private String warnings;
    private String sideEffects;
    private String contraindications;
    private String interactions;

    private boolean substitutionAllowed;
    private String substitutionReason;

    private LocalDateTime createdAt;
}
