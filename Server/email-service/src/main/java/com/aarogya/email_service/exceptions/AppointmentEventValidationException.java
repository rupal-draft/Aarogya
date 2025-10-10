package com.aarogya.email_service.exceptions;

public class AppointmentEventValidationException extends EventValidationException {

    public AppointmentEventValidationException(Object invalidEvent, String validationMessage) {
        super("AppointmentConfirmationEvent", invalidEvent, validationMessage);
    }

    public AppointmentEventValidationException(Object invalidEvent, String validationMessage, Throwable cause) {
        super("AppointmentConfirmationEvent", invalidEvent, validationMessage, cause);
    }
}
