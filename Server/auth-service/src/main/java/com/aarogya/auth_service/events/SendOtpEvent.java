package com.aarogya.auth_service.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SendOtpEvent {

    private String email;
    private String role;
    private String subject;
    private String otp;

    private String purpose;

    private LocalDateTime generatedAt;

    private String recipientName;
}
