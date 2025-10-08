package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.advices.ApiResponse;
import com.aarogya.prescription_service.dto.request.*;
import com.aarogya.prescription_service.dto.response.*;
import com.aarogya.prescription_service.service.PrescriptionTemplateService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/template")
@Slf4j
@RequiredArgsConstructor
@Validated
public class PrescriptionTemplateController {

    private final PrescriptionTemplateService prescriptionTemplateService;

    @PostMapping
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "createTemplateFallback")
    public ResponseEntity<TemplateResponse> createTemplate(@Valid @RequestBody CreateTemplateRequest request) {
        log.info("Creating prescription template");
        TemplateResponse response = prescriptionTemplateService.createTemplate(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{templateId}")
    public ResponseEntity<TemplateResponse> getTemplate(@PathVariable String templateId) {
        log.debug("Fetching prescription template: {}", templateId);
        TemplateResponse response = prescriptionTemplateService.getTemplate(templateId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<TemplateResponse>> getTemplates(
            @ModelAttribute TemplateFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortOrder) {

        log.debug("Fetching prescription templates with filter: {}", filter);
        Sort sort = sortOrder.equalsIgnoreCase("ASC") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TemplateResponse> response = prescriptionTemplateService.getTemplates(filter, pageable);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{templateId}")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "updateTemplateFallback")
    public ResponseEntity<TemplateResponse> updateTemplate(
            @PathVariable String templateId,
            @Valid @RequestBody UpdateTemplateRequest request) {
        log.info("Updating prescription template: {}", templateId);
        TemplateResponse response = prescriptionTemplateService.updateTemplate(templateId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{templateId}")
    public ResponseEntity<ApiResponse<String>> deleteTemplate(@PathVariable String templateId) {
        log.info("Deleting prescription template: {}", templateId);
        prescriptionTemplateService.deleteTemplate(templateId);
        return ResponseEntity.ok(ApiResponse.success("Template deleted successfully!"));
    }

    @PostMapping("/apply")
    @CircuitBreaker(name = "prescriptionController", fallbackMethod = "applyTemplateFallback")
    public ResponseEntity<PrescriptionResponse> applyTemplate(@Valid @RequestBody ApplyTemplateRequest request) {
        log.info("Applying prescription template");
        PrescriptionResponse response = prescriptionTemplateService.applyTemplate(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{templateId}/duplicate")
    public ResponseEntity<TemplateResponse> duplicateTemplate(
            @PathVariable String templateId,
            @Valid @RequestBody DuplicateTemplateRequest request) {
        log.info("Duplicating prescription template: {}", templateId);
        TemplateResponse response = prescriptionTemplateService.duplicateTemplate(templateId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{templateId}/favorite")
    public ResponseEntity<TemplateResponse> toggleFavorite(@PathVariable String templateId) {
        log.info("Toggling favorite for template: {}", templateId);
        TemplateResponse response = prescriptionTemplateService.toggleFavorite(templateId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/categories")
    public ResponseEntity<CategoryResponse> createCategory(@Valid @RequestBody CreateCategoryRequest request) {
        log.info("Creating template category");
        CategoryResponse response = prescriptionTemplateService.createCategory(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories() {
        log.debug("Fetching template categories");
        List<CategoryResponse> response = prescriptionTemplateService.getCategories();
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/categories/{categoryId}")
    public ResponseEntity<ApiResponse<String>> deleteCategory(@PathVariable String categoryId) {
        log.info("Deleting template category: {}", categoryId);
        prescriptionTemplateService.deleteCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully!"));
    }

    @GetMapping("/stats")
    public ResponseEntity<TemplateStatsResponse> getTemplateStats() {
        log.debug("Fetching template statistics");
        TemplateStatsResponse response = prescriptionTemplateService.getTemplateStats();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<TemplateSearchSuggestion> getTemplateSuggestions() {
        log.debug("Fetching template suggestions");
        TemplateSearchSuggestion response = prescriptionTemplateService.getTemplateSuggestions();
        return ResponseEntity.ok(response);
    }

    public ResponseEntity<TemplateResponse> createTemplateFallback(CreateTemplateRequest request, Throwable t) {
        log.error("Fallback triggered for createTemplate: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<TemplateResponse> updateTemplateFallback(String templateId, UpdateTemplateRequest request, Throwable t) {
        log.error("Fallback triggered for updateTemplate: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<PrescriptionResponse> applyTemplateFallback(ApplyTemplateRequest request, Throwable t) {
        log.error("Fallback triggered for applyTemplate: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
