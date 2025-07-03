package com.aarogya.lab_service.dto.request;

import com.aarogya.lab_service.enums.SampleType;
import com.aarogya.lab_service.enums.TestType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabTestRequestDto {

    @NotBlank(message = "Test name is required")
    @Size(max = 100, message = "Test name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Test code is required")
    @Size(max = 20, message = "Test code cannot exceed 20 characters")
    @Pattern(regexp = "^[A-Z0-9_]+$", message = "Test code must contain only uppercase letters, numbers and underscores")
    private String code;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @NotBlank(message = "Category ID is required")
    private String categoryId;

    private TestType type = TestType.QUANTITATIVE;

    private SampleType sampleType = SampleType.BLOOD;

    @Size(max = 20, message = "Unit cannot exceed 20 characters")
    private String unit;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    private BigDecimal price;

    @NotNull(message = "Processing time is required")
    @Min(value = 1, message = "Processing time must be at least 1 hour")
    @Max(value = 168, message = "Processing time cannot exceed 168 hours (1 week)")
    private Integer processingTimeHours = 24;

    private Boolean isFasting = false;

    private Boolean isUrgent = false;

    @Size(max = 1000, message = "Instructions cannot exceed 1000 characters")
    private String instructions;

    @Size(max = 100, message = "Methodology cannot exceed 100 characters")
    private String methodology;

    private List<@Size(max = 50, message = "Keyword cannot exceed 50 characters") String> keywords;

    private Map<String, Object> referenceRanges;

    @Size(max = 100, message = "Report template name cannot exceed 100 characters")
    private String reportTemplate;

    @Size(max = 2000, message = "Patient preparation guide cannot exceed 2000 characters")
    private String patientPreparationGuide;

    private List<@Size(max = 100, message = "Reason cannot exceed 100 characters") String> commonReasons;

    private List<@Size(max = 100, message = "Condition cannot exceed 100 characters") String> healthConditionsDetected;

    @Size(max = 500, message = "Age recommendations cannot exceed 500 characters")
    private String ageRecommendations;

    private List<@Size(max = 50, message = "Symptom keyword cannot exceed 50 characters") String> symptomKeywords;

    private Boolean isActive = true;

    private Boolean requiresApproval = true;

    @Min(value = 1, message = "Priority must be at least 1")
    @Max(value = 10, message = "Priority cannot exceed 10")
    private Integer priority = 1;

}
