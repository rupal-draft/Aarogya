package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateLabTestRequest {

    @Size(max = 200, message = "Test name must not exceed 200 characters")
    private String testName;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    private String category;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String sampleType;

    @Min(value = 0, message = "Preparation time cannot be negative")
    private Integer preparationTimeHours;

    private String preparationInstructions;

    @Min(value = 1, message = "Result time must be at least 1 hour")
    private Integer resultTimeHours;

    private List<String> normalRanges;
}
