package com.aarogya.payment_service.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WebhookRequest {
    private String event;
    private Map<String, Object> payload;
    private Map<String, String> headers;
}

