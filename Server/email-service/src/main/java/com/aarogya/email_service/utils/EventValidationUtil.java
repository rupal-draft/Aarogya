package com.aarogya.email_service.utils;

import com.aarogya.appointment_service.events.AppointmentConfirmationEvent;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.email_service.exceptions.EventProcessingException;
import com.aarogya.email_service.exceptions.EventValidationException;
import com.aarogya.lab_service.events.LabOrderConfirmationEvent;
import com.aarogya.lab_service.events.LabResultCreatedEvent;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class EventValidationUtil {

    public void validateOtpEvent(SendOtpEvent event) {
        String eventType = "SEND_OTP";
        String eventId = event.getEmail();
        if (event.getEmail() == null || event.getEmail().trim().isEmpty()) {
            throw new EventValidationException(
                    "Email cannot be null or empty",
                    eventType, eventId, "email", event.getEmail()
            );
        }

        if (isValidEmail(event.getEmail())) {
            throw new EventValidationException(
                    "Invalid email format",
                    eventType, eventId, "email", event.getEmail()
            );
        }

        if (event.getOtp() == null || event.getOtp().trim().isEmpty()) {
            throw new EventValidationException(
                    "OTP cannot be null or empty",
                    eventType, eventId, "otp", event.getOtp()
            );
        }

        if (event.getRecipientName() == null || event.getRecipientName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Recipient name cannot be null or empty",
                    eventType, eventId, "recipientName", event.getRecipientName()
            );
        }

        // OTP expiration validation
        if (event.getGeneratedAt() != null) {
            LocalDateTime now = LocalDateTime.now();
            if (event.getGeneratedAt().plusMinutes(10).isBefore(now)) {
                throw new EventProcessingException(
                        "OTP has expired",
                        "OTP_EXPIRED_001", eventType, eventId
                );
            }
        }
    }

    public void validateAppointmentEvent(AppointmentConfirmationEvent event) {
        String eventType = "APPOINTMENT_CONFIRMATION";
        String eventId = event.getAppointmentId();

        // Validate appointment details
        if (event.getAppointmentId() == null || event.getAppointmentId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Appointment ID cannot be null or empty",
                    eventType, eventId, "appointmentId", event.getAppointmentId()
            );
        }

        if (event.getAppointmentDate() == null) {
            throw new EventValidationException(
                    "Appointment date cannot be null",
                    eventType, eventId, "appointmentDate", null
            );
        }

        if (event.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new EventValidationException(
                    "Appointment date cannot be in the past",
                    eventType, eventId, "appointmentDate", event.getAppointmentDate()
            );
        }

        if (event.getStartTime() == null || event.getEndTime() == null) {
            throw new EventValidationException(
                    "Appointment start time and end time cannot be null",
                    eventType, eventId, "time", null
            );
        }

        if (event.getEndTime().isBefore(event.getStartTime())) {
            throw new EventValidationException(
                    "Appointment end time cannot be before start time",
                    eventType, eventId, "endTime", event.getEndTime()
            );
        }

        if (event.getType() == null) {
            throw new EventValidationException(
                    "Appointment type cannot be null",
                    eventType, eventId, "type", null
            );
        }

        if (event.getStatus() == null) {
            throw new EventValidationException(
                    "Appointment status cannot be null",
                    eventType, eventId, "status", null
            );
        }

        // Validate virtual appointment specific fields
        if (Boolean.TRUE.equals(event.getIsVirtual()) &&
                (event.getMeetingLink() == null || event.getMeetingLink().trim().isEmpty())) {
            throw new EventValidationException(
                    "Meeting link is required for virtual appointments",
                    eventType, eventId, "meetingLink", event.getMeetingLink()
            );
        }

        // Validate consultation fee
        if (event.getConsultationFee() == null || event.getConsultationFee() < 0) {
            throw new EventValidationException(
                    "Consultation fee cannot be null or negative",
                    eventType, eventId, "consultationFee", event.getConsultationFee()
            );
        }

        if (event.getCurrency() == null || event.getCurrency().trim().isEmpty()) {
            throw new EventValidationException(
                    "Currency cannot be null or empty",
                    eventType, eventId, "currency", event.getCurrency()
            );
        }

        // Validate doctor information
        validateDoctorInfo(event, eventType, eventId);

        // Validate patient information
        validatePatientInfo(event, eventType, eventId);
    }

    public void validateLabOrderEvent(LabOrderConfirmationEvent event) {
        String eventType = "LAB_ORDER_CONFIRMATION";
        String eventId = event.getOrderId();

        // Validate order details
        if (event.getOrderId() == null || event.getOrderId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Order ID cannot be null or empty",
                    eventType, eventId, "orderId", event.getOrderId()
            );
        }

        if (event.getOrderNumber() == null || event.getOrderNumber().trim().isEmpty()) {
            throw new EventValidationException(
                    "Order number cannot be null or empty",
                    eventType, eventId, "orderNumber", event.getOrderNumber()
            );
        }

        // Validate patient information
        if (event.getPatientId() == null || event.getPatientId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient ID cannot be null or empty",
                    eventType, eventId, "patientId", event.getPatientId()
            );
        }

        if (event.getPatientName() == null || event.getPatientName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient name cannot be null or empty",
                    eventType, eventId, "patientName", event.getPatientName()
            );
        }

        if (event.getPatientEmail() == null || event.getPatientEmail().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient email cannot be null or empty",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        if (isValidEmail(event.getPatientEmail())) {
            throw new EventValidationException(
                    "Invalid patient email format",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        // Validate doctor information
        if (event.getDoctorId() == null || event.getDoctorId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Doctor ID cannot be null or empty",
                    eventType, eventId, "doctorId", event.getDoctorId()
            );
        }

        if (event.getDoctorName() == null || event.getDoctorName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Doctor name cannot be null or empty",
                    eventType, eventId, "doctorName", event.getDoctorName()
            );
        }

        if (event.getDoctorEmail() != null && !event.getDoctorEmail().trim().isEmpty() &&
                isValidEmail(event.getDoctorEmail())) {
            throw new EventValidationException(
                    "Invalid doctor email format",
                    eventType, eventId, "doctorEmail", event.getDoctorEmail()
            );
        }

        // Validate tests
        if (event.getTests() == null || event.getTests().isEmpty()) {
            throw new EventValidationException(
                    "Tests list cannot be null or empty",
                    eventType, eventId, "tests", event.getTests()
            );
        }

        // Validate each test item
        for (int i = 0; i < event.getTests().size(); i++) {
            LabOrderConfirmationEvent.TestItem test = event.getTests().get(i);
            if (test.getTestId() == null || test.getTestId().trim().isEmpty()) {
                throw new EventValidationException(
                        "Test ID cannot be null or empty for test at index " + i,
                        eventType, eventId, "tests[" + i + "].testId", test.getTestId()
                );
            }
            if (test.getTestName() == null || test.getTestName().trim().isEmpty()) {
                throw new EventValidationException(
                        "Test name cannot be null or empty for test at index " + i,
                        eventType, eventId, "tests[" + i + "].testName", test.getTestName()
                );
            }
            if (test.getPrice() == null || test.getPrice().compareTo(BigDecimal.ZERO) < 0) {
                throw new EventValidationException(
                        "Test price cannot be null or negative for test at index " + i,
                        eventType, eventId, "tests[" + i + "].price", test.getPrice()
                );
            }
        }

        // Validate financial information
        if (event.getTotalAmount() == null || event.getTotalAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new EventValidationException(
                    "Total amount cannot be null or negative",
                    eventType, eventId, "totalAmount", event.getTotalAmount()
            );
        }

        if (event.getScheduledDateTime() == null) {
            throw new EventValidationException(
                    "Scheduled date time cannot be null",
                    eventType, eventId, "scheduledDateTime", null
            );
        }

        if (event.getScheduledDateTime().isBefore(LocalDateTime.now())) {
            throw new EventValidationException(
                    "Scheduled date time cannot be in the past",
                    eventType, eventId, "scheduledDateTime", event.getScheduledDateTime()
            );
        }

        if (event.getLocation() == null || event.getLocation().trim().isEmpty()) {
            throw new EventValidationException(
                    "Location cannot be null or empty",
                    eventType, eventId, "location", event.getLocation()
            );
        }

        if (event.getOrderStatus() == null || event.getOrderStatus().trim().isEmpty()) {
            throw new EventValidationException(
                    "Order status cannot be null or empty",
                    eventType, eventId, "orderStatus", event.getOrderStatus()
            );
        }

        if (event.getPaymentStatus() == null || event.getPaymentStatus().trim().isEmpty()) {
            throw new EventValidationException(
                    "Payment status cannot be null or empty",
                    eventType, eventId, "paymentStatus", event.getPaymentStatus()
            );
        }
    }

    public void validateLabResultEvent(LabResultCreatedEvent event) {
        String eventType = "LAB_RESULT_CREATED";
        String eventId = event.getResultId();

        // Validate result details
        if (event.getResultId() == null || event.getResultId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Result ID cannot be null or empty",
                    eventType, eventId, "resultId", event.getResultId()
            );
        }

        if (event.getOrderId() == null || event.getOrderId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Order ID cannot be null or empty",
                    eventType, eventId, "orderId", event.getOrderId()
            );
        }

        if (event.getOrderNumber() == null || event.getOrderNumber().trim().isEmpty()) {
            throw new EventValidationException(
                    "Order number cannot be null or empty",
                    eventType, eventId, "orderNumber", event.getOrderNumber()
            );
        }

        // Validate patient information
        if (event.getPatientId() == null || event.getPatientId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient ID cannot be null or empty",
                    eventType, eventId, "patientId", event.getPatientId()
            );
        }

        if (event.getPatientName() == null || event.getPatientName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient name cannot be null or empty",
                    eventType, eventId, "patientName", event.getPatientName()
            );
        }

        if (event.getPatientEmail() == null || event.getPatientEmail().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient email cannot be null or empty",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        if (isValidEmail(event.getPatientEmail())) {
            throw new EventValidationException(
                    "Invalid patient email format",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        // Validate test information
        if (event.getTestId() == null || event.getTestId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Test ID cannot be null or empty",
                    eventType, eventId, "testId", event.getTestId()
            );
        }

        if (event.getTestName() == null || event.getTestName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Test name cannot be null or empty",
                    eventType, eventId, "testName", event.getTestName()
            );
        }

        // Validate result parameters
        if (event.getParameters() == null || event.getParameters().isEmpty()) {
            throw new EventValidationException(
                    "Result parameters cannot be null or empty",
                    eventType, eventId, "parameters", event.getParameters()
            );
        }

        // Validate each result parameter
        for (int i = 0; i < event.getParameters().size(); i++) {
            LabResultCreatedEvent.ResultParameter param = event.getParameters().get(i);
            if (param.getParameterName() == null || param.getParameterName().trim().isEmpty()) {
                throw new EventValidationException(
                        "Parameter name cannot be null or empty for parameter at index " + i,
                        eventType, eventId, "parameters[" + i + "].parameterName", param.getParameterName()
                );
            }
            if (param.getValue() == null || param.getValue().trim().isEmpty()) {
                throw new EventValidationException(
                        "Parameter value cannot be null or empty for parameter at index " + i,
                        eventType, eventId, "parameters[" + i + "].value", param.getValue()
                );
            }
        }

        if (event.getOverallResult() == null || event.getOverallResult().trim().isEmpty()) {
            throw new EventValidationException(
                    "Overall result cannot be null or empty",
                    eventType, eventId, "overallResult", event.getOverallResult()
            );
        }

        if (event.getResultGeneratedAt() == null) {
            throw new EventValidationException(
                    "Result generated at cannot be null",
                    eventType, eventId, "resultGeneratedAt", null
            );
        }

        if (event.getResultGeneratedAt().isAfter(LocalDateTime.now())) {
            throw new EventValidationException(
                    "Result generated at cannot be in the future",
                    eventType, eventId, "resultGeneratedAt", event.getResultGeneratedAt()
            );
        }

        // Validate report URL if provided
        if (event.getReportUrl() != null && !event.getReportUrl().trim().isEmpty()) {
            if (!isValidUrl(event.getReportUrl())) {
                throw new EventValidationException(
                        "Invalid report URL format",
                        eventType, eventId, "reportUrl", event.getReportUrl()
                );
            }
        }
    }

    private void validateDoctorInfo(AppointmentConfirmationEvent event, String eventType, String eventId) {
        if (event.getDoctorId() == null || event.getDoctorId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Doctor ID cannot be null or empty",
                    eventType, eventId, "doctorId", event.getDoctorId()
            );
        }

        if (event.getDoctorName() == null || event.getDoctorName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Doctor name cannot be null or empty",
                    eventType, eventId, "doctorName", event.getDoctorName()
            );
        }

        if (event.getDoctorEmail() == null || event.getDoctorEmail().trim().isEmpty()) {
            throw new EventValidationException(
                    "Doctor email cannot be null or empty",
                    eventType, eventId, "doctorEmail", event.getDoctorEmail()
            );
        }

        if (isValidEmail(event.getDoctorEmail())) {
            throw new EventValidationException(
                    "Invalid doctor email format",
                    eventType, eventId, "doctorEmail", event.getDoctorEmail()
            );
        }
    }

    private void validatePatientInfo(AppointmentConfirmationEvent event, String eventType, String eventId) {
        if (event.getPatientId() == null || event.getPatientId().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient ID cannot be null or empty",
                    eventType, eventId, "patientId", event.getPatientId()
            );
        }

        if (event.getPatientName() == null || event.getPatientName().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient name cannot be null or empty",
                    eventType, eventId, "patientName", event.getPatientName()
            );
        }

        if (event.getPatientEmail() == null || event.getPatientEmail().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient email cannot be null or empty",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        if (isValidEmail(event.getPatientEmail())) {
            throw new EventValidationException(
                    "Invalid patient email format",
                    eventType, eventId, "patientEmail", event.getPatientEmail()
            );
        }

        if (event.getPatientGender() == null || event.getPatientGender().trim().isEmpty()) {
            throw new EventValidationException(
                    "Patient gender cannot be null or empty",
                    eventType, eventId, "patientGender", event.getPatientGender()
            );
        }
    }

    private boolean isValidEmail(String email) {
        if (email == null) return true;
        String emailRegex = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$";
        return !email.matches(emailRegex);
    }

    private boolean isValidUrl(String url) {
        if (url == null) return false;
        try {
            new java.net.URL(url);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
