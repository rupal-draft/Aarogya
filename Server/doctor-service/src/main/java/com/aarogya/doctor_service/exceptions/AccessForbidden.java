package com.aarogya.doctor_service.exceptions;

public class AccessForbidden extends RuntimeException {
    public AccessForbidden(String message) {
        super(message);
    }
}
