package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicine_inventory")
public class MedicineInventory {

    @Id
    private String id;

    @Indexed(unique = true)
    private String medicineCode;

    private String medicineName;
    private String genericName;
    private String brandName;
    private String strength;
    private String dosageForm;
    private String manufacturer;

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

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
