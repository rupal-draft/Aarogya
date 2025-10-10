package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class AppointmentEmailTemplateException extends EmailTemplateException {

    private final String appointmentId;

    public AppointmentEmailTemplateException(String templateName, String appointmentId) {
        super(String.format("Failed to process appointment email template: %s for appointment: %s", templateName, appointmentId));
        this.appointmentId = appointmentId;
    }

    public AppointmentEmailTemplateException(String templateName, String appointmentId, Throwable cause) {
        super(String.format("Failed to process appointment email template: %s for appointment: %s", templateName, appointmentId), cause);
        this.appointmentId = appointmentId;
    }

}
