package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineInventoryDTO {

    private String id;

    @NotBlank(message = "Medicine code is required")
    private String medicineCode;

    @NotBlank(message = "Medicine name is required")
    private String medicineName;

    private String medicineImage;
    private String genericName;
    private String brandName;
    private String strength;
    private String dosageForm;
    private String manufacturer;

    @NotNull(message = "Current stock is required")
    @Positive(message = "Current stock must be positive")
    private Integer currentStock;

    private Integer minimumStock;
    private Integer maximumStock;
    private Integer reorderLevel;
    private Integer reorderQuantity;

    private Double unitCost;
    private Double sellingPrice;
    private String currency;

    private LocalDate expiryDate;
    private String batchNumber;
    private LocalDate manufacturingDate;

    private String storageConditions;
    private String location;
    private String pharmacyId;

    private String status;
    private boolean isControlledSubstance;
    private String controlledSubstanceSchedule;

    private String fdaApprovalNumber;
    private boolean isPrescriptionRequired;
    private boolean isGenericAvailable;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
