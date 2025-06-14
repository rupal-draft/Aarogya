package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.dto.PrescriptionAnalyticsDTO;
import com.aarogya.prescription_service.service.PrescriptionAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescription-analytics")
@RequiredArgsConstructor
public class PrescriptionAnalyticsController {

    private final PrescriptionAnalyticsService analyticsService;

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<PrescriptionAnalyticsDTO> getDoctorAnalytics(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getDoctorPrescriptionAnalytics(doctorId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/patients/{patientId}")
    public ResponseEntity<PrescriptionAnalyticsDTO> getPatientAnalytics(
            @PathVariable String patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        PrescriptionAnalyticsDTO analytics = analyticsService.getPatientPrescriptionAnalytics(patientId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/doctors/{doctorId}/top-medicines")
    public ResponseEntity<Map<String, Integer>> getTopPrescribedMedicines(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topMedicines = analyticsService.getTopPrescribedMedicines(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(topMedicines);
    }

    @GetMapping("/doctors/{doctorId}/top-diagnoses")
    public ResponseEntity<Map<String, Integer>> getTopDiagnoses(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "10") int limit) {

        Map<String, Integer> topDiagnoses = analyticsService.getTopDiagnoses(doctorId, startDate, endDate, limit);
        return ResponseEntity.ok(topDiagnoses);
    }

    @GetMapping("/doctors/{doctorId}/trends")
    public ResponseEntity<Map<String, Double>> getPrescriptionTrends(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Double> trends = analyticsService.getPrescriptionTrends(doctorId, startDate, endDate);
        return ResponseEntity.ok(trends);
    }

    @GetMapping("/doctors/{doctorId}/interaction-alerts")
    public ResponseEntity<List<String>> getDrugInteractionAlerts(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<String> alerts = analyticsService.getDrugInteractionAlerts(doctorId, startDate, endDate);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/doctors/{doctorId}/status-distribution")
    public ResponseEntity<Map<String, Integer>> getPrescriptionsByStatus(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Integer> statusDistribution = analyticsService.getPrescriptionsByStatus(doctorId, startDate, endDate);
        return ResponseEntity.ok(statusDistribution);
    }

    @GetMapping("/doctors/{doctorId}/average-value")
    public ResponseEntity<Double> getAveragePrescriptionValue(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Double averageValue = analyticsService.getAveragePrescriptionValue(doctorId, startDate, endDate);
        return ResponseEntity.ok(averageValue);
    }

    @GetMapping("/doctors/{doctorId}/refill-analytics")
    public ResponseEntity<Map<String, Integer>> getRefillAnalytics(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        Map<String, Integer> refillAnalytics = analyticsService.getRefillAnalytics(doctorId, startDate, endDate);
        return ResponseEntity.ok(refillAnalytics);
    }

    @PostMapping("/doctors/{doctorId}/generate-report")
    public ResponseEntity<Void> generatePrescriptionReport(
            @PathVariable String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        analyticsService.generatePrescriptionReport(doctorId, startDate, endDate);
        return ResponseEntity.ok().build();
    }
}
