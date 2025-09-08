package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.dto.dashboard.DoctorDashboard;
import com.aarogya.doctor_service.services.dashboard.DoctorDashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Slf4j
public class DashboardController {

    private final DoctorDashboardService doctorDashboardService;

    public DashboardController(DoctorDashboardService doctorDashboardService) {
        this.doctorDashboardService = doctorDashboardService;
    }

    @GetMapping
    public ResponseEntity<DoctorDashboard> getDoctorDashboard() {
        log.info("Received request for doctor dashboard");

        DoctorDashboard dashboard = doctorDashboardService.getDoctorDashboardStats();

        return ResponseEntity.ok(dashboard);
    }
}
