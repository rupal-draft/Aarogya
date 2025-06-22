package com.aarogya.notification_service.schedular;

import com.aarogya.notification_service.model.BaseNotification;
import com.aarogya.notification_service.repository.BaseNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
@EnableScheduling
@ConditionalOnProperty(name = "notification.cleanup.enabled", havingValue = "true", matchIfMissing = true)
public class NotificationCleanupScheduler {

    private final BaseNotificationRepository baseNotificationRepository;

    @Value("${notification.cleanup.retention-days:90}")
    private int retentionDays;

    @Scheduled(cron = "${notification.cleanup.schedule:0 0 2 * * ?}")
    public void cleanupExpiredNotifications() {
        log.info("Starting cleanup of expired notifications");

        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusDays(retentionDays);

            List<BaseNotification> expiredNotifications = baseNotificationRepository
                    .findExpiredNotifications(LocalDateTime.now());

            if (!expiredNotifications.isEmpty()) {
                baseNotificationRepository.deleteAll(expiredNotifications);
                log.info("Deleted {} expired notifications", expiredNotifications.size());
            }

            log.info("Completed cleanup of expired notifications");

        } catch (Exception e) {
            log.error("Error during notification cleanup", e);
        }
    }
}
