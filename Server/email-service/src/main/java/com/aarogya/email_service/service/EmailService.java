package com.aarogya.email_service.service;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.lab_service.events.LabOrderConfirmationEvent;
import com.aarogya.lab_service.events.LabResultCreatedEvent;

public interface EmailService {
    void sendPasswordResetOtp(SendOtpEvent otpEvent);

    void sentAppointmentConfirmationEmail(AppointmentConfirmationEvent appointmentConfirmationEvent);

    void sendLabTestOrderConfirmationEmail(LabOrderConfirmationEvent labOrderConfirmationEvent);

    void sendLabResultCreatedEmail(LabResultCreatedEvent labResultCreatedEvent);
}
