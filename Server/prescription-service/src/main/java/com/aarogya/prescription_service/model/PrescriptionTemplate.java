package com.aarogya.prescription_service.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "prescription_templates")
public class PrescriptionTemplate {

    @Id
    private String id;

    @Indexed
    private String doctorId;

    private String templateName;
    private String description;
    private String category;
    private String condition;

    private List<TemplateMedicine> medicines;

    private String standardInstructions;
    private String followUpInstructions;
    private String emergencyInstructions;

    private Integer usageCount;
    private LocalDateTime lastUsed;

    private boolean isPublic;
    private boolean isApproved;
    private String approvedBy;
    private LocalDateTime approvedAt;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemplateMedicine {
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
