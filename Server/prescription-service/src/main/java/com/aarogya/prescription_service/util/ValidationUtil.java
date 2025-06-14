package com.aarogya.prescription_service.util;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class ValidationUtil {

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    );

    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^[+]?[1-9]\\d{1,14}$"
    );

    private static final Pattern MEDICINE_CODE_PATTERN = Pattern.compile(
            "^[A-Z0-9]{6,12}$"
    );

    public boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    public boolean isValidPhoneNumber(String phoneNumber) {
        return phoneNumber != null && PHONE_PATTERN.matcher(phoneNumber).matches();
    }

    public boolean isValidMedicineCode(String medicineCode) {
        return medicineCode != null && MEDICINE_CODE_PATTERN.matcher(medicineCode).matches();
    }

    public boolean isNotEmpty(String value) {
        return value != null && !value.trim().isEmpty();
    }

    public boolean isPositive(Number value) {
        return value != null && value.doubleValue() > 0;
    }

    public boolean isNonNegative(Number value) {
        return value != null && value.doubleValue() >= 0;
    }

    public boolean isWithinRange(Number value, Number min, Number max) {
        if (value == null || min == null || max == null) {
            return false;
        }
        double val = value.doubleValue();
        return val >= min.doubleValue() && val <= max.doubleValue();
    }

    public boolean isValidDosage(String dosage) {
        if (dosage == null || dosage.trim().isEmpty()) {
            return false;
        }

        return dosage.matches("^\\d+(\\.\\d+)?\\s*(tablet|capsule|ml|mg|g|drop|spray)s?$");
    }

    public boolean isValidFrequency(String frequency) {
        if (frequency == null || frequency.trim().isEmpty()) {
            return false;
        }

        String[] validFrequencies = {
                "once daily", "twice daily", "three times daily", "four times daily",
                "every 4 hours", "every 6 hours", "every 8 hours", "every 12 hours",
                "as needed", "before meals", "after meals", "at bedtime"
        };

        String lowerFreq = frequency.toLowerCase();
        for (String valid : validFrequencies) {
            if (lowerFreq.contains(valid)) {
                return true;
            }
        }

        return false;
    }

    public boolean isValidDuration(String duration) {
        if (duration == null || duration.trim().isEmpty()) {
            return false;
        }
        return duration.matches("^\\d+\\s*(day|week|month)s?$");
    }
}
