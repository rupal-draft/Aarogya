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
@RequestMapping("/doctor")
@RequiredArgsConstructor
@Slf4j
public class DoctorEmailController {

    private final EmailService emailService;

    @GetMapping("/notifications")
    public ResponseEntity<Page<EmailResponseDTO>> getDoctorNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String doctorEmail = UserContextHolder.getUserDetails().getEmail();
        log.info("Fetching email notifications for doctor: {}", doctorEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByRecipient(doctorEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/appointment-requests")
    public ResponseEntity<Page<EmailResponseDTO>> getAppointmentRequestEmails(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String doctorEmail = UserContextHolder.getUserDetails().getEmail();

        log.info("Fetching appointment request emails for doctor: {}", doctorEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getAppointmentRequestEmails(doctorEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/stats")
    public ResponseEntity<EmailStatsDTO> getDoctorEmailStats(@RequestParam(defaultValue = "0") int days) {

        String doctorEmail = UserContextHolder.getUserDetails().getEmail();

        log.info("Fetching email stats for doctor: {}", doctorEmail);

        EmailStatsDTO stats = emailService.getEmailStats(doctorEmail, days);
        return ResponseEntity.ok(stats);
    }
}
