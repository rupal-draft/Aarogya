package com.aarogya.email_service.exceptions;

import lombok.Getter;

@Getter
public class AppointmentKafkaConsumerException extends KafkaConsumerException {

    private final String appointmentId;

    public AppointmentKafkaConsumerException(String topic, String appointmentId) {
        super(String.format("Error consuming appointment message from topic: %s for appointment: %s", topic, appointmentId));
        this.appointmentId = appointmentId;
    }

    public AppointmentKafkaConsumerException(String topic, String appointmentId, Throwable cause) {
        super(String.format("Error consuming appointment message from topic: %s for appointment: %s", topic, appointmentId), cause);
        this.appointmentId = appointmentId;
    }

    public AppointmentKafkaConsumerException(String message, String topic, String appointmentId, Throwable cause) {
        super(String.format("%s - Topic: %s, Appointment: %s", message, topic, appointmentId), cause);
        this.appointmentId = appointmentId;
    }

}
