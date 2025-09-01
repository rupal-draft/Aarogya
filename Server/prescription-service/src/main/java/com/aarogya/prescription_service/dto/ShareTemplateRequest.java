package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShareTemplateRequest {
    @NotBlank(message = "Target doctor ID is required")
    private String targetDoctorId;

    private String message;
}