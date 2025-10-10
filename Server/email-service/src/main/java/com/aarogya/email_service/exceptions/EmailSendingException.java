package com.aarogya.email_service.exceptions;

public class EmailSendingException extends OtpServiceException {

    public EmailSendingException(String email) {
        super(String.format("Failed to send email to: %s", email), "OTP_EMAIL_001");
    }

    public EmailSendingException(String email, Throwable cause) {
        super(String.format("Failed to send email to: %s", email), cause, "OTP_EMAIL_002");
    }

    public EmailSendingException(String message, String email, Throwable cause) {
        super(String.format("%s - Email: %s", message, email), cause, "OTP_EMAIL_003");
    }
}
