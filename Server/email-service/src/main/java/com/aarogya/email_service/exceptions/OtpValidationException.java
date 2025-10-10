package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class OtpValidationException extends OtpServiceException {

    private final String otp;
    private final String email;

    public OtpValidationException(String message, String otp, String email) {
        super(String.format("%s - OTP: %s, Email: %s", message, otp, email), "OTP_VALID_001");
        this.otp = otp;
        this.email = email;
    }

    public OtpValidationException(String message, String otp, String email, Throwable cause) {
        super(String.format("%s - OTP: %s, Email: %s", message, otp, email), cause, "OTP_VALID_002");
        this.otp = otp;
        this.email = email;
    }

}
