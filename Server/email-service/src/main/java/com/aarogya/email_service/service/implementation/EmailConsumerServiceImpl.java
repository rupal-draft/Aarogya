package com.aarogya.email_service.service.implementation;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.*;
import com.aarogya.email_service.service.EmailConsumerService;
import com.aarogya.email_service.service.EmailService;
import com.aarogya.email_service.utils.EventValidationUtil;
import com.aarogya.lab_service.events.LabOrderConfirmationEvent;
import com.aarogya.lab_service.events.LabResultCreatedEvent;
import com.aarogya.pharmacy_service.events.OrderConfirmationEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailConsumerServiceImpl implements EmailConsumerService {

    private final EmailService emailService;
    private final EventValidationUtil eventValidationUtil;

    @Override
    @KafkaListener(
            topics = "send-otp",
            groupId = "otp-send-group",
            containerFactory = "otpSendingKafkaListenerFactory"
    )
    public void consumeSendOtpEvent(SendOtpEvent sendOtpEvent) {
        String eventType = "SEND_OTP";
        String eventId = sendOtpEvent.getEmail();

        try {
            log.info("Received OTP event for email: {}, purpose: {}",
                    sendOtpEvent.getEmail(), sendOtpEvent.getPurpose());

            eventValidationUtil.validateOtpEvent(sendOtpEvent);

            emailService.sendPasswordResetOtp(sendOtpEvent);
            log.info("Successfully processed OTP event for: {}", sendOtpEvent.getEmail());

        } catch (EventValidationException e) {
            log.warn("Validation error processing OTP event: {}", e.getMessage());
            throw e; 
        } catch (EventEmailException | EventEmailTemplateException e) {
            log.error("Retractable error processing OTP event: {}", e.getMessage());
            throw new EventKafkaException(
                    "Failed to process OTP event",
                    eventType, eventId, "send-otp", e
            );
        } catch (Exception e) {
            log.error("Unexpected error processing OTP event for email: {}", sendOtpEvent.getEmail(), e);
            throw new EventKafkaException(
                    "Unexpected error processing OTP event",
                    eventType, eventId, "send-otp", e
            );
        }
    }

    @Override
    @KafkaListener(
            topics = "appointment-confirm-email",
            groupId = "appointment-confirmation-group",
            containerFactory = "appointmentConfirmationKafkaListenerFactory"
    )
    public void consumeAppointmentConfirmationEvent(AppointmentConfirmationEvent appointmentConfirmationEvent) {
        String eventType = "APPOINTMENT_CONFIRMATION";
        String eventId = appointmentConfirmationEvent.getAppointmentId();

        try {
            log.info("Received appointment confirmation event for emails: {}, {}",
                    appointmentConfirmationEvent.getDoctorEmail(), appointmentConfirmationEvent.getPatientEmail());

            eventValidationUtil.validateAppointmentEvent(appointmentConfirmationEvent);

            emailService.sentAppointmentConfirmationEmail(appointmentConfirmationEvent);
            log.info("Successfully processed appointment confirmation event for:{}, {}",
                    appointmentConfirmationEvent.getDoctorEmail(), appointmentConfirmationEvent.getPatientEmail());

        } catch (EventValidationException e) {
            log.warn("Validation error processing appointment confirmation event: {}", e.getMessage());
            throw e; 
        } catch (EventEmailException | EventEmailTemplateException e) {
            log.error("Retractable error processing appointment confirmation event: {}", e.getMessage());
            throw new EventKafkaException(
                    "Failed to process appointment confirmation event",
                    eventType, eventId, "appointment-confirm-email", e
            );
        } catch (Exception e) {
            log.error("Unexpected error processing appointment confirmation event for appointment id: {}",
                    appointmentConfirmationEvent.getAppointmentId(), e);
            throw new EventKafkaException(
                    "Unexpected error processing appointment confirmation event",
                    eventType, eventId, "appointment-confirm-email", e
            );
        }
    }

    @Override
    @KafkaListener(
            topics = "lab-order-confirm-email",
            groupId = "lab-test-order-confirmation-group",
            containerFactory = "labTestOrderConfirmationKafkaListenerFactory"
    )
    public void consumeLabTestOrderConfirmationEvent(LabOrderConfirmationEvent labOrderConfirmationEvent) {
        String eventType = "LAB_ORDER_CONFIRMATION";
        String eventId = labOrderConfirmationEvent.getOrderId();

        try {
            log.info("Received lab test order confirmation event for emails: {}",
                    labOrderConfirmationEvent.getPatientEmail());

            eventValidationUtil.validateLabOrderEvent(labOrderConfirmationEvent);

            emailService.sendLabTestOrderConfirmationEmail(labOrderConfirmationEvent);
            log.info("Successfully processed lab test order confirmation event for: {}",
                    labOrderConfirmationEvent.getPatientEmail());

        } catch (EventValidationException e) {
            log.warn("Validation error processing lab order confirmation event: {}", e.getMessage());
            throw e; 
        } catch (EventEmailException | EventEmailTemplateException e) {
            log.error("Retryable error processing lab order confirmation event: {}", e.getMessage());
            throw new EventKafkaException(
                    "Failed to process lab order confirmation event",
                    eventType, eventId, "lab-order-confirm-email", e
            );
        } catch (Exception e) {
            log.error("Unexpected error processing lab order confirmation event for order id: {}",
                    labOrderConfirmationEvent.getOrderId(), e);
            throw new EventKafkaException(
                    "Unexpected error processing lab order confirmation event",
                    eventType, eventId, "lab-order-confirm-email", e
            );
        }
    }

    @Override
    @KafkaListener(
            topics = "lab-result-created-email",
            groupId = "lab-result-created-group",
            containerFactory = "labResultCreatedKafkaListenerFactory"
    )
    public void consumeLabResultCreatedEvent(LabResultCreatedEvent labResultCreatedEvent) {
        String eventType = "LAB_RESULT_CREATED";
        String eventId = labResultCreatedEvent.getResultId();

        try {
            log.info("Received lab result created event for emails: {}",
                    labResultCreatedEvent.getPatientEmail());

            eventValidationUtil.validateLabResultEvent(labResultCreatedEvent);

            emailService.sendLabResultCreatedEmail(labResultCreatedEvent);
            log.info("Successfully processed lab result created event for: {}",
                    labResultCreatedEvent.getPatientEmail());

        } catch (EventValidationException e) {
            log.warn("Validation error processing lab result created event: {}", e.getMessage());
            throw e; 
        } catch (EventEmailException | EventEmailTemplateException e) {
            log.error("Retractable error processing lab result created event: {}", e.getMessage());
            throw new EventKafkaException(
                    "Failed to process lab result created event",
                    eventType, eventId, "lab-result-created-email", e
            );
        } catch (Exception e) {
            log.error("Unexpected error processing lab result created event for result id: {}",
                    labResultCreatedEvent.getResultId(), e);
            throw new EventKafkaException(
                    "Unexpected error processing lab result created event",
                    eventType, eventId, "lab-result-created-email", e
            );
        }
    }

    @Override
    @KafkaListener(
            topics = "order-confirm-email",
            groupId = "order-confirm-group",
            containerFactory = "orderConfirmationKafkaListenerFactory"
    )
    public void consumeOrderConfirmationEvent(OrderConfirmationEvent orderConfirmationEvent) {
        String eventType = "ORDER_CONFIRMATION";
        String eventId = orderConfirmationEvent.getOrderId();

        try {
            log.info("Received order confirmation event for order: {}, patient: {}",
                    orderConfirmationEvent.getOrderId(), orderConfirmationEvent.getPatientEmail());

            eventValidationUtil.validateOrderConfirmationEvent(orderConfirmationEvent);

            emailService.sendOrderConfirmationEmail(orderConfirmationEvent);
            log.info("Successfully processed order confirmation event for: {}",
                    orderConfirmationEvent.getOrderId());

        } catch (EventValidationException e) {
            log.warn("Validation error processing order confirmation event: {}", e.getMessage());
            throw e;
        } catch (EventEmailException | EventEmailTemplateException e) {
            log.error("Retryable error processing order confirmation event: {}", e.getMessage());
            throw new EventKafkaException(
                    "Failed to process order confirmation event",
                    eventType, eventId, "order-confirm-email", e
            );
        } catch (Exception e) {
            log.error("Unexpected error processing order confirmation event for order id: {}",
                    orderConfirmationEvent.getOrderId(), e);
            throw new EventKafkaException(
                    "Unexpected error processing order confirmation event",
                    eventType, eventId, "order-confirm-email", e
            );
        }
    }
}
