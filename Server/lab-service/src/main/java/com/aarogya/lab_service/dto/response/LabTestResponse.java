package com.aarogya.lab_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabTestResponse {

    private String id;
    private String testCode;
    private String testName;
    private String description;
    private String category;
    private BigDecimal price;
    private String sampleType;
    private Integer preparationTimeHours;
    private String preparationInstructions;
    private Integer resultTimeHours;
    private List<String> normalRanges;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
