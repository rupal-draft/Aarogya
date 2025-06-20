package com.aarogya.pharmacy_service.events;

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
    public String message;
    private LocalDateTime timeStamp;
    private boolean read;
    private Map<String, Object> data;
}
