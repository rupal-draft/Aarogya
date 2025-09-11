package com.aarogya.patient_management_service.controller;


import com.aarogya.patient_management_service.dto.response.PatientDashboardResponseDTO;
import com.aarogya.patient_management_service.service.PatientManagementDashboardService;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/management")
@RequiredArgsConstructor
@Slf4j
@Validated
public class PatientManagementDashboardController {

    private final PatientManagementDashboardService patientDashboardService;

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientDashboardResponseDTO> getPatientDashboard(
            @PathVariable @NotBlank(message = "patientId is required") String patientId) {
        log.info("Fetching dashboard for patient {}", patientId);
        PatientDashboardResponseDTO dto = patientDashboardService.getPatientDashboard(patientId);
        return ResponseEntity.ok(dto);
    }
}
