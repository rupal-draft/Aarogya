package com.aarogya.patient_management_service.exceptions;



public class ResourceConflictException extends RuntimeConflict {
    public ResourceConflictException(String message) {
        super(message);
    }
}
