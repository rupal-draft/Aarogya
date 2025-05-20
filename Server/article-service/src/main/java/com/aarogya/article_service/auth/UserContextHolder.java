package com.aarogya.article_service.auth;

public class UserContextHolder {

    private static final ThreadLocal<UserContext> userContext = new ThreadLocal<>();

    public static UserContext getUserDetails() {
        return userContext.get();
    }

    static void setUserDetails(String userId, String role) {
        userContext.set(new UserContext(userId, role));
    }

    static void clearUserDetails() {
        userContext.remove();
    }
}
