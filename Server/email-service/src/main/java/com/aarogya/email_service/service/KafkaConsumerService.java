package com.aarogya.email_service.service;

import appointment_service.events.NotificationEmailEvent;
import auth_service.events.SendOtpEvent;
import com.aarogya.email_service.enums.EmailType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {

    private final EmailService emailService;

    @KafkaListener(topics = {
            "appointment-request",
            "appointment-update-status",
            "emergency-appointment-request",
            "follow-up-schedule",
            "follow-up-update-status"
    }, groupId = "email-service-group")
    public void handleAppointmentEmailEvent(@Payload NotificationEmailEvent event,
                                            @Header(KafkaHeaders.RECEIVED_TOPIC) String topic,
                                            Acknowledgment acknowledgment) {
        try {
            log.info("Processing appointment email event from topic: {} for recipient: {}", topic, event.getRecipientEmail());

            EmailType emailType = mapTopicToEmailType(topic, event);

            emailService.sendAppointmentEmail(
                    event.getRecipientEmail(),
                    event.getRecipientName(),
                    event.getSubject(),
                    emailType,
                    event.getData()
            );

            acknowledgment.acknowledge();
            log.info("Successfully processed appointment email event for: {}", event.getRecipientEmail());

        } catch (Exception e) {
            log.error("Error processing appointment email event for: {}", event.getRecipientEmail(), e);
        }
    }

    @KafkaListener(topics = "send-otp", groupId = "email-service-group")
    public void handleOtpEmailEvent(@Payload SendOtpEvent event, Acknowledgment acknowledgment) {
        try {
            log.info("Processing OTP email event for: {} with purpose: {}", event.getEmail(), event.getPurpose());

            emailService.sendOtpEmail(
                    event.getEmail(),
                    event.getRecipientName(),
                    event.getOtp(),
                    event.getPurpose(),
                    event.getRole()
            );

            acknowledgment.acknowledge();
            log.info("Successfully processed OTP email event for: {}", event.getEmail());

        } catch (Exception e) {
            log.error("Error processing OTP email event for: {}", event.getEmail(), e);
        }
    }

    private EmailType mapTopicToEmailType(String topic, NotificationEmailEvent event) {
        return switch (topic) {
            case "appointment-request" -> EmailType.APPOINTMENT_REQUEST;
            case "appointment-update-status" -> {
                if (event.getSubject().toLowerCase().contains("cancellation")) {
                    yield EmailType.APPOINTMENT_CANCELLATION;
                } else {
                    yield EmailType.APPOINTMENT_CONFIRMATION;
                }
            }
            case "emergency-appointment-request" -> EmailType.EMERGENCY_APPOINTMENT;
            case "follow-up-schedule" -> EmailType.FOLLOW_UP_SCHEDULED;
            case "follow-up-update-status" -> {
                if (event.getSubject().toLowerCase().contains("completed")) {
                    yield EmailType.FOLLOW_UP_COMPLETED;
                } else {
                    yield EmailType.FOLLOW_UP_REMINDER;
                }
            }
            default -> EmailType.SYSTEM_NOTIFICATION;
        };
    }
}
