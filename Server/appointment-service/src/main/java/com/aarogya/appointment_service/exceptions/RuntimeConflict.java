package com.aarogya.appointment_service.exceptions;

public class RuntimeConflict extends RuntimeException {
    public RuntimeConflict(String message) {
        super(message);
    }
}
