package com.aarogya.prescription_service.validator;

import com.aarogya.prescription_service.dto.PrescriptionMedicineDTO;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class MedicineValidator {

    private final ValidationUtil validationUtil;
    private final DosageValidator dosageValidator;

    public void validatePrescriptionMedicine(PrescriptionMedicineDTO medicineDTO) {
        if (medicineDTO == null) {
            throw new BadRequestException("Medicine data cannot be null");
        }

        if (!validationUtil.isNotEmpty(medicineDTO.getMedicineName())) {
            throw new BadRequestException("Medicine name is required");
        }

        if (medicineDTO.getMedicineName().length() > 200) {
            throw new BadRequestException("Medicine name cannot exceed 200 characters");
        }

        if (!validationUtil.isNotEmpty(medicineDTO.getDosage())) {
            throw new BadRequestException("Dosage is required");
        }

        if (!validationUtil.isNotEmpty(medicineDTO.getFrequency())) {
            throw new BadRequestException("Frequency is required");
        }

        if (!validationUtil.isNotEmpty(medicineDTO.getDuration())) {
            throw new BadRequestException("Duration is required");
        }

        if (medicineDTO.getQuantity() == null || !validationUtil.isPositive(medicineDTO.getQuantity())) {
            throw new BadRequestException("Quantity must be a positive number");
        }

        if (medicineDTO.getQuantity() > 1000) {
            throw new BadRequestException("Quantity cannot exceed 1000");
        }

        dosageValidator.validateDosage(medicineDTO.getDosage());

        if (!validationUtil.isValidFrequency(medicineDTO.getFrequency())) {
            throw new BadRequestException("Invalid frequency format: " + medicineDTO.getFrequency());
        }

        if (!validationUtil.isValidDuration(medicineDTO.getDuration())) {
            throw new BadRequestException("Invalid duration format: " + medicineDTO.getDuration());
        }

        if (medicineDTO.getMedicineCode() != null &&
                !validationUtil.isValidMedicineCode(medicineDTO.getMedicineCode())) {
            throw new BadRequestException("Invalid medicine code format");
        }

        if (medicineDTO.getUnitPrice() != null && !validationUtil.isNonNegative(medicineDTO.getUnitPrice())) {
            throw new BadRequestException("Unit price cannot be negative");
        }

        if (medicineDTO.getTotalPrice() != null && !validationUtil.isNonNegative(medicineDTO.getTotalPrice())) {
            throw new BadRequestException("Total price cannot be negative");
        }
    }

    public void validateMedicineName(String medicineName) {
        if (!validationUtil.isNotEmpty(medicineName)) {
            throw new BadRequestException("Medicine name is required");
        }

        if (medicineName.length() < 2) {
            throw new BadRequestException("Medicine name must be at least 2 characters long");
        }

        if (medicineName.length() > 200) {
            throw new BadRequestException("Medicine name cannot exceed 200 characters");
        }

        if (!medicineName.matches("^[a-zA-Z0-9\\s\\-.\\$]+$")) {
            throw new BadRequestException("Medicine name contains invalid characters");
        }
    }

    public void validateMedicineCode(String medicineCode) {
        if (!validationUtil.isNotEmpty(medicineCode)) {
            throw new BadRequestException("Medicine code is required");
        }

        if (!validationUtil.isValidMedicineCode(medicineCode)) {
            throw new BadRequestException("Invalid medicine code format. Must be 6-12 alphanumeric characters");
        }
    }
}
