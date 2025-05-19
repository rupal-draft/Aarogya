package com.aarogya.email_service.consumer;

import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.service.EmailService;
import org.apache.kafka.shaded.com.google.protobuf.ServiceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceConsumer {

    private static final String topicName = "send-otp";
    private static final Logger log = LoggerFactory.getLogger(AuthServiceConsumer.class);


    private final EmailService emailService;

    public AuthServiceConsumer(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = topicName)
    public void listenSendOtp(SendOtpEvent sendOtpEvent) throws ServiceException {
        log.info("Received message: {}", sendOtpEvent);
        try {
            emailService.sendOtp(sendOtpEvent);
            log.info("Email sent successfully");
        } catch (Exception e) {
            log.error("Error sending email", e);
            throw new ServiceException("Error sending email", e);
        }
    }
}
