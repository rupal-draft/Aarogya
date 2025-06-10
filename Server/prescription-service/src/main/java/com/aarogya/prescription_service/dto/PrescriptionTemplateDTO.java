package com.aarogya.prescription_service.dto;

import jakarta.validation.constraints.NotBlank;
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
public class PrescriptionTemplateDTO {

    private String id;
    private String doctorId;

    @NotBlank(message = "Template name is required")
    private String templateName;

    private String description;
    private String category;
    private String condition;

    private List<TemplateMedicineDTO> medicines;

    private String standardInstructions;
    private String followUpInstructions;
    private String emergencyInstructions;

    private Integer usageCount;
    private LocalDateTime lastUsed;

    private boolean isPublic;
    private boolean isApproved;
    private String approvedBy;
    private LocalDateTime approvedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemplateMedicineDTO {
        private String medicineName;
        private String genericName;
        private String strength;
        private String dosageForm;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
        private String route;
        private boolean isOptional;
        private String alternativeMedicine;
    }
}
