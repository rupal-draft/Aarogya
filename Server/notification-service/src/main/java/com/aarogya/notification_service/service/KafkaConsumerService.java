package com.aarogya.notification_service.service;

import com.aarogya.appointment_service.events.NotificationSaveEvent;
import com.aarogya.article_service.event.NotificationEvent;

public interface KafkaConsumerService {

    void handleAppointmentNotification(NotificationSaveEvent event);

    void handleArticleNotification(NotificationEvent event);

    void handlePharmacyNotification(com.aarogya.pharmacy_service.events.NotificationEvent event, String userId);
}
