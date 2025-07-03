package com.aarogya.lab_service.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LabReportRequestDto {

    @Size(max = 2000, message = "Summary cannot exceed 2000 characters")
    private String summary;

    @Size(max = 3000, message = "Interpretation cannot exceed 3000 characters")
    private String interpretation;

    @Size(max = 2000, message = "Recommendations cannot exceed 2000 characters")
    private String recommendations;

    @Size(max = 1500, message = "Clinical correlation cannot exceed 1500 characters")
    private String clinicalCorrelation;

    @Size(max = 1000, message = "Pathologist comments cannot exceed 1000 characters")
    private String pathologistComments;

    private String reportTemplate;

    private String deliveryMethod = "EMAIL";

    private Boolean isDigitallySigned = false;
}
