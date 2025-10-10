package com.aarogya.email_service.exceptions;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class OtpExpiredException extends OtpServiceException {

    private final LocalDateTime generatedAt;
    private final LocalDateTime attemptedAt;

    public OtpExpiredException(LocalDateTime generatedAt, LocalDateTime attemptedAt) {
        super(String.format("OTP expired. Generated at: %s, Attempted at: %s", generatedAt, attemptedAt),
                "OTP_EXPIRED_001");
        this.generatedAt = generatedAt;
        this.attemptedAt = attemptedAt;
    }

}
