package com.aarogya.email_service.controller;

import com.aarogya.email_service.auth.UserContextHolder;
import com.aarogya.email_service.dto.EmailRequestDTO;
import com.aarogya.email_service.dto.EmailResponseDTO;
import com.aarogya.email_service.dto.EmailStatsDTO;
import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import com.aarogya.email_service.service.EmailService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/core")
@RequiredArgsConstructor
@Slf4j
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<EmailResponseDTO> sendEmail(@RequestBody @Valid EmailRequestDTO emailRequest) {
        log.info("Received email send request for: {}", emailRequest.getRecipientEmail());

        EmailResponseDTO response = emailService.sendEmail(emailRequest);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{emailId}")
    public ResponseEntity<EmailResponseDTO> getEmailById(@PathVariable @NotBlank String emailId) {
        log.debug("Fetching email by ID: {}", emailId);

        EmailResponseDTO email = emailService.getEmailById(emailId);
        return ResponseEntity.ok(email);
    }

    @GetMapping("/recipient/{recipientEmail}")
    public ResponseEntity<Page<EmailResponseDTO>> getEmailsByRecipient(
            @PathVariable @Email String recipientEmail,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching emails for recipient: {}", recipientEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByRecipient(recipientEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<Page<EmailResponseDTO>> getEmailsByStatus(
            @PathVariable EmailStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching emails with status: {}", status);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByStatus(status, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/type/{emailType}")
    public ResponseEntity<Page<EmailResponseDTO>> getEmailsByType(
            @PathVariable EmailType emailType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching emails with type: {}", emailType);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByType(emailType, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/history")
    public ResponseEntity<Page<EmailResponseDTO>> getUserEmailHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String userEmail = UserContextHolder.getUserDetails().getEmail();
        log.debug("Fetching email history for user: {}", userEmail);

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<EmailResponseDTO> emails = emailService.getEmailsByRecipient(userEmail, pageable);
        return ResponseEntity.ok(emails);
    }

    @GetMapping("/stats")
    public ResponseEntity<EmailStatsDTO> getUserEmailStats(@RequestParam(defaultValue = "0") int days) {
        String userEmail = UserContextHolder.getUserDetails().getEmail();
        log.debug("Fetching email stats for user: {}", userEmail);
        EmailStatsDTO stats = emailService.getEmailStats(userEmail, days);
        return ResponseEntity.ok(stats);
    }


    @PostMapping("/retry-failed")
    public ResponseEntity<Void> retryFailedEmails() {
        log.info("Triggering retry for failed emails");

        emailService.retryFailedEmails();
        return ResponseEntity.ok().build();
    }
}
