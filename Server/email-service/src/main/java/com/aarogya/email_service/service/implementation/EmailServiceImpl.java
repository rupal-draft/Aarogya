package com.aarogya.email_service.service.implementation;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.*;
import com.aarogya.email_service.service.EmailService;
import com.aarogya.email_service.utils.EventValidationUtil;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;
import java.util.Locale;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final EventValidationUtil eventValidationUtil;
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");


    @Override
    public void sendPasswordResetOtp(SendOtpEvent otpEvent) {
        try {
            eventValidationUtil.validateOtpEvent(otpEvent);

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

            sendEmail(otpEvent.getEmail(), otpEvent.getSubject(), htmlContent);

            log.info("Password reset OTP email sent successfully to: {}", otpEvent.getEmail());

        } catch (OtpServiceException e) {
            throw e;
        } catch (Exception e) {
            throw new EmailSendingException(otpEvent.getEmail(), e);
        }
    }

    @Override
    public void sentAppointmentConfirmationEmail(AppointmentConfirmationEvent event) {
        try {
            eventValidationUtil.validateAppointmentEvent(event);

            Context context = new Context(Locale.forLanguageTag("en-US"));

            context.setVariable("appointmentId", event.getAppointmentId());
            context.setVariable("appointmentDate", event.getAppointmentDate());
            context.setVariable("startTime", event.getStartTime().format(timeFormatter));
            context.setVariable("endTime", event.getEndTime().format(timeFormatter));
            context.setVariable("type", event.getType());
            context.setVariable("isVirtual", event.getIsVirtual());
            context.setVariable("meetingLink", event.getMeetingLink());
            context.setVariable("consultationFee", event.getConsultationFee());
            context.setVariable("currency", event.getCurrency());

            context.setVariable("doctorName", event.getDoctorName());
            context.setVariable("doctorSpecialization", event.getDoctorSpecialization());
            context.setVariable("doctorEmail", event.getDoctorEmail());
            context.setVariable("doctorImageUrl", event.getDoctorImageUrl());

            context.setVariable("patientName", event.getPatientName());
            context.setVariable("patientEmail", event.getPatientEmail());
            context.setVariable("patientGender", event.getPatientGender());
            context.setVariable("patientDob", event.getPatientDob());

            String doctorHtmlContent;
            String patientHtmlContent;
            try {
                doctorHtmlContent = templateEngine.process("doctor-appointment-confirmation", context);
                patientHtmlContent = templateEngine.process("patient-appointment-confirmation", context);
            } catch (Exception e) {
                throw new EmailTemplateException("appointment-confirmation", e);
            }

            String doctorSubject = "New Appointment Scheduled — ID: " + event.getAppointmentId();
            String patientSubject = "Appointment Confirmation — ID: " + event.getAppointmentId();

            sendEmail(event.getDoctorEmail(), doctorSubject, doctorHtmlContent);
            sendEmail(event.getPatientEmail(), patientSubject, patientHtmlContent);
        } catch (Exception e) {
            throw new EmailSendingException(event.getDoctorEmail(), e);
        }
    }

    private void sendEmail(String email, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(email);
            helper.setText(htmlContent, true);

            ClassPathResource logo = new ClassPathResource("static/images/Logo.png");
            helper.addInline("logoImage", logo);

            mailSender.send(message);
        } catch (Exception e) {
            throw new EmailSendingException(email, e);
        }
    }
}
