package com.aarogya.lab_service.exceptions;

public class ResourceNotFoundException extends LabServiceException {

    public ResourceNotFoundException(String message) {
        super(message, "RESOURCE_NOT_FOUND");
    }

    public ResourceNotFoundException(String resourceType, String identifier) {
        super(String.format("%s not found with identifier: %s", resourceType, identifier), "RESOURCE_NOT_FOUND");
    }
}
