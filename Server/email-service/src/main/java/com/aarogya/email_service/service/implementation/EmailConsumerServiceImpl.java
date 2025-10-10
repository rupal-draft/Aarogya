package com.aarogya.email_service.service.implementation;

import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.*;
import com.aarogya.email_service.service.EmailConsumerService;
import com.aarogya.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmailConsumerServiceImpl implements EmailConsumerService {

    private final EmailService emailService;

    @Override
    @KafkaListener(
            topics = "send-otp",
            groupId = "otp-send-group",
            containerFactory = "otpSendingKafkaListenerFactory"
    )
    public void consumeSendOtpEvent(SendOtpEvent sendOtpEvent) {
        try {
            log.info("Received OTP event for email: {}, purpose: {}",
                    sendOtpEvent.getEmail(), sendOtpEvent.getPurpose());

            emailService.sendPasswordResetOtp(sendOtpEvent);
            log.info("Successfully processed OTP event for: {}", sendOtpEvent.getEmail());

        } catch (EventValidationException | OtpValidationException | EmailValidationException e) {
            log.warn("Validation error processing OTP event: {}", e.getMessage());
            throw e;
        } catch (EmailSendingException | EmailTemplateException e) {
            log.error("Retractable error processing OTP event: {}", e.getMessage());
            throw new KafkaConsumerException("send-otp", e);
        } catch (Exception e) {
            log.error("Unexpected error processing OTP event for email: {}", sendOtpEvent.getEmail(), e);
            throw new KafkaConsumerException("send-otp", e);
        }
    }
}
