package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.ResultFlag;
import com.aarogya.lab_service.enums.ResultStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResultResponseDto {

    private String id;
    private String orderId;
    private String testId;
    private String patientId;
    private ResultStatus status;
    private String value;
    private String unit;
    private String referenceRange;
    private ResultFlag flag;
    private String interpretation;
    private String methodology;
    private LocalDateTime resultDate;
    private String reviewedBy;
    private String approvedBy;
    private LocalDateTime approvedAt;
    private Boolean isCritical;
    private String criticalNotification;
    private List<String> attachments;
    private Map<String, Object> additionalData;
    private String comments;
    private String qualityControlInfo;
    private Integer dilutionFactor;
    private String patientFriendlyInterpretation;
    private String healthInsights;
    private String trendAnalysis;
    private Boolean shareableWithFamily;
    private String doctorRecommendations;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String testName;
    private String testCode;
    private String categoryName;
}
