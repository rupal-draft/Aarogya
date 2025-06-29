package com.aarogya.article_service.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationEvent {
    private String userId;
    private SaveNotificationType type;
    private String title;
    private Map<String, Object> data;
    private LocalDateTime timestamp;
    private boolean read;

    @JsonFormat(shape = JsonFormat.Shape.STRING)
    public enum SaveNotificationType {
        POST,
        LIKE,
        COMMENT
    }
}
