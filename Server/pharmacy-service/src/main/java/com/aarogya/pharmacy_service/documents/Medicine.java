package com.aarogya.pharmacy_service.documents;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.TextIndexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "medicines")
@CompoundIndex(def = "{'name': 'text', 'category': 'text', 'stockQuantity': 1, 'prescriptionRequired': 1}", unique = true)
public class Medicine {

    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    @TextIndexed
    private String name;

    @NotBlank(message = "Manufacturer is required")
    @Size(max = 100, message = "Manufacturer cannot exceed 100 characters")
    private String manufacturer;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.01", message = "Price must be greater than 0")
    private BigDecimal price;

    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Prescription requirement status is required")
    private Boolean prescriptionRequired;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @PastOrPresent(message = "Manufacturing date must be in the past or present")
    private LocalDateTime manufacturingDate;

    @Future(message = "Expiry date must be in the future")
    private LocalDateTime expiryDate;

    private List<String> activeIngredients;

    private List<String> sideEffects;

    private String dosageInstructions;

    @Indexed
    private LocalDateTime createdAt;

    @Indexed
    private LocalDateTime updatedAt;

    @Version
    private Long version;
}
