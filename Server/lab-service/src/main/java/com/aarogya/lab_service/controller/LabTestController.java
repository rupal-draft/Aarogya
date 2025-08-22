package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiError;
import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.dto.request.CreateLabTestRequest;
import com.aarogya.lab_service.dto.request.UpdateLabTestRequest;
import com.aarogya.lab_service.dto.response.LabTestResponse;
import com.aarogya.lab_service.service.LabTestService;
import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tests")
@Slf4j
public class LabTestController {

    private final LabTestService labTestService;

    public LabTestController(LabTestService labTestService, RateLimiterRegistry rateLimiterRegistry) {
        this.labTestService = labTestService;
    }

    @GetMapping
    @RateLimiter(name = "highRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<LabTestResponse>>> getAllTests(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("GET /api/v1/lab/tests - page: {}, size: {}", page, size);

        Page<LabTestResponse> tests = labTestService.getAllActiveTests(page, size);
        return ResponseEntity.ok(ApiResponse.success("Lab tests retrieved successfully", tests));
    }

    @GetMapping("/all")
    @RateLimiter(name = "highRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getAllTestsList() {
        log.info("GET /api/v1/lab/tests/all");

        List<LabTestResponse> tests = labTestService.getAllActiveTests();
        return ResponseEntity.ok(ApiResponse.success("All lab tests retrieved successfully", tests));
    }

    @GetMapping("/search")
    @RateLimiter(name = "highRateEndpoints", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<Page<LabTestResponse>>> searchTests(
            @RequestParam @NotBlank String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("GET /api/v1/lab/tests/search - query: {}, page: {}, size: {}", query, page, size);

        Page<LabTestResponse> tests = labTestService.searchTests(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", tests));
    }

    @GetMapping("/categories")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        log.info("GET /api/v1/lab/tests/categories");

        List<String> categories = labTestService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/category/{category}")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getTestsByCategory(
            @PathVariable @NotBlank String category) {

        log.info("GET /api/v1/lab/tests/category/{}", category);

        List<LabTestResponse> tests = labTestService.getTestsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Tests by category retrieved successfully", tests));
    }

    @GetMapping("/{testId}")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabTestResponse>> getTestById(
            @PathVariable @NotBlank String testId) {

        log.info("GET /api/v1/lab/tests/{}", testId);

        LabTestResponse test = labTestService.getTestById(testId);
        return ResponseEntity.ok(ApiResponse.success("Lab test retrieved successfully", test));
    }

    @GetMapping("/code/{testCode}")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabTestResponse>> getTestByCode(
            @PathVariable @NotBlank String testCode) {

        log.info("GET /api/v1/lab/tests/code/{}", testCode);

        LabTestResponse test = labTestService.getTestByCode(testCode);
        return ResponseEntity.ok(ApiResponse.success("Lab test retrieved successfully", test));
    }

    @PostMapping
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabTestResponse>> createTest(
            @Valid @RequestBody CreateLabTestRequest request) {

        log.info("POST /api/v1/lab/tests - Creating lab test: {}", request.getTestCode());

        LabTestResponse test = labTestService.createTest(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab test created successfully", test));
    }

    @PostMapping("/bulk")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> createTestsBulk(
            @Valid @RequestBody List<CreateLabTestRequest> requests) {

        log.info("POST /api/v1/lab/tests/bulk - Creating {} lab tests", requests.size());

        List<LabTestResponse> tests = labTestService.createTestsBulk(requests);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Lab tests created successfully", tests));
    }

    @PutMapping("/{testId}")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<LabTestResponse>> updateTest(
            @PathVariable @NotBlank String testId,
            @Valid @RequestBody UpdateLabTestRequest request) {

        log.info("PUT /api/v1/lab/tests/{}", testId);

        LabTestResponse test = labTestService.updateTest(testId, request);
        return ResponseEntity.ok(ApiResponse.success("Lab test updated successfully", test));
    }

    @DeleteMapping("/{testId}")
    @RateLimiter(name = "labTestController", fallbackMethod = "rateLimitFallback")
    public ResponseEntity<ApiResponse<String>> deactivateTest(@PathVariable @NotBlank String testId) {
        log.info("DELETE /api/v1/lab/tests/{}", testId);

        labTestService.deactivateTest(testId);
        return ResponseEntity.ok(ApiResponse.success("Lab test deactivated successfully", "Test deactivated"));
    }

    public ResponseEntity<ApiResponse<?>> rateLimitFallback(Exception ex) {
        log.warn("Rate limit exceeded for LabTestController: {}", ex.getMessage());

        ApiError error = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests. Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .setSubErrors(List.of("Rate limit exceeded", "Please wait before making another request"))
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(error));
    }
}
