package com.aarogya.patient_management_service.auth;

import lombok.Getter;

@Getter
public class UserContext {
    private String userId;
    private String role;

    public UserContext(String userId, String role) {
        this.userId = userId;
        this.role = role;
    }

}
