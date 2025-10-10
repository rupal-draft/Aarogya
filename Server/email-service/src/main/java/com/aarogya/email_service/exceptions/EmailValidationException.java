package com.aarogya.email_service.exceptions;

public class EmailValidationException extends OtpServiceException {

    public EmailValidationException(String field, String value) {
        super(String.format("Email validation failed for field '%s': %s", field, value), "OTP_VALIDATION_001");
    }

    public EmailValidationException(String message) {
        super(message, "OTP_VALIDATION_002");
    }
}
