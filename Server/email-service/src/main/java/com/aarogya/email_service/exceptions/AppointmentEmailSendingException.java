package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class AppointmentEmailSendingException extends EmailSendingException {

    private final String appointmentId;

    public AppointmentEmailSendingException(String email, String appointmentId) {
        super(String.format("Failed to send appointment confirmation email to: %s for appointment: %s", email, appointmentId));
        this.appointmentId = appointmentId;
    }

    public AppointmentEmailSendingException(String email, String appointmentId, Throwable cause) {
        super(String.format("Failed to send appointment confirmation email to: %s for appointment: %s", email, appointmentId), cause);
        this.appointmentId = appointmentId;
    }

    public AppointmentEmailSendingException(String message, String email, String appointmentId, Throwable cause) {
        super(String.format("%s - Email: %s, Appointment: %s", message, email, appointmentId), cause);
        this.appointmentId = appointmentId;
    }

}
