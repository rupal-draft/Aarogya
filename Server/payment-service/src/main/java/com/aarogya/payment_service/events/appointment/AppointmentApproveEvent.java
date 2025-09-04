package com.aarogya.payment_service.events.appointment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppointmentApproveEvent {
    private String appointmentId;
    private String paymentId;
}
