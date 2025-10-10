package com.aarogya.email_service.service;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;

public interface EmailConsumerService {
    void consumeSendOtpEvent(SendOtpEvent sendOtpEvent);
    void consumeAppointmentConfirmationEvent(AppointmentConfirmationEvent appointmentConfirmationEvent);
}
