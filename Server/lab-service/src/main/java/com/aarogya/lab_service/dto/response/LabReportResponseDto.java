package com.aarogya.lab_service.dto.response;

import com.aarogya.lab_service.enums.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabReportResponseDto {

    private String id;
    private String orderId;
    private String patientId;
    private String doctorId;
    private ReportStatus status;
    private String reportNumber;
    private LocalDateTime reportDate;
    private List<String> testResultIds;
    private String summary;
    private String interpretation;
    private String recommendations;
    private String clinicalCorrelation;
    private String pathologistComments;
    private String reportTemplate;
    private String filePath;
    private String fileFormat;
    private Boolean isDigitallySigned;
    private String digitalSignature;
    private Map<String, Object> reportMetadata;
    private List<String> criticalValues;
    private String deliveryMethod;
    private LocalDateTime deliveredAt;
    private String deliveryStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private List<TestResultResponseDto> testResults;
    private PatientResponseDTO patientDetails;
    private DoctorResponseDTO doctorDetails;
}
