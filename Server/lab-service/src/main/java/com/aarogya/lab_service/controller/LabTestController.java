package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.dto.response.LabTestResponse;
import com.aarogya.lab_service.service.LabTestService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/lab/tests")
@Slf4j
public class LabTestController {
    
    private final LabTestService labTestService;
    public LabTestController(LabTestService labTestService) {
        this.labTestService = labTestService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<LabTestResponse>>> getAllTests(
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("GET /api/v1/lab/tests - page: {}, size: {}", page, size);

        Page<LabTestResponse> tests = labTestService.getAllActiveTests(page, size);
        return ResponseEntity.ok(ApiResponse.success("Lab tests retrieved successfully", tests));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getAllTestsList() {
        log.info("GET /api/v1/lab/tests/all");

        List<LabTestResponse> tests = labTestService.getAllActiveTests();
        return ResponseEntity.ok(ApiResponse.success("All lab tests retrieved successfully", tests));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<LabTestResponse>>> searchTests(
            @RequestParam @NotBlank String query,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) int size) {

        log.info("GET /api/v1/lab/tests/search - query: {}, page: {}, size: {}", query, page, size);

        Page<LabTestResponse> tests = labTestService.searchTests(query, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", tests));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        log.info("GET /api/v1/lab/tests/categories");

        List<String> categories = labTestService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<ApiResponse<List<LabTestResponse>>> getTestsByCategory(
            @PathVariable @NotBlank String category) {

        log.info("GET /api/v1/lab/tests/category/{}", category);

        List<LabTestResponse> tests = labTestService.getTestsByCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Tests by category retrieved successfully", tests));
    }

    @GetMapping("/{testId}")
    public ResponseEntity<ApiResponse<LabTestResponse>> getTestById(
            @PathVariable @NotBlank String testId) {

        log.info("GET /api/v1/lab/tests/{}", testId);

        LabTestResponse test = labTestService.getTestById(testId);
        return ResponseEntity.ok(ApiResponse.success("Lab test retrieved successfully", test));
    }

    @GetMapping("/code/{testCode}")
    public ResponseEntity<ApiResponse<LabTestResponse>> getTestByCode(
            @PathVariable @NotBlank String testCode) {

        log.info("GET /api/v1/lab/tests/code/{}", testCode);

        LabTestResponse test = labTestService.getTestByCode(testCode);
        return ResponseEntity.ok(ApiResponse.success("Lab test retrieved successfully", test));
    }
}
