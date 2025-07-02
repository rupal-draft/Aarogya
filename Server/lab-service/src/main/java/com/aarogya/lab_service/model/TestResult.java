package com.aarogya.lab_service.model;

import com.aarogya.lab_service.enums.ResultFlag;
import com.aarogya.lab_service.enums.ResultStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Document(collection = "test_results")
@CompoundIndexes({
        @CompoundIndex(name = "order_test_idx", def = "{'orderId': 1, 'testId': 1}"),
        @CompoundIndex(name = "patient_date_idx", def = "{'patientId': 1, 'resultDate': -1}"),
        @CompoundIndex(name = "status_priority_idx", def = "{'status': 1, 'isCritical': -1}")
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TestResult {

    @Id
    private String id;

    @NotNull
    @Indexed
    private String orderId;

    @NotNull
    @Indexed
    private String testId;

    @NotNull
    @Indexed
    private String patientId;

    private ResultStatus status = ResultStatus.PENDING;

    private String value;

    private String unit;

    private String referenceRange;

    private ResultFlag flag = ResultFlag.NORMAL;

    private String interpretation;

    private String methodology;

    private LocalDateTime resultDate;

    private String reviewedBy;

    private String approvedBy;

    private LocalDateTime approvedAt;

    private Boolean isCritical = false;

    private String criticalNotification;

    private List<String> attachments;

    private Map<String, Object> additionalData;

    private String comments;

    private String qualityControlInfo;

    private Integer dilutionFactor = 1;

    private String patientFriendlyInterpretation;

    private String healthInsights;

    private String trendAnalysis;

    private Boolean shareableWithFamily;

    private String doctorRecommendations;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

}
