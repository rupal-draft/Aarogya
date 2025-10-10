package com.aarogya.email_service.advice;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ErrorResponse {
    private String errorCode;
    private String message;
    private Instant timestamp;
    private Map<String, Object> details;

    public ErrorResponse(String errorCode, String message, Instant timestamp) {
        this.errorCode = errorCode;
        this.message = message;
        this.timestamp = timestamp;
        this.details = new HashMap<>();
    }

    public void addDetail(String key, Object value) {
        if (this.details == null) {
            this.details = new HashMap<>();
        }
        this.details.put(key, value);
    }
}
