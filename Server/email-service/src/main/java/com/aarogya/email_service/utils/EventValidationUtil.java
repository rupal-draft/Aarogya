package com.aarogya.email_service.utils;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.AppointmentEventValidationException;
import com.aarogya.email_service.exceptions.EmailValidationException;
import com.aarogya.email_service.exceptions.OtpExpiredException;
import com.aarogya.email_service.exceptions.OtpValidationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class EventValidationUtil {

    public void validateOtpEvent(SendOtpEvent event) {
        if (event.getEmail() == null || event.getEmail().trim().isEmpty()) {
            throw new EmailValidationException("email", event.getEmail());
        }
        if (event.getOtp() == null || event.getOtp().trim().isEmpty()) {
            throw new OtpValidationException("OTP cannot be null or empty", event.getOtp(), event.getEmail());
        }
        if (event.getRecipientName() == null || event.getRecipientName().trim().isEmpty()) {
            throw new EmailValidationException("recipientName", event.getRecipientName());
        }

        if (event.getGeneratedAt() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (event.getGeneratedAt().plusMinutes(10).isBefore(now)) {
                throw new OtpExpiredException(event.getGeneratedAt(), now);
            }
        }
    }

    public void validateAppointmentEvent(AppointmentConfirmationEvent event) {
        if (event == null) {
            throw new AppointmentEventValidationException(null, "Appointment event cannot be null");
        }

        // Validate appointment details
        if (event.getAppointmentId() == null || event.getAppointmentId().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Appointment ID cannot be null or empty");
        }

        if (event.getAppointmentDate() == null) {
            throw new AppointmentEventValidationException(event, "Appointment date cannot be null");
        }

        if (event.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new AppointmentEventValidationException(event,
                    "Appointment date cannot be in the past: " + event.getAppointmentDate());
        }

        if (event.getStartTime() == null || event.getEndTime() == null) {
            throw new AppointmentEventValidationException(event, "Appointment start time and end time cannot be null");
        }

        if (event.getEndTime().isBefore(event.getStartTime())) {
            throw new AppointmentEventValidationException(event,
                    "Appointment end time cannot be before start time");
        }

        if (event.getType() == null) {
            throw new AppointmentEventValidationException(event, "Appointment type cannot be null");
        }

        if (event.getStatus() == null) {
            throw new AppointmentEventValidationException(event, "Appointment status cannot be null");
        }

        // Validate virtual appointment specific fields
        if (Boolean.TRUE.equals(event.getIsVirtual()) &&
                (event.getMeetingLink() == null || event.getMeetingLink().trim().isEmpty())) {
            throw new AppointmentEventValidationException(event,
                    "Meeting link is required for virtual appointments");
        }

        // Validate consultation fee
        if (event.getConsultationFee() == null || event.getConsultationFee() < 0) {
            throw new AppointmentEventValidationException(event,
                    "Consultation fee cannot be null or negative");
        }

        if (event.getCurrency() == null || event.getCurrency().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Currency cannot be null or empty");
        }

        // Validate doctor information
        validateDoctorInfo(event);

        // Validate patient information
        validatePatientInfo(event);
    }

    private void validateDoctorInfo(AppointmentConfirmationEvent event) {
        if (event.getDoctorId() == null || event.getDoctorId().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Doctor ID cannot be null or empty");
        }

        if (event.getDoctorName() == null || event.getDoctorName().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Doctor name cannot be null or empty");
        }

        if (event.getDoctorEmail() == null || event.getDoctorEmail().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Doctor email cannot be null or empty");
        }

        if (isValidEmail(event.getDoctorEmail())) {
            throw new AppointmentEventValidationException(event, "Invalid doctor email format: " + event.getDoctorEmail());
        }
    }

    private void validatePatientInfo(AppointmentConfirmationEvent event) {
        if (event.getPatientId() == null || event.getPatientId().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Patient ID cannot be null or empty");
        }

        if (event.getPatientName() == null || event.getPatientName().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Patient name cannot be null or empty");
        }

        if (event.getPatientEmail() == null || event.getPatientEmail().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Patient email cannot be null or empty");
        }

        if (isValidEmail(event.getPatientEmail())) {
            throw new AppointmentEventValidationException(event, "Invalid patient email format: " + event.getPatientEmail());
        }

        if (event.getPatientGender() == null || event.getPatientGender().trim().isEmpty()) {
            throw new AppointmentEventValidationException(event, "Patient gender cannot be null or empty");
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null) return true;
        String emailRegex = "^[A-Za-z0-9+_.-]+@(.+)$";
        return !email.matches(emailRegex);
    }
}
