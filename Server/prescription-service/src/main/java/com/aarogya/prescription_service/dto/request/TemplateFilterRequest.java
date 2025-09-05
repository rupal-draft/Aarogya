package com.aarogya.prescription_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TemplateFilterRequest {
    private String searchQuery;
    private List<String> tags;
    private List<String> categories;
    private Boolean favoriteOnly;
    private Boolean sharedOnly;
    private Boolean activeOnly;
    private String sortBy;
    private String sortOrder;
    private Integer page;
    private Integer size;
}