package com.aarogya.prescription_service.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class PrescriptionUtil {

    private static final String PRESCRIPTION_PREFIX = "RX";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Random random = new Random();

    public String generatePrescriptionNumber() {
        String datePart = LocalDate.now().format(DATE_FORMAT);
        String randomPart = String.format("%06d", random.nextInt(1000000));
        return PRESCRIPTION_PREFIX + datePart + randomPart;
    }

    public boolean isValidPrescriptionNumber(String prescriptionNumber) {
        if (prescriptionNumber == null || prescriptionNumber.length() != 16) {
            return false;
        }

        return prescriptionNumber.startsWith(PRESCRIPTION_PREFIX) &&
                prescriptionNumber.substring(2, 10).matches("\\d{8}") &&
                prescriptionNumber.substring(10).matches("\\d{6}");
    }

    public String calculateAge(LocalDate birthDate) {
        if (birthDate == null) {
            return "Unknown";
        }

        int age = LocalDate.now().getYear() - birthDate.getYear();
        if (LocalDate.now().getDayOfYear() < birthDate.getDayOfYear()) {
            age--;
        }

        return String.valueOf(age);
    }

    public boolean isPrescriptionExpired(LocalDateTime validUntil) {
        return validUntil != null && validUntil.isBefore(LocalDateTime.now());
    }

    public boolean isPrescriptionExpiringSoon(LocalDateTime validUntil, int daysThreshold) {
        if (validUntil == null) {
            return false;
        }

        LocalDateTime threshold = LocalDateTime.now().plusDays(daysThreshold);
        return validUntil.isBefore(threshold) && validUntil.isAfter(LocalDateTime.now());
    }

    public String formatPrescriptionForPrint(String prescriptionNumber, String doctorName, String patientName) {
        return String.format("Prescription #%s\nDoctor: %s\nPatient: %s\nDate: %s",
                prescriptionNumber, doctorName, patientName, LocalDate.now().format(DATE_FORMAT));
    }

    public double calculateGrowthRate(Number oldValue, Number newValue) {
        if (oldValue == null || newValue == null || oldValue.doubleValue() == 0) {
            return 0.0;
        }

        return ((newValue.doubleValue() - oldValue.doubleValue()) / oldValue.doubleValue()) * 100;
    }
}
