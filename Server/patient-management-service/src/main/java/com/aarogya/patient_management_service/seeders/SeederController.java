package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.advices.ApiResponse;
import com.aarogya.patient_management_service.auth.UserContextHolder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/seed")
@RequiredArgsConstructor
@Slf4j
public class SeederController {

    private final List<SeederService> seederServices;

    @PostMapping
    public ResponseEntity<ApiResponse<String>> seedPatientManagementData() {
        String patientId = UserContextHolder.getUserDetails().getUserId();

        log.info("Seeding data for patient {}", patientId);
        seederServices.forEach(service -> service.seed(patientId));

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Completed seeding all entities for patient id: " + patientId));
    }
}
