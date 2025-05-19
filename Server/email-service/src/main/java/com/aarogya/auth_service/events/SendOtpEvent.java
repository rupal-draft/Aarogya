package com.aarogya.auth_service.events;


import java.time.LocalDateTime;

public class SendOtpEvent {

    private String email;
    private String role;
    private String subject;
    private String otp;

    private String purpose;

    private LocalDateTime generatedAt;

    private String recipientName;

    public SendOtpEvent(String email, String role, String subject, String otp, String purpose, LocalDateTime generatedAt, String recipientName) {
        this.email = email;
        this.role = role;
        this.subject = subject;
        this.otp = otp;
        this.purpose = purpose;
        this.generatedAt = generatedAt;
        this.recipientName = recipientName;
    }

    public SendOtpEvent() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }
}
