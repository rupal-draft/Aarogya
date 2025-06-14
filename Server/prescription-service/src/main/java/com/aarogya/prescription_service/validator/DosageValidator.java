package com.aarogya.prescription_service.validator;

import com.aarogya.prescription_service.exceptions.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class DosageValidator {

    private static final Pattern DOSAGE_PATTERN = Pattern.compile(
            "^\\d+(\\.\\d+)?\\s*(mg|g|ml|mcg|iu|tablet|capsule|drop|spray|patch|injection)s?$",
            Pattern.CASE_INSENSITIVE
    );

    private static final Pattern STRENGTH_PATTERN = Pattern.compile(
            "^\\d+(\\.\\d+)?\\s*(mg|g|ml|mcg|iu)(/\\d+(\\.\\d+)?\\s*(mg|g|ml|mcg|iu))?$",
            Pattern.CASE_INSENSITIVE
    );

    public void validateDosage(String dosage) {
        if (dosage == null || dosage.trim().isEmpty()) {
            throw new BadRequestException("Dosage is required");
        }

        String trimmedDosage = dosage.trim();

        if (!DOSAGE_PATTERN.matcher(trimmedDosage).matches()) {
            throw new BadRequestException("Invalid dosage format. Expected format: '500mg', '1 tablet', '5ml', etc.");
        }

        String numericPart = trimmedDosage.replaceAll("[^\\d.]", "");
        try {
            double value = Double.parseDouble(numericPart);
            if (value <= 0) {
                throw new BadRequestException("Dosage value must be positive");
            }
            if (value > 10000) {
                throw new BadRequestException("Dosage value seems too high. Please verify.");
            }
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid numeric value in dosage");
        }
    }

    public void validateStrength(String strength) {
        if (strength == null || strength.trim().isEmpty()) {
            return;
        }

        String trimmedStrength = strength.trim();

        if (!STRENGTH_PATTERN.matcher(trimmedStrength).matches()) {
            throw new BadRequestException("Invalid strength format. Expected format: '500mg', '250mg/5ml', etc.");
        }
    }

    public void validateFrequency(String frequency) {
        if (frequency == null || frequency.trim().isEmpty()) {
            throw new BadRequestException("Frequency is required");
        }

        String lowerFreq = frequency.toLowerCase().trim();

        String[] validPatterns = {
                "once daily", "twice daily", "three times daily", "four times daily",
                "every \\d+ hours?", "every \\d+ minutes?",
                "\\d+ times? daily", "\\d+ times? per day",
                "as needed", "as required", "prn",
                "before meals?", "after meals?", "with meals?",
                "at bedtime", "in the morning", "in the evening",
                "on empty stomach"
        };

        boolean isValid = false;
        for (String pattern : validPatterns) {
            if (lowerFreq.matches(".*" + pattern + ".*")) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new BadRequestException("Invalid frequency format. Use standard medical frequency terms.");
        }
    }

    public void validateDuration(String duration) {
        if (duration == null || duration.trim().isEmpty()) {
            throw new BadRequestException("Duration is required");
        }

        String lowerDuration = duration.toLowerCase().trim();

        if (!lowerDuration.matches("\\d+\\s*(day|days|week|weeks|month|months|year|years)")) {
            throw new BadRequestException("Invalid duration format. Expected format: '7 days', '2 weeks', '1 month', etc.");
        }

        String numericPart = lowerDuration.replaceAll("[^\\d]", "");
        try {
            int value = Integer.parseInt(numericPart);
            if (value <= 0) {
                throw new BadRequestException("Duration value must be positive");
            }

            if (lowerDuration.contains("day") && value > 365) {
                throw new BadRequestException("Duration in days cannot exceed 365");
            }
            if (lowerDuration.contains("week") && value > 52) {
                throw new BadRequestException("Duration in weeks cannot exceed 52");
            }
            if (lowerDuration.contains("month") && value > 12) {
                throw new BadRequestException("Duration in months cannot exceed 12");
            }
            if (lowerDuration.contains("year") && value > 5) {
                throw new BadRequestException("Duration in years cannot exceed 5");
            }
        } catch (NumberFormatException e) {
            throw new BadRequestException("Invalid numeric value in duration");
        }
    }

    public void validateRoute(String route) {
        if (route == null || route.trim().isEmpty()) {
            return; // Route is optional
        }

        String lowerRoute = route.toLowerCase().trim();

        String[] validRoutes = {
                "oral", "sublingual", "buccal",
                "topical", "transdermal",
                "intravenous", "intramuscular", "subcutaneous", "intradermal",
                "inhalation", "nasal",
                "rectal", "vaginal",
                "ophthalmic", "otic",
                "injection"
        };

        boolean isValid = false;
        for (String validRoute : validRoutes) {
            if (lowerRoute.contains(validRoute)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new BadRequestException("Invalid route of administration: " + route);
        }
    }

    public void validateInstructions(String instructions) {
        if (instructions != null && instructions.length() > 1000) {
            throw new BadRequestException("Instructions cannot exceed 1000 characters");
        }
    }
}

