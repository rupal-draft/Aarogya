package com.aarogya.appointment_service.service;

import com.aarogya.events.AppointmentApproveEvent;
import com.aarogya.events.AppointmentRejectEvent;

public interface AppointmentConsumerService {
    void approveAppointment(AppointmentApproveEvent event);
    void rejectAppointment(AppointmentRejectEvent event);
}
