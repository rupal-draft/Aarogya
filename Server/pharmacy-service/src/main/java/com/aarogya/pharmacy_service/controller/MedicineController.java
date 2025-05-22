package com.aarogya.pharmacy_service.controller;

import com.aarogya.pharmacy_service.advices.ApiResponse;
import com.aarogya.pharmacy_service.advices.ErrorResponse;
import com.aarogya.pharmacy_service.dto.medicine.MedicineCreationDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineResponseDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineStockUpdateDTO;
import com.aarogya.pharmacy_service.service.MedicineService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/medicine")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @GetMapping
    @RateLimiter(name = "medicine", fallbackMethod = "getAllMedicines")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> getAllMedicines() {
        return ResponseEntity.ok(ApiResponse.success(medicineService.getAllMedicines()));
    }

    @GetMapping("/{id}")
    @RateLimiter(name = "medicine", fallbackMethod = "getMedicineById")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> getMedicineById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.getMedicineById(id)));
    }

    @PostMapping
    @RateLimiter(name = "medicine", fallbackMethod = "createMedicine")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> createMedicine(@Valid @RequestBody MedicineCreationDTO medicineCreationDTO) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(medicineService.createMedicine(medicineCreationDTO)));
    }

    @PutMapping("/{id}")
    @RateLimiter(name = "medicine", fallbackMethod = "updateMedicine")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> updateMedicine(
            @PathVariable String id,
            @Valid @RequestBody MedicineDTO medicineDTO) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.updateMedicine(id, medicineDTO)));
    }

    @DeleteMapping("/{id}")
    @RateLimiter(name = "medicine", fallbackMethod = "deleteMedicine")
    public ResponseEntity<ApiResponse<String>> deleteMedicine(@PathVariable String id) {
        medicineService.deleteMedicine(id);
        return ResponseEntity.ok(ApiResponse.success("Medicine deleted successfully!!👍👍"));
    }

    @PostMapping("/upload-prescription")
    @RateLimiter(name = "medicine", fallbackMethod = "searchMedicinesFromPrescription")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> searchMedicinesFromPrescription(
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.searchMedicinesFromPrescription(file)));
    }

    @GetMapping("/search")
    @RateLimiter(name = "medicine", fallbackMethod = "searchMedicines")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> searchMedicines(@RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.searchMedicines(query)));
    }

    @GetMapping("/filter")
    @RateLimiter(name = "medicine", fallbackMethod = "getMedicinesByCategoryAndPrescription")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> getMedicinesByCategory(
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.getMedicinesByCategory(category)));
    }

    @PatchMapping("/{id}/stock")
    @RateLimiter(name = "medicine", fallbackMethod = "updateStock")
    public ResponseEntity<ApiResponse<MedicineResponseDTO>> updateStock(
            @PathVariable String id,
            @Valid @RequestBody MedicineStockUpdateDTO stockUpdateDTO) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.updateStock(id, stockUpdateDTO)));
    }

    @GetMapping("/low-stock")
    @RateLimiter(name = "medicine", fallbackMethod = "getLowStockMedicines")
    public ResponseEntity<ApiResponse<List<MedicineResponseDTO>>> getLowStockMedicines(
            @RequestParam(defaultValue = "10") int threshold) {
        return ResponseEntity.ok(ApiResponse.success(medicineService.getLowStockMedicines(threshold)));
    }

    public ResponseEntity<ErrorResponse> medicineRateLimitFallback(Throwable throwable, HttpServletRequest request) {
        ErrorResponse errorResponse = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.TOO_MANY_REQUESTS.value())
                .error("Too Many Requests")
                .message("You are sending too many requests. Please try again later.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(errorResponse);
    }

    public ResponseEntity<ErrorResponse> getAllMedicines(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getMedicineById(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> createMedicine(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> updateMedicine(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> deleteMedicine(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> searchMedicinesFromPrescription(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> searchMedicines(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getMedicinesByCategoryAndPrescription(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> updateStock(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }

    public ResponseEntity<ErrorResponse> getLowStockMedicines(Throwable t, HttpServletRequest request) {
        return medicineRateLimitFallback(t, request);
    }
}
