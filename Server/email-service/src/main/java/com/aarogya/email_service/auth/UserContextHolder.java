package com.aarogya.email_service.auth;



public class UserContextHolder {

    private static final ThreadLocal<UserContext> userContext = new ThreadLocal<>();

    public static UserContext getUserDetails() {
        return userContext.get();
    }

    static void setUserDetails(String userId, String role, String email) {
        userContext.set(new UserContext(userId, role, email));
    }

    static void clearUserDetails() {
        userContext.remove();
    }
}
