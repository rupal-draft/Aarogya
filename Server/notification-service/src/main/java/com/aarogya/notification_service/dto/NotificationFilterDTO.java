package com.aarogya.notification_service.dto;

import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationFilterDTO {
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime fromDate;
    private LocalDateTime toDate;
    private String category;
    private Integer minPriority;
    private Integer maxPriority;
}
