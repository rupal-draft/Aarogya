package com.aarogya.email_service.exceptions;

public class EmailTemplateException extends OtpServiceException {

    public EmailTemplateException(String templateName) {
        super(String.format("Failed to process email template: %s", templateName), "OTP_TEMPLATE_001");
    }

    public EmailTemplateException(String templateName, Throwable cause) {
        super(String.format("Failed to process email template: %s", templateName), cause, "OTP_TEMPLATE_002");
    }
}
