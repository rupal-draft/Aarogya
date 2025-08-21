package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateLabResultRequest {

    @NotEmpty(message = "Result parameters are required")
    private List<LabResult.ResultParameter> parameters;

    @NotBlank(message = "Overall result is required")
    @Pattern(regexp = "NORMAL|ABNORMAL|CRITICAL", message = "Overall result must be NORMAL, ABNORMAL, or CRITICAL")
    private String overallResult;

    @Size(max = 1000, message = "Interpretation cannot exceed 1000 characters")
    private String interpretation;

    @Size(max = 500, message = "Technical notes cannot exceed 500 characters")
    private String technicalNotes;

    private String reportUrl;

    @NotNull(message = "Sample collected date time is required")
    private LocalDateTime sampleCollectedAt;

    @NotNull(message = "Result generated date time is required")
    private LocalDateTime resultGeneratedAt;

    private String labTechnicianId;
    private String pathologistId;
    private boolean isCritical;
}
