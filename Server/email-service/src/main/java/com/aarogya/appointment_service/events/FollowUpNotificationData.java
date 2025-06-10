package com.aarogya.appointment_service.events;


import com.aarogya.appointment_service.events.enums.FollowUpStatus;

import java.time.LocalDate;


public class FollowUpNotificationData {
    private String followUpId;
    private String originalAppointmentId;
    private String doctorName;
    private String patientName;
    private LocalDate recommendedDate;
    private FollowUpStatus status;
    private String reason;
    private String notes;
    private Integer urgencyLevel;

    public FollowUpNotificationData() {
    }

    public FollowUpNotificationData(String followUpId, String originalAppointmentId, String doctorName, String patientName, LocalDate recommendedDate, FollowUpStatus status, String reason, String notes, Integer urgencyLevel) {
        this.followUpId = followUpId;
        this.originalAppointmentId = originalAppointmentId;
        this.doctorName = doctorName;
        this.patientName = patientName;
        this.recommendedDate = recommendedDate;
        this.status = status;
        this.reason = reason;
        this.notes = notes;
        this.urgencyLevel = urgencyLevel;
    }

    public String getFollowUpId() {
        return followUpId;
    }

    public void setFollowUpId(String followUpId) {
        this.followUpId = followUpId;
    }

    public String getOriginalAppointmentId() {
        return originalAppointmentId;
    }

    public void setOriginalAppointmentId(String originalAppointmentId) {
        this.originalAppointmentId = originalAppointmentId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public LocalDate getRecommendedDate() {
        return recommendedDate;
    }

    public void setRecommendedDate(LocalDate recommendedDate) {
        this.recommendedDate = recommendedDate;
    }

    public FollowUpStatus getStatus() {
        return status;
    }

    public void setStatus(FollowUpStatus status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Integer getUrgencyLevel() {
        return urgencyLevel;
    }

    public void setUrgencyLevel(Integer urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }
}
