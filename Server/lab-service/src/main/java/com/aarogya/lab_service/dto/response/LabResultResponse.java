package com.aarogya.lab_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabResultResponse {

    private String id;
    private String orderId;
    private String orderNumber;
    private String patientId;
    private String patientName;
    private String doctorId;
    private String doctorName;
    private String testId;
    private String testCode;
    private String testName;
    private List<LabResult.ResultParameter> parameters;
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
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
