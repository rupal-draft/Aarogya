package com.aarogya.lab_service.exceptions;

public class LabServiceException extends RuntimeException {
    private final String errorCode;

    public LabServiceException(String message) {
        super(message);
        this.errorCode = "LAB_SERVICE_ERROR";
    }

    public LabServiceException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public LabServiceException(String message, Throwable cause) {
        super(message, cause);
        this.errorCode = "LAB_SERVICE_ERROR";
    }

    public LabServiceException(String message, String errorCode, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
