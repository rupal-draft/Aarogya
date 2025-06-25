package com.aarogya.email_service.service.implementations;

import com.aarogya.email_service.dto.EmailRequestDTO;
import com.aarogya.email_service.dto.EmailResponseDTO;
import com.aarogya.email_service.dto.EmailStatsDTO;
import com.aarogya.email_service.enums.EmailStatus;
import com.aarogya.email_service.enums.EmailType;
import com.aarogya.email_service.exceptions.EmailNotFoundException;
import com.aarogya.email_service.exceptions.RateLimitExceededException;
import com.aarogya.email_service.model.EmailLog;
import com.aarogya.email_service.repository.EmailLogRepository;
import com.aarogya.email_service.service.EmailService;
import com.aarogya.email_service.service.TemplateService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final EmailLogRepository emailLogRepository;
    private final TemplateService templateService;
    private final ModelMapper modelMapper;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.email.rate-limit.otp:5}")
    private int otpRateLimit;

    @Value("${app.email.rate-limit.window-minutes:60}")
    private int rateLimitWindowMinutes;

    @Override
    @Async
    @Transactional
    public EmailResponseDTO sendEmail(EmailRequestDTO emailRequest) {
        log.info("Processing email request for: {}", emailRequest.getRecipientEmail());

        if (isRateLimited(emailRequest.getRecipientEmail(), emailRequest.getEmailType())) {
            throw new RateLimitExceededException("Rate limit exceeded for email type: " + emailRequest.getEmailType());
        }

        EmailLog emailLog = EmailLog.builder()
                .recipientEmail(emailRequest.getRecipientEmail())
                .recipientName(emailRequest.getRecipientName())
                .subject(emailRequest.getSubject())
                .emailType(emailRequest.getEmailType())
                .status(EmailStatus.PENDING)
                .templateName(emailRequest.getTemplateName())
                .templateData(emailRequest.getTemplateData())
                .correlationId(emailRequest.getCorrelationId())
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusDays(90))
                .build();

        emailLog = emailLogRepository.save(emailLog);

        try {
            sendEmailInternal(emailLog);

            emailLog.setStatus(EmailStatus.SENT);
            emailLog.setSentAt(LocalDateTime.now());
            emailLog.setUpdatedAt(LocalDateTime.now());

        } catch (Exception e) {
            log.error("Failed to send email to: {}", emailRequest.getRecipientEmail(), e);

            emailLog.setStatus(EmailStatus.FAILED);
            emailLog.setErrorMessage(e.getMessage());
            emailLog.setUpdatedAt(LocalDateTime.now());
        }

        emailLog = emailLogRepository.save(emailLog);
        return modelMapper.map(emailLog, EmailResponseDTO.class);
    }

    @Override
    public void sendOtpEmail(String recipientEmail, String recipientName, String otp, String purpose, String role) {
        log.info("Sending OTP email to: {} for purpose: {}", recipientEmail, purpose);

        Map<String, Object> templateData = new HashMap<>();
        templateData.put("recipientName", recipientName);
        templateData.put("otp", otp);
        templateData.put("purpose", purpose);
        templateData.put("role", role);
        templateData.put("expiryMinutes", 10);

        EmailRequestDTO emailRequest = EmailRequestDTO.builder()
                .recipientEmail(recipientEmail)
                .recipientName(recipientName)
                .subject("Your OTP for " + purpose)
                .emailType(EmailType.OTP_VERIFICATION)
                .templateName("otp-verification")
                .templateData(templateData)
                .correlationId(UUID.randomUUID().toString())
                .build();

        sendEmail(emailRequest);
    }

    @Override
    public void sendAppointmentEmail(String recipientEmail, String recipientName, String subject,
                                     EmailType emailType, Map<String, Object> appointmentData) {
        log.info("Sending appointment email to: {} with type: {}", recipientEmail, emailType);

        String templateName = getTemplateNameForEmailType(emailType);

        EmailRequestDTO emailRequest = EmailRequestDTO.builder()
                .recipientEmail(recipientEmail)
                .recipientName(recipientName)
                .subject(subject)
                .emailType(emailType)
                .templateName(templateName)
                .templateData(appointmentData)
                .correlationId(UUID.randomUUID().toString())
                .build();

        sendEmail(emailRequest);
    }

    @Override
    public EmailResponseDTO getEmailById(String emailId) {
        log.debug("Fetching email by ID: {}", emailId);

        EmailLog emailLog = emailLogRepository.findById(emailId)
                .orElseThrow(() -> new EmailNotFoundException("Email not found with ID: " + emailId));

        return modelMapper.map(emailLog, EmailResponseDTO.class);
    }

    @Override
    @Cacheable(value = "emailsByRecipient", key = "#recipientEmail + '_' + #pageable.pageNumber")
    public Page<EmailResponseDTO> getEmailsByRecipient(String recipientEmail, Pageable pageable) {
        log.debug("Fetching emails for recipient: {}", recipientEmail);

        Page<EmailLog> emailLogs = emailLogRepository.findByRecipientEmailOrderByCreatedAtDesc(recipientEmail, pageable);
        return emailLogs.map(emailLog -> modelMapper.map(emailLog, EmailResponseDTO.class));
    }

    @Override
    @Cacheable(value = "emailsByStatus", key = "#status + '_' + #pageable.pageNumber")
    public Page<EmailResponseDTO> getEmailsByStatus(EmailStatus status, Pageable pageable) {
        log.debug("Fetching emails with status: {}", status);

        Page<EmailLog> emailLogs = emailLogRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        return emailLogs.map(emailLog -> modelMapper.map(emailLog, EmailResponseDTO.class));
    }

    @Override
    @Cacheable(value = "emailsByType", key = "#emailType + '_' + #pageable.pageNumber")
    public Page<EmailResponseDTO> getEmailsByType(EmailType emailType, Pageable pageable) {
        log.debug("Fetching emails with type: {}", emailType);

        Page<EmailLog> emailLogs = emailLogRepository.findByEmailTypeOrderByCreatedAtDesc(emailType, pageable);
        return emailLogs.map(emailLog -> modelMapper.map(emailLog, EmailResponseDTO.class));
    }

    @Override
    @Cacheable(value = "emailStats", key = "#userEmail + '_' + #days")
    public EmailStatsDTO getEmailStats(String userEmail, int days) {
        log.debug("Generating email statistics for user: {} for last {} days", userEmail, days);

        LocalDateTime fromDate = days > 0
                ? LocalDateTime.now().minusDays(days)
                : null;

        long totalEmails = fromDate != null
                ? emailLogRepository.countByRecipientEmailAndCreatedAtAfter(userEmail, fromDate)
                : emailLogRepository.countByRecipientEmail(userEmail);

        long sentEmails = fromDate != null
                ? emailLogRepository.countByRecipientEmailAndStatusAndCreatedAtAfter(userEmail, EmailStatus.SENT, fromDate)
                : emailLogRepository.countByRecipientEmailAndStatus(userEmail, EmailStatus.SENT);

        long failedEmails = fromDate != null
                ? emailLogRepository.countByRecipientEmailAndStatusAndCreatedAtAfter(userEmail, EmailStatus.FAILED, fromDate)
                : emailLogRepository.countByRecipientEmailAndStatus(userEmail, EmailStatus.FAILED);

        long pendingEmails = fromDate != null
                ? emailLogRepository.countByRecipientEmailAndStatusAndCreatedAtAfter(userEmail, EmailStatus.PENDING, fromDate)
                : emailLogRepository.countByRecipientEmailAndStatus(userEmail, EmailStatus.PENDING);

        double successRate = totalEmails > 0 ? (double) sentEmails / totalEmails * 100 : 0;

        List<EmailType> appointmentTypes = List.of(
                EmailType.APPOINTMENT_REQUEST,
                EmailType.APPOINTMENT_CONFIRMATION,
                EmailType.APPOINTMENT_CANCELLATION
        );

        long appointmentEmails = fromDate != null
                ? emailLogRepository.countAppointmentEmailsByUserAndDate(userEmail, appointmentTypes, fromDate)
                : appointmentTypes.stream()
                .mapToLong(type -> emailLogRepository.countByRecipientEmailAndEmailType(userEmail, type))
                .sum();

        long otpEmails = fromDate != null
                ? emailLogRepository.countByRecipientEmailAndEmailTypeAndCreatedAtAfter(userEmail, EmailType.OTP_VERIFICATION, fromDate)
                : emailLogRepository.countByRecipientEmailAndEmailType(userEmail, EmailType.OTP_VERIFICATION);

        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime todayEnd = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        long todayEmails = emailLogRepository.countByRecipientEmailAndCreatedAtBetween(userEmail, todayStart, todayEnd);

        return EmailStatsDTO.builder()
                .totalEmails(totalEmails)
                .sentEmails(sentEmails)
                .failedEmails(failedEmails)
                .pendingEmails(pendingEmails)
                .successRate(Math.round(successRate * 100.0) / 100.0)
                .appointmentEmails(appointmentEmails)
                .otpEmails(otpEmails)
                .todayEmails(todayEmails)
                .build();
    }

    @Override
    @Cacheable(value = "appointmentConfirmationEmails", key = "#patientEmail + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<EmailResponseDTO> getAppointmentConfirmationEmails(String patientEmail, Pageable pageable) {
        log.debug("Fetching appointment confirmation emails for patient: {}", patientEmail);
        Page<EmailLog> emailLogs = emailLogRepository
                .findByRecipientEmailAndEmailTypeOrderByCreatedAtDesc(patientEmail, EmailType.APPOINTMENT_CONFIRMATION, pageable);

        return emailLogs.map(emailLog -> modelMapper.map(emailLog, EmailResponseDTO.class));
    }

    @Override
    @Cacheable(value = "appointmentRequestEmails", key = "#doctorEmail + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<EmailResponseDTO> getAppointmentRequestEmails(String doctorEmail, Pageable pageable) {
        log.debug("Fetching appointment request emails for doctor: {}", doctorEmail);
        Page<EmailLog> emailLogs = emailLogRepository
                .findByRecipientEmailAndEmailTypeOrderByCreatedAtDesc(doctorEmail, EmailType.APPOINTMENT_REQUEST, pageable);

        return emailLogs.map(emailLog -> modelMapper.map(emailLog, EmailResponseDTO.class));
    }

    @Override
    @Async
    @Transactional
    public void retryFailedEmails() {
        log.info("Starting retry process for failed emails");

        List<EmailLog> failedEmails = emailLogRepository.findByStatusAndRetryCountLessThanMaxRetries(
                EmailStatus.FAILED, 3);

        for (EmailLog emailLog : failedEmails) {
            try {
                log.info("Retrying email: {} (attempt {})", emailLog.getId(), emailLog.getRetryCount() + 1);

                sendEmailInternal(emailLog);

                emailLog.setStatus(EmailStatus.SENT);
                emailLog.setSentAt(LocalDateTime.now());
                emailLog.setErrorMessage(null);

            } catch (Exception e) {
                log.error("Retry failed for email: {}", emailLog.getId(), e);

                emailLog.setRetryCount(emailLog.getRetryCount() + 1);
                emailLog.setErrorMessage(e.getMessage());

                if (emailLog.getRetryCount() >= emailLog.getMaxRetries()) {
                    emailLog.setStatus(EmailStatus.FAILED);
                } else {
                    emailLog.setStatus(EmailStatus.RETRY);
                }
            }

            emailLog.setUpdatedAt(LocalDateTime.now());
            emailLogRepository.save(emailLog);
        }

        log.info("Completed retry process for {} failed emails", failedEmails.size());
    }

    private boolean isRateLimited(String recipientEmail, EmailType emailType) {
        if (emailType != EmailType.OTP_VERIFICATION) {
            return false;
        }

        LocalDateTime windowStart = LocalDateTime.now().minusMinutes(rateLimitWindowMinutes);
        List<EmailLog> recentEmails = emailLogRepository.findRecentEmailsByRecipientAndType(
                recipientEmail, emailType, windowStart);

        return recentEmails.size() >= otpRateLimit;
    }



    @Retryable(value = {MessagingException.class}, maxAttempts = 3, backoff = @Backoff(delay = 1000))
    private void sendEmailInternal(EmailLog emailLog) throws MessagingException {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Aarogya Healthcare");
            helper.setTo(emailLog.getRecipientEmail());
            helper.setSubject(emailLog.getSubject());

            String htmlContent = templateService.processTemplate(
                    emailLog.getTemplateName(),
                    emailLog.getTemplateData()
            );

            helper.setText(htmlContent, true);
            mailSender.send(message);

            emailLog.setMessageId(UUID.randomUUID().toString());

            log.info("Email sent successfully to: {}", emailLog.getRecipientEmail());
        } catch (UnsupportedEncodingException e) {
            throw new MessagingException("Encoding error while sending email", e);
        }
    }

    private String getTemplateNameForEmailType(EmailType emailType) {
        return switch (emailType) {
            case APPOINTMENT_REQUEST -> "appointment-request";
            case APPOINTMENT_CONFIRMATION -> "appointment-confirmation";
            case APPOINTMENT_CANCELLATION -> "appointment-cancellation";
            case APPOINTMENT_REMINDER -> "appointment-reminder";
            case EMERGENCY_APPOINTMENT -> "emergency-appointment";
            case FOLLOW_UP_SCHEDULED -> "follow-up-scheduled";
            case FOLLOW_UP_REMINDER -> "follow-up-reminder";
            case FOLLOW_UP_COMPLETED -> "follow-up-completed";
            case OTP_VERIFICATION -> "otp-verification";
            case PASSWORD_RESET -> "password-reset";
            case WELCOME -> "welcome";
            default -> "default";
        };
    }
}
