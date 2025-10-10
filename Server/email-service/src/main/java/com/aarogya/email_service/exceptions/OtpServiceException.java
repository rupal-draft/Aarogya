package com.aarogya.email_service.exceptions;

import lombok.Getter;

import java.time.Instant;

@Getter
public abstract class OtpServiceException extends RuntimeException {

    private final String errorCode;
    private final Instant timestamp;

    public OtpServiceException(String message) {
        super(message);
        this.errorCode = "OTP_001";
        this.timestamp = Instant.now();
    }

    public OtpServiceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
        this.timestamp = Instant.now();
    }

    public OtpServiceException(String message, Throwable cause, String errorCode) {
        super(message, cause);
        this.errorCode = errorCode;
        this.timestamp = Instant.now();
    }

}
