package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.request.*;
import com.aarogya.prescription_service.dto.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrescriptionTemplateService {
    TemplateResponse createTemplate(CreateTemplateRequest request);
    TemplateResponse getTemplate(String templateId);
    Page<TemplateSummaryResponse> getTemplates(TemplateFilterRequest filter, Pageable pageable);
    TemplateResponse updateTemplate(String templateId, UpdateTemplateRequest request);
    void deleteTemplate(String templateId);
    PrescriptionResponse applyTemplate(ApplyTemplateRequest request);
    TemplateResponse duplicateTemplate(String templateId, DuplicateTemplateRequest request);
    TemplateResponse toggleFavorite(String templateId);
    CategoryResponse createCategory(CreateCategoryRequest request);
    List<CategoryResponse> getCategories();
    void deleteCategory(String categoryId);
    TemplateStatsResponse getTemplateStats();
    TemplateSearchSuggestion getTemplateSuggestions();
}
