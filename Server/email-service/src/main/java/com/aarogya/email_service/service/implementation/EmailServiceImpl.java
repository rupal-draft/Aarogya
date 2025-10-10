package com.aarogya.email_service.service.implementation;

import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.*;
import com.aarogya.email_service.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.File;
import java.time.LocalDateTime;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Override
    public void sendPasswordResetOtp(SendOtpEvent otpEvent) {
        try {
            validateOtpEvent(otpEvent);

            Context context = new Context();
            context.setVariable("recipientName", otpEvent.getRecipientName());
            context.setVariable("otp", otpEvent.getOtp());
            context.setVariable("purpose", otpEvent.getPurpose());
            context.setVariable("generatedAt", otpEvent.getGeneratedAt());
            context.setVariable("role", otpEvent.getRole());

            String htmlContent;
            try {
                htmlContent = templateEngine.process("password-reset-otp", context);
            } catch (Exception e) {
                throw new EmailTemplateException("password-reset-otp", e);
            }

            sendEmail(otpEvent, htmlContent);

            log.info("Password reset OTP email sent successfully to: {}", otpEvent.getEmail());

        } catch (OtpServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new EmailSendingException(otpEvent.getEmail(), e);
        }
    }

    private void validateOtpEvent(SendOtpEvent event) {
        if (event.getEmail() == null || event.getEmail().trim().isEmpty()) {
            throw new EmailValidationException("email", event.getEmail());
        }
        if (event.getOtp() == null || event.getOtp().trim().isEmpty()) {
            throw new OtpValidationException("OTP cannot be null or empty", event.getOtp(), event.getEmail());
        }
        if (event.getRecipientName() == null || event.getRecipientName().trim().isEmpty()) {
            throw new EmailValidationException("recipientName", event.getRecipientName());
        }

        if (event.getGeneratedAt() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (event.getGeneratedAt().plusMinutes(10).isBefore(now)) {
                throw new OtpExpiredException(event.getGeneratedAt(), now);
            }
        }
    }

    private void sendEmail(SendOtpEvent otpEvent, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(otpEvent.getEmail());
            helper.setSubject(otpEvent.getSubject());
            helper.setText(htmlContent, true);

            ClassPathResource logo = new ClassPathResource("static/images/Logo.png");
            helper.addInline("logoImage", logo);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendingException(otpEvent.getEmail(), e);
        }
    }
}
