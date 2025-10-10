package com.aarogya.email_service.service.implementation;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.*;
import com.aarogya.email_service.service.EmailService;
import com.aarogya.email_service.utils.EventValidationUtil;
import com.aarogya.lab_service.events.LabOrderConfirmationEvent;
import com.aarogya.lab_service.events.LabResultCreatedEvent;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;
    private final DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");
    private final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
    private final DateTimeFormatter labDateTimeFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    @Override
    public void sendPasswordResetOtp(SendOtpEvent otpEvent) {
        String eventType = "SEND_OTP";
        String eventId = otpEvent.getEmail();

        try {
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
                throw new EventEmailTemplateException(
                        "Failed to process OTP email template",
                        eventType, eventId, "password-reset-otp", e
                );
            }

            sendEmail(otpEvent.getEmail(), otpEvent.getSubject(), htmlContent, eventType, eventId);
            log.info("Password reset OTP email sent successfully to: {}", otpEvent.getEmail());

        } catch (EventEmailException | EventEmailTemplateException e) {
            throw e;
        } catch (Exception e) {
            throw new EventEmailException(
                    "Failed to send password reset OTP",
                    eventType, eventId, otpEvent.getEmail(), e
            );
        }
    }

    @Override
    public void sentAppointmentConfirmationEmail(AppointmentConfirmationEvent event) {
        String eventType = "APPOINTMENT_CONFIRMATION";
        String eventId = event.getAppointmentId();

        try {
            Context context = new Context(Locale.forLanguageTag("en-US"));

            context.setVariable("appointmentId", event.getAppointmentId());
            context.setVariable("appointmentDate", event.getAppointmentDate());
            context.setVariable("startTime", formatTime(event.getStartTime()));
            context.setVariable("endTime", formatTime(event.getEndTime()));
            context.setVariable("type", event.getType());
            context.setVariable("isVirtual", event.getIsVirtual());
            context.setVariable("meetingLink", event.getMeetingLink());
            context.setVariable("consultationFee", event.getConsultationFee());
            context.setVariable("currency", event.getCurrency());

            context.setVariable("doctorName", event.getDoctorName());
            context.setVariable("doctorSpecialization", event.getDoctorSpecialization());
            context.setVariable("doctorEmail", event.getDoctorEmail());
            context.setVariable("doctorImageUrl",
                    event.getDoctorImageUrl() != null ? event.getDoctorImageUrl() : "");

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
                throw new EventEmailTemplateException(
                        "Failed to process appointment confirmation templates",
                        eventType, eventId, "appointment-confirmation", e
                );
            }

            String doctorSubject = "New Appointment Scheduled — ID: " + event.getAppointmentId();
            String patientSubject = "Appointment Confirmation — ID: " + event.getAppointmentId();

            boolean doctorEmailSent = sendEmailWithFallback(
                    event.getDoctorEmail(), doctorSubject, doctorHtmlContent, eventType, eventId
            );
            boolean patientEmailSent = sendEmailWithFallback(
                    event.getPatientEmail(), patientSubject, patientHtmlContent, eventType, eventId
            );

            if (!doctorEmailSent || !patientEmailSent) {
                throw new EventEmailException(
                        "Failed to send one or more appointment confirmation emails",
                        eventType, eventId, "multiple recipients", null
                );
            }

            log.info("Appointment confirmation emails sent successfully for appointment: {}", eventId);

        } catch (EventEmailException | EventEmailTemplateException e) {
            throw e;
        } catch (Exception e) {
            throw new EventEmailException(
                    "Failed to send appointment confirmation emails",
                    eventType, eventId, "multiple recipients", e
            );
        }
    }

    @Override
    public void sendLabTestOrderConfirmationEmail(LabOrderConfirmationEvent event) {
        String eventType = "LAB_ORDER_CONFIRMATION";
        String eventId = event.getOrderId();

        try {
            Context labOrderContext = new Context(Locale.forLanguageTag("en-US"));

            if (event.getScheduledDateTime() == null) {
                throw new EventValidationException(
                        "Scheduled date time is required",
                        eventType, eventId, "scheduledDateTime", null
                );
            }

            labOrderContext.setVariable("orderNumber", event.getOrderNumber());
            labOrderContext.setVariable("scheduledDateTime", event.getScheduledDateTime());
            labOrderContext.setVariable("orderStatus", event.getOrderStatus());
            labOrderContext.setVariable("paymentStatus", event.getPaymentStatus());

            labOrderContext.setVariable("patientName", event.getPatientName());

            labOrderContext.setVariable("doctorName", event.getDoctorName());

            labOrderContext.setVariable("tests", event.getTests());

            labOrderContext.setVariable("location",
                    event.getLocation() != null ? event.getLocation() : "Aarogya Healthcare Diagnostic Center");
            labOrderContext.setVariable("specialInstructions",
                    event.getSpecialInstructions() != null ? event.getSpecialInstructions() : "No special instructions");

            labOrderContext.setVariable("totalAmount", event.getTotalAmount());

            String htmlContent;
            try {
                htmlContent = templateEngine.process("lab-order-confirmation", labOrderContext);
            } catch (Exception e) {
                throw new EventEmailTemplateException(
                        "Failed to process lab order confirmation template",
                        eventType, eventId, "lab-order-confirmation", e
                );
            }

            String subject = "🧾 Your Lab Order #" + event.getOrderNumber() + " Has Been Confirmed";
            sendEmail(event.getPatientEmail(), subject, htmlContent, eventType, eventId);

            log.info("Lab order confirmation email sent successfully for order: {}", eventId);

        } catch (EventEmailException | EventEmailTemplateException | EventValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new EventEmailException(
                    "Failed to send lab order confirmation email",
                    eventType, eventId, event.getPatientEmail(), e
            );
        }
    }

    @Override
    public void sendLabResultCreatedEmail(LabResultCreatedEvent event) {
        String eventType = "LAB_RESULT_CREATED";
        String eventId = event.getResultId();

        try {
            Context labResultContext = new Context(Locale.forLanguageTag("en-US"));

            if (event.getParameters() == null || event.getParameters().isEmpty()) {
                throw new EventValidationException(
                        "Result parameters are required",
                        eventType, eventId, "parameters", null
                );
            }

            if (event.getResultGeneratedAt() == null) {
                throw new EventValidationException(
                        "Result generated at timestamp is required",
                        eventType, eventId, "resultGeneratedAt", null
                );
            }

            List<LabResultCreatedEvent.ResultParameter> formattedParams = event.getParameters().stream()
                    .map(param -> {
                        String status = param.getStatus() != null ? param.getStatus().toLowerCase() : "normal";
                        return LabResultCreatedEvent.ResultParameter.builder()
                                .parameterName(param.getParameterName())
                                .value(param.getValue())
                                .unit(param.getUnit() != null ? param.getUnit() : "")
                                .normalRange(param.getNormalRange() != null ? param.getNormalRange() : "")
                                .status(status)
                                .build();
                    })
                    .collect(Collectors.toList());

            labResultContext.setVariable("resultId", event.getResultId());
            labResultContext.setVariable("orderNumber", event.getOrderNumber());

            labResultContext.setVariable("patientName", event.getPatientName());

            labResultContext.setVariable("testName", event.getTestName());
            labResultContext.setVariable("testCode", event.getTestCode() != null ? event.getTestCode() : "");

            labResultContext.setVariable("parameters", formattedParams);
            labResultContext.setVariable("overallResult", event.getOverallResult());
            labResultContext.setVariable("interpretation",
                    event.getInterpretation() != null ? event.getInterpretation() : "No specific interpretation provided.");
            labResultContext.setVariable("reportUrl",
                    event.getReportUrl() != null ? event.getReportUrl() : "#");
            labResultContext.setVariable("resultGeneratedAt", event.getResultGeneratedAt().format(dateTimeFormatter));

            labResultContext.setVariable("isCritical", event.isCritical());

            labResultContext.setVariable("doctorName", event.getDoctorName());

            String htmlContent;
            try {
                htmlContent = templateEngine.process("lab-result-issue", labResultContext);
            } catch (Exception e) {
                throw new EventEmailTemplateException(
                        "Failed to process lab result template",
                        eventType, eventId, "lab-result-issue", e
                );
            }

            String subject = "🧪 Your Lab Results for Order #" + event.getOrderNumber() + " Are Now Available";
            sendEmail(event.getPatientEmail(), subject, htmlContent, eventType, eventId);

            log.info("Lab result email sent successfully for result: {}", eventId);

        } catch (EventEmailException | EventEmailTemplateException | EventValidationException e) {
            throw e;
        } catch (Exception e) {
            throw new EventEmailException(
                    "Failed to send lab result email",
                    eventType, eventId, event.getPatientEmail(), e
            );
        }
    }

    private void sendEmail(String email, String subject, String htmlContent, String eventType, String eventId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            try {
                ClassPathResource logo = new ClassPathResource("static/images/Logo.png");
                if (logo.exists()) {
                    helper.addInline("logoImage", logo);
                } else {
                    log.warn("Logo image not found at: static/images/Logo.png");
                }
            } catch (Exception e) {
                log.warn("Failed to add logo image to email: {}", e.getMessage());
            }

            mailSender.send(message);

        } catch (Exception e) {
            throw new EventEmailException(
                    "Failed to send email to: " + email,
                    eventType, eventId, email, e
            );
        }
    }

    private boolean sendEmailWithFallback(String email, String subject, String htmlContent, String eventType, String eventId) {
        try {
            sendEmail(email, subject, htmlContent, eventType, eventId);
            return true;
        } catch (EventEmailException e) {
            log.error("Failed to send email to {} for event {}: {}", email, eventId, e.getMessage());
            return false;
        }
    }

    private String formatTime(LocalTime time) {
        return time != null ? time.format(timeFormatter) : "";
    }
}
