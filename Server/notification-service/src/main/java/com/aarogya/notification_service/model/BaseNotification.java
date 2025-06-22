package com.aarogya.notification_service.model;

import com.aarogya.notification_service.enums.NotificationStatus;
import com.aarogya.notification_service.enums.NotificationType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = false)
@Document(collection = "notifications")
@CompoundIndexes({
        @CompoundIndex(name = "user_type_status_idx", def = "{'userId': 1, 'type': 1, 'status': 1}"),
        @CompoundIndex(name = "user_created_idx", def = "{'userId': 1, 'createdAt': -1}"),
        @CompoundIndex(name = "user_status_created_idx", def = "{'userId': 1, 'status': 1, 'createdAt': -1}")
})
public class BaseNotification {
    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private NotificationType type;

    private String title;

    private String message;

    @Indexed
    private NotificationStatus status = NotificationStatus.UNREAD;

    private Map<String, Object> data;

    @CreatedDate
    @Indexed
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Indexed
    private LocalDateTime readAt;

    private Integer priority = 1;

    private String category;

    private LocalDateTime expiresAt;
}
