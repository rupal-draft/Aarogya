package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateLabTestRequest {

    @NotBlank(message = "Test code is required")
    @Size(max = 20, message = "Test code must not exceed 20 characters")
    private String testCode;

    @NotBlank(message = "Test name is required")
    @Size(max = 200, message = "Test name must not exceed 200 characters")
    private String testName;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @NotBlank(message = "Sample type is required")
    private String sampleType;

    @Min(value = 0, message = "Preparation time cannot be negative")
    private Integer preparationTimeHours = 0;

    private String preparationInstructions = "";

    @NotNull(message = "Result time is required")
    @Min(value = 1, message = "Result time must be at least 1 hour")
    private Integer resultTimeHours;

    @NotEmpty(message = "At least one normal range is required")
    private List<String> normalRanges;
}
