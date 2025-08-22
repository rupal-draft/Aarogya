package com.aarogya.lab_service.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum TestStatus {
    ORDERED("Ordered"),
    SAMPLE_COLLECTED("Sample Collected"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String displayName;

    TestStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }
}

