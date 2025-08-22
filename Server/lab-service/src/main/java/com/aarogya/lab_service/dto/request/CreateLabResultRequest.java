package com.aarogya.lab_service.dto.request;

import com.aarogya.lab_service.models.LabResult;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateLabResultRequest {

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotBlank(message = "Test ID is required")
    private String testId;

    @NotEmpty(message = "At least one parameter is required")
    private List<LabResult.ResultParameter> parameters;

    @NotBlank(message = "Overall result is required")
    @Pattern(regexp = "NORMAL|ABNORMAL|CRITICAL", message = "Overall result must be NORMAL, ABNORMAL, or CRITICAL")
    private String overallResult;

    private String interpretation = "";

    private String technicalNotes = "";

    private String reportUrl = "";

    @NotNull(message = "Sample collection time is required")
    private LocalDateTime sampleCollectedAt;

    @NotNull(message = "Result generation time is required")
    private LocalDateTime resultGeneratedAt;

    @NotBlank(message = "Lab technician ID is required")
    private String labTechnicianId;

    private String pathologistId = "";

    private boolean isCritical = false;
}
