package com.aarogya.notification_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationSummaryDTO {
    private long totalNotifications;
    private long unreadNotifications;
    private long readNotifications;
    private long archivedNotifications;
    private long appointmentNotifications;
    private long articleNotifications;
    private long pharmacyNotifications;
}

