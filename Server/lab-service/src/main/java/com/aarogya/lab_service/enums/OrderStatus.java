package com.aarogya.lab_service.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum OrderStatus {
    PENDING_PAYMENT("Pending Payment"),
    CONFIRMED("Confirmed"),
    SAMPLE_COLLECTION_SCHEDULED("Sample Collection Scheduled"),
    SAMPLE_COLLECTED("Sample Collected"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String displayName;

    OrderStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}

