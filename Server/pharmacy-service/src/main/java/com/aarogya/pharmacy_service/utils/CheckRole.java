package com.aarogya.pharmacy_service.utils;

import com.aarogya.pharmacy_service.exceptions.AccessForbidden;

public class CheckRole {

    public static void checkRole(String role, String expectedRole) {
        if(!role.equalsIgnoreCase(expectedRole)) {
            throw new AccessForbidden("Access Forbidden");
        }
    }
}
