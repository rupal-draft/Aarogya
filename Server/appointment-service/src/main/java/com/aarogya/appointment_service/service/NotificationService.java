package com.aarogya.appointment_service.service;

import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.models.enums.AppointmentStatus;

public interface NotificationService {

    void sendAppointmentRequestNotification(Appointment appointment);

    void sendAppointmentStatusUpdateNotification(Appointment appointment, AppointmentStatus oldStatus);

    void sendEmergencyAppointmentNotification(Appointment appointment);

    void sendFollowUpScheduledNotification(FollowUp followUp, Appointment originalAppointment);

    void sendFollowUpStatusNotification(FollowUp followUp);
}
