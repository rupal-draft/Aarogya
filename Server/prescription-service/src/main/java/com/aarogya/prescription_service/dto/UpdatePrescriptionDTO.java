package com.aarogya.prescription_service.dto;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdatePrescriptionDTO {

    private String doctorId;
    private String diagnosis;
    private String notes;
    private String followUpInstructions;
    private LocalDateTime nextFollowUp;
    private String emergencyInstructions;

    @Valid
    private List<PrescriptionMedicineDTO> medicines;

    private boolean ignoreInteractions = false;
}
