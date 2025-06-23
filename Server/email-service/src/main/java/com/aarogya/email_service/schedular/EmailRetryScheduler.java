package com.aarogya.email_service.schedular;

import com.aarogya.email_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@EnableScheduling
public class EmailRetryScheduler {

    private final EmailService emailService;

    public EmailRetryScheduler(EmailService emailService) {
        this.emailService = emailService;
    }

    @Scheduled(fixedDelay = 300000)
    public void retryFailedEmails() {
        log.info("Starting scheduled retry of failed emails");

        try {
            emailService.retryFailedEmails();
            log.info("Completed scheduled retry of failed emails");
        } catch (Exception e) {
            log.error("Error during scheduled email retry", e);
        }
    }
}
