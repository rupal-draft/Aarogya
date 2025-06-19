package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.advices.ApiError;
import com.aarogya.prescription_service.advices.ApiResponse;
import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.PrescriptionTemplateDTO;
import com.aarogya.prescription_service.service.PrescriptionTemplateService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prescription-templates")
@RequiredArgsConstructor
@Validated
@Slf4j
public class PrescriptionTemplateController {

    private final PrescriptionTemplateService templateService;
    private static final String TEMPLATE_SERVICE = "templateService";

    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> templateFallback(Throwable throwable) {
        log.warn("Fallback method called for template service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Template service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<List<PrescriptionTemplateDTO>>> templateListFallback(Throwable throwable) {
        log.warn("Fallback method called for template service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Template service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<Page<PrescriptionTemplateDTO>>> templatePageFallback(Throwable throwable) {
        log.warn("Fallback method called for template service", throwable);
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Template service is currently unavailable. Please try again later.")
                .setStatus(HttpStatus.SERVICE_UNAVAILABLE)
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> operationSuccessFallback(Throwable throwable) {
        return ResponseEntity.ok(ApiResponse.success("Operation may not have completed due to high load. Please verify status."));
    }

    @PostMapping
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> createTemplate(
            @Valid @RequestBody PrescriptionTemplateDTO templateDTO) {

        templateDTO.setDoctorId(UserContextHolder.getUserDetails().getUserId());
        PrescriptionTemplateDTO template = templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(template));
    }

    @PutMapping("/{templateId}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> updateTemplate(
            @PathVariable String templateId,
            @Valid @RequestBody PrescriptionTemplateDTO templateDTO) {

        templateDTO.setDoctorId(UserContextHolder.getUserDetails().getUserId());
        PrescriptionTemplateDTO template = templateService.updateTemplate(templateId, templateDTO);
        return ResponseEntity.ok(ApiResponse.success(template));
    }

    @GetMapping("/{templateId}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> getTemplate(
            @PathVariable String templateId) {

        PrescriptionTemplateDTO template = templateService.getTemplateById(templateId);
        return ResponseEntity.ok(ApiResponse.success(template));
    }

    @GetMapping("/doctors/{doctorId}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templatePageFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<PrescriptionTemplateDTO>>> getDoctorTemplates(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "usageCount") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PrescriptionTemplateDTO> templates = templateService.getDoctorTemplates(doctorId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @GetMapping("/doctors/{doctorId}/category/{category}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateListFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionTemplateDTO>>> getTemplatesByCategory(
            @PathVariable String doctorId,
            @PathVariable String category) {

        List<PrescriptionTemplateDTO> templates = templateService.getTemplatesByCategory(doctorId, category);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @GetMapping("/doctors/{doctorId}/condition/{condition}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateListFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionTemplateDTO>>> getTemplatesByCondition(
            @PathVariable String doctorId,
            @PathVariable String condition) {

        List<PrescriptionTemplateDTO> templates = templateService.getTemplatesByCondition(doctorId, condition);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @GetMapping("/public")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templatePageFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<PrescriptionTemplateDTO>>> getPublicTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("usageCount").descending());
        Page<PrescriptionTemplateDTO> templates = templateService.getPublicTemplates(pageRequest);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @DeleteMapping("/{templateId}")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> deleteTemplate(
            @PathVariable String templateId) {

        templateService.deleteTemplate(templateId, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success("Template deleted successfully"));
    }

    @GetMapping("/search")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateListFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionTemplateDTO>>> searchTemplates(
            @RequestParam String query) {

        List<PrescriptionTemplateDTO> templates = templateService.searchTemplates(query, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PostMapping("/{templateId}/duplicate")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> duplicateTemplate(
            @PathVariable String templateId,
            @RequestParam String newName) {

        PrescriptionTemplateDTO template = templateService.duplicateTemplate(templateId, newName, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(template));
    }

    @PostMapping("/{templateId}/use")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> incrementUsageCount(
            @PathVariable String templateId) {

        templateService.incrementUsageCount(templateId);
        return ResponseEntity.ok(ApiResponse.success("Usage count incremented"));
    }

    @GetMapping("/doctors/{doctorId}/popular")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateListFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<PrescriptionTemplateDTO>>> getPopularTemplates(
            @PathVariable String doctorId) {

        List<PrescriptionTemplateDTO> templates = templateService.getPopularTemplates(doctorId);
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    @PostMapping("/{templateId}/approve")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "templateFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<PrescriptionTemplateDTO>> approveTemplate(
            @PathVariable String templateId) {

        PrescriptionTemplateDTO template = templateService.approveTemplate(templateId, UserContextHolder.getUserDetails().getUserId());
        return ResponseEntity.ok(ApiResponse.success(template));
    }

    @PostMapping("/{templateId}/share")
    @CircuitBreaker(name = TEMPLATE_SERVICE, fallbackMethod = "operationSuccessFallback")
    @RateLimiter(name = TEMPLATE_SERVICE, fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> shareTemplate(
            @PathVariable String templateId,
            @RequestParam boolean isPublic) {

        templateService.shareTemplate(templateId, isPublic);
        return ResponseEntity.ok(ApiResponse.success("Template sharing status updated"));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(String serviceName, Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to " + serviceName + ". Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }
}
