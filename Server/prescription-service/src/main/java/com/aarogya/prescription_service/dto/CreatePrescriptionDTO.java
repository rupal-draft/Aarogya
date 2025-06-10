package com.aarogya.prescription_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePrescriptionDTO {

    private String appointmentId;
    private String doctorId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String notes;

    @NotNull(message = "Valid until date is required")
    private LocalDateTime validUntil;

    private String followUpInstructions;
    private LocalDateTime nextFollowUp;

    private String emergencyContact;
    private String emergencyInstructions;

    private String pharmacyId;
    private String insuranceInfo;

    private Integer refillsAllowed;

    @NotEmpty(message = "At least one medicine is required")
    @Valid
    private List<PrescriptionMedicineDTO> medicines;

    private boolean ignoreInteractions = false;
}
