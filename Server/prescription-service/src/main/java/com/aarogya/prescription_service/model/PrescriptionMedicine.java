package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescription_medicines")
public class PrescriptionMedicine {

    @Id
    private String id;

    @Indexed
    private String prescriptionId;

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

    @CreatedDate
    private LocalDateTime createdAt;
}
