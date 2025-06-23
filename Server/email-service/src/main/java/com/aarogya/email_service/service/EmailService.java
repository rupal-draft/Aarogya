package com.aarogya.email_service.service;

import com.aarogya.email_service.dto.EmailRequestDTO;
import com.aarogya.email_service.dto.EmailResponseDTO;
import com.aarogya.email_service.dto.EmailStatsDTO;
import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface EmailService {

    EmailResponseDTO sendEmail(EmailRequestDTO emailRequest);

    void sendOtpEmail(String recipientEmail, String recipientName, String otp, String purpose, String role);

    void sendAppointmentEmail(String recipientEmail, String recipientName, String subject,
                              EmailType emailType, Map<String, Object> appointmentData);

    EmailResponseDTO getEmailById(String emailId);

    Page<EmailResponseDTO> getEmailsByRecipient(String recipientEmail, Pageable pageable);

    Page<EmailResponseDTO> getEmailsByStatus(EmailStatus status, Pageable pageable);

    Page<EmailResponseDTO> getEmailsByType(EmailType emailType, Pageable pageable);

    EmailStatsDTO getEmailStats();

    void retryFailedEmails();

    boolean isRateLimited(String recipientEmail, EmailType emailType);
}
