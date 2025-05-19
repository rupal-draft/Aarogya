package com.aarogya.email_service.service;

import com.aarogya.auth_service.events.SendOtpEvent;

public interface EmailService {

    void sendOtp(SendOtpEvent event);
}
