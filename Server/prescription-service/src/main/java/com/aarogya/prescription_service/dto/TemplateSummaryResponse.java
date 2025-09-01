package com.aarogya.prescription_service.dto;

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
public class TemplateSummaryResponse {
    private String id;
    private String name;
    private String description;
    private String diagnosisPreview;
    private List<String> tags;
    private Integer usageCount;
    private Boolean isFavorite;
    private Boolean isShared;
    private Integer medicineCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
