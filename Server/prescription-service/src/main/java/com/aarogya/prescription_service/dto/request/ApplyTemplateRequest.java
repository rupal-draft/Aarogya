package com.aarogya.prescription_service.dto.request;


import com.aarogya.prescription_service.dto.response.PrescribedMedicineDto;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyTemplateRequest {
    @NotBlank(message = "Template ID is required")
    private String templateId;

    private String patientId;
    private String appointmentId;
    private String diagnosis;
    private String notes;
    private List<PrescribedMedicineDto> medicineOverrides;
    private Boolean trackUsage;
}
