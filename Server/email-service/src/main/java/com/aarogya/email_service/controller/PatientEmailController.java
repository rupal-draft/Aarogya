package com.aarogya.email_service.controller;

import com.aarogya.email_service.auth.UserContextHolder;
import com.aarogya.email_service.dto.EmailResponseDTO;
import com.aarogya.email_service.dto.EmailStatsDTO;
import com.aarogya.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
@Slf4j
public class PatientEmailController {

    private final EmailService emailService;

    @GetMapping("/notifications")
    public ResponseEntity<Page<EmailResponseDTO>> getPatientNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String patientEmail = UserContextHolder.getUserDetails().getEmail();
        log.info("Fetching email notifications for patient: {}", patientEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByRecipient(patientEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/appointment-confirmations")
    public ResponseEntity<Page<EmailResponseDTO>> getAppointmentConfirmationEmails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String patientEmail = UserContextHolder.getUserDetails().getEmail();

        log.info("Fetching appointment confirmation emails for patient: {}", patientEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getAppointmentConfirmationEmails(patientEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/stats")
    public ResponseEntity<EmailStatsDTO> getPatientEmailStats(@RequestParam(defaultValue = "0") int days) {

        String patientEmail = UserContextHolder.getUserDetails().getEmail();
        log.info("Fetching email stats for patient: {}", patientEmail);

        EmailStatsDTO stats = emailService.getEmailStats(patientEmail, days);
        return ResponseEntity.ok(stats);
    }
}
