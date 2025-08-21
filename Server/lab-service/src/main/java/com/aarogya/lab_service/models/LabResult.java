package com.aarogya.lab_service.models;

import com.aarogya.lab_service.enums.ResultParameterStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "lab_results")
public class LabResult {
    @Id
    private String id;

    @Indexed
    private String orderId;

    @Indexed
    private String patientId;

    @Indexed
    private String doctorId;

    private String testId;
    private String testCode;
    private String testName;
    private List<ResultParameter> parameters;
    private String overallResult;
    private String interpretation;
    private String technicalNotes;
    private String reportUrl;
    private LocalDateTime sampleCollectedAt;
    private LocalDateTime resultGeneratedAt;
    private String labTechnicianId;
    private String pathologistId;
    private boolean isVerified;
    private boolean isCritical;
    private boolean isPatientNotified;
    private boolean isDoctorNotified;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class ResultParameter {
        private String parameterName;
        private String value;
        private String unit;
        private String normalRange;
        private ResultParameterStatus status;
        private String notes;
    }
}
