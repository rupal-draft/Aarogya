package com.aarogya.lab_service.dto.request;

import com.aarogya.lab_service.enums.ResultFlag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResultRequestDto {

    @NotBlank(message = "Value is required")
    private String value;

    private String unit;

    private String referenceRange;

    private ResultFlag flag = ResultFlag.NORMAL;

    @Size(max = 1000, message = "Interpretation cannot exceed 1000 characters")
    private String interpretation;

    private String methodology;

    private Boolean isCritical = false;

    @Size(max = 500, message = "Critical notification cannot exceed 500 characters")
    private String criticalNotification;

    private List<String> attachments;

    private Map<String, Object> additionalData;

    @Size(max = 1000, message = "Comments cannot exceed 1000 characters")
    private String comments;

    private String qualityControlInfo;

    @Min(value = 1, message = "Dilution factor must be at least 1")
    private Integer dilutionFactor = 1;

    private String instrumentUsed;
}
