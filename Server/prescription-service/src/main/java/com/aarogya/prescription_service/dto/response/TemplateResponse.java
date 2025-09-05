package com.aarogya.prescription_service.dto.response;

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
public class TemplateResponse {
    private String id;
    private String doctorId;
    private String name;
    private String description;
    private String diagnosis;
    private String notes;
    private List<PrescribedMedicineResponse> medicines;
    private List<String> tags;
    private List<String> applicableConditions;
    private Integer usageCount;
    private Boolean isFavorite;
    private Boolean isActive;
    private Boolean isShared;
    private Integer shareCount;
    private String categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
