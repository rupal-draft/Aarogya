package com.aarogya.article_service.auth;

public class UserContext {
    private String userId;
    private String role;

    public UserContext(String userId, String role) {
        this.userId = userId;
        this.role = role;
    }

    public String getUserId() {
        return userId;
    }

    public String getRole() {
        return role;
    }
}
