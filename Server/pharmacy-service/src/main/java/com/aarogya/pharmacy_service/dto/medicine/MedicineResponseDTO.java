package com.aarogya.pharmacy_service.dto.medicine;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineResponseDTO {
    private String id;
    private String name;
    private String manufacturer;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
    private Boolean prescriptionRequired;
    private String description;
    private LocalDateTime manufacturingDate;
    private LocalDateTime expiryDate;
    private List<String> activeIngredients;
    private List<String> sideEffects;
    private String dosageInstructions;
    private List<String> images;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
