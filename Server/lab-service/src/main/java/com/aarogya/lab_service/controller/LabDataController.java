package com.aarogya.lab_service.controller;

import com.aarogya.lab_service.advices.ApiResponse;
import com.aarogya.lab_service.utils.LabTestDataSeedingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seed")
public class LabDataController {

    private static final Logger logger = LoggerFactory.getLogger(LabDataController.class);

    private final LabTestDataSeedingService dataSeedingService;
    public LabDataController(LabTestDataSeedingService dataSeedingService) {
        this.dataSeedingService = dataSeedingService;
    }

    @PostMapping("/seed-lab-tests")
    public ResponseEntity<ApiResponse<String>> seedLabTests() {
        logger.info("POST /api/v1/lab/admin/seed-lab-tests - Seeding initial lab tests");

        int count = dataSeedingService.seedLabTests();
        return ResponseEntity.ok(ApiResponse.success("Lab tests seeded successfully",
                count + " tests created"));
    }

    @DeleteMapping("/clear-all-data")
    public ResponseEntity<ApiResponse<String>> clearAllData() {
        logger.info("DELETE /api/v1/lab/admin/clear-all-data - Clearing all lab data");

        dataSeedingService.clearAllData();
        return ResponseEntity.ok(ApiResponse.success("All lab data cleared successfully", "Data cleared"));
    }
}
