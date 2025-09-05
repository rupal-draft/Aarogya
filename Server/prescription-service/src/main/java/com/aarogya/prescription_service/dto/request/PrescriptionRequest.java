package com.aarogya.prescription_service.dto.request;

import com.aarogya.prescription_service.dto.response.PrescribedMedicineDto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionRequest {
    @NotBlank(message = "Appointment ID is required")
    private String appointmentId;

    @NotBlank(message = "Patient ID is required")
    private String patientId;

    @NotBlank(message = "Diagnosis is required")
    @Size(min = 5, max = 500, message = "Diagnosis must be between 5 and 500 characters")
    private String diagnosis;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    @NotEmpty(message = "At least one medicine is required")
    private List<PrescribedMedicineDto> medicines;
}
