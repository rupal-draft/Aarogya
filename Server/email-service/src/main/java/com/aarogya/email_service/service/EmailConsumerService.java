package com.aarogya.email_service.service;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.lab_service.events.LabOrderConfirmationEvent;
import com.aarogya.lab_service.events.LabResultCreatedEvent;

public interface EmailConsumerService {
    void consumeSendOtpEvent(SendOtpEvent sendOtpEvent);
    void consumeAppointmentConfirmationEvent(AppointmentConfirmationEvent appointmentConfirmationEvent);
    void consumeLabTestOrderConfirmationEvent(LabOrderConfirmationEvent labOrderConfirmationEvent);
    void consumeLabResultCreatedEvent(LabResultCreatedEvent labResultCreatedEvent);
}
