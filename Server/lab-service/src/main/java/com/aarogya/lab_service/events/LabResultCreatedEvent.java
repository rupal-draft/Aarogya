package com.aarogya.lab_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabResultCreatedEvent {

    private String resultId;
    private String orderId;
    private String orderNumber;

    private String patientId;
    private String patientName;
    private String patientEmail;

    private String doctorId;
    private String doctorName;
    private String doctorEmail;

    private String testId;
    private String testName;
    private String testCode;

    private List<ResultParameter> parameters;
    private String overallResult;
    private String interpretation;
    private String reportUrl;
    private LocalDateTime resultGeneratedAt;

    private boolean isCritical;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResultParameter {
        private String parameterName;
        private String value;
        private String unit;
        private String normalRange;
        private String status;
    }
}
