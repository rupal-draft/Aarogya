package com.aarogya.notification_service.service;

import appointment_service.events.NotificationSaveEvent;
import article_service.event.NotificationEvent;

public interface KafkaConsumerService {

    void handleAppointmentNotification(NotificationSaveEvent event);

    void handleArticleNotification(NotificationEvent event);

    void handlePharmacyNotification(pharmacy_service.events.NotificationEvent event, String userId);
}
