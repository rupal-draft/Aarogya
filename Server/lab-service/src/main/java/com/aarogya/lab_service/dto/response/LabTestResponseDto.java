package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.SampleType;
import com.aarogya.lab_service.enums.TestType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabTestResponseDto {

    private String id;
    private String name;
    private String code;
    private String description;
    private String categoryId;
    private String categoryName;
    private TestType type;
    private SampleType sampleType;
    private String unit;
    private BigDecimal price;
    private Integer processingTimeHours;
    private Boolean isFasting;
    private Boolean isUrgent;
    private String instructions;
    private String methodology;
    private List<String> keywords;
    private Map<String, Object> referenceRanges;
    private String reportTemplate;
    private String patientPreparationGuide;
    private List<String> commonReasons;
    private List<String> healthConditionsDetected;
    private String ageRecommendations;
    private List<String> symptomKeywords;
    private Boolean isActive;
    private Boolean requiresApproval;
    private Integer priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
