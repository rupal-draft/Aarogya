package com.aarogya.pharmacy_service.dto.medicine;

import jakarta.validation.constraints.*;
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
public class MedicineCreationDTO {
    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 100)
    private String manufacturer;

    @NotNull
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotNull
    @Min(0)
    private Integer stockQuantity;

    @NotBlank
    private String category;

    @NotNull
    private Boolean prescriptionRequired;

    @Size(max = 500)
    private String description;

    private LocalDateTime manufacturingDate;

    @Future
    private LocalDateTime expiryDate;

    private List<String> activeIngredients;
    private List<String> sideEffects;
    private String dosageInstructions;
}
