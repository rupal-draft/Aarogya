package com.aarogya.doctor_service.dto.journal.response;

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
    private String name;
    private String description;
    private String titleTemplate;
    private String contentTemplate;
    private List<String> defaultTags;
    private String defaultType;
    private String category;
    private Boolean isSystem;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}