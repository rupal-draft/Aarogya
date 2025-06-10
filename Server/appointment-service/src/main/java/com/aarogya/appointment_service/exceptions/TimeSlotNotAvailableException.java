package com.aarogya.appointment_service.exceptions;

public class TimeSlotNotAvailableException extends RuntimeException {
    public TimeSlotNotAvailableException(String message) {
        super(message);
    }

    public TimeSlotNotAvailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
