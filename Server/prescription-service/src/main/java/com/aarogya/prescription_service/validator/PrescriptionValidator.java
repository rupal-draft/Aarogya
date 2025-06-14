package com.aarogya.prescription_service.validator;

import com.aarogya.prescription_service.dto.CreatePrescriptionDTO;
import com.aarogya.prescription_service.dto.PrescriptionTemplateDTO;
import com.aarogya.prescription_service.dto.UpdatePrescriptionDTO;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.util.ValidationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class PrescriptionValidator {

    private final ValidationUtil validationUtil;
    private final MedicineValidator medicineValidator;
    private final DosageValidator dosageValidator;

    public void validateCreatePrescription(CreatePrescriptionDTO prescriptionDTO) {
        if (prescriptionDTO == null) {
            throw new BadRequestException("Prescription data cannot be null");
        }

        if (!validationUtil.isNotEmpty(prescriptionDTO.getDiagnosis())) {
            throw new BadRequestException("Diagnosis is required");
        }

        if (prescriptionDTO.getValidUntil() == null) {
            throw new BadRequestException("Valid until date is required");
        }

        if (prescriptionDTO.getValidUntil().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Valid until date cannot be in the past");
        }

        if (prescriptionDTO.getMedicines() == null || prescriptionDTO.getMedicines().isEmpty()) {
            throw new BadRequestException("At least one medicine is required");
        }

        if (prescriptionDTO.getRefillsAllowed() != null && prescriptionDTO.getRefillsAllowed() < 0) {
            throw new BadRequestException("Refills allowed cannot be negative");
        }

        if (prescriptionDTO.getRefillsAllowed() != null && prescriptionDTO.getRefillsAllowed() > 12) {
            throw new BadRequestException("Refills allowed cannot exceed 12");
        }

        prescriptionDTO.getMedicines().forEach(medicineValidator::validatePrescriptionMedicine);
    }

    public void validateUpdatePrescription(UpdatePrescriptionDTO prescriptionDTO) {
        if (prescriptionDTO == null) {
            throw new BadRequestException("Prescription data cannot be null");
        }

        if (prescriptionDTO.getMedicines() != null) {
            prescriptionDTO.getMedicines().forEach(medicineValidator::validatePrescriptionMedicine);
        }
    }

    public void validatePrescriptionTemplate(PrescriptionTemplateDTO templateDTO) {
        if (templateDTO == null) {
            throw new BadRequestException("Template data cannot be null");
        }

        if (!validationUtil.isNotEmpty(templateDTO.getTemplateName())) {
            throw new BadRequestException("Template name is required");
        }

        if (templateDTO.getTemplateName().length() > 100) {
            throw new BadRequestException("Template name cannot exceed 100 characters");
        }

        if (!validationUtil.isNotEmpty(templateDTO.getDoctorId())) {
            throw new BadRequestException("Doctor ID is required");
        }

        if (templateDTO.getMedicines() != null) {
            templateDTO.getMedicines().forEach(medicine -> {
                if (!validationUtil.isNotEmpty(medicine.getMedicineName())) {
                    throw new BadRequestException("Medicine name is required in template");
                }
                if (!validationUtil.isNotEmpty(medicine.getDosage())) {
                    throw new BadRequestException("Dosage is required in template");
                }
                if (!validationUtil.isNotEmpty(medicine.getFrequency())) {
                    throw new BadRequestException("Frequency is required in template");
                }
            });
        }
    }

    public void validatePrescriptionId(String prescriptionId) {
        if (!validationUtil.isNotEmpty(prescriptionId)) {
            throw new BadRequestException("Prescription ID is required");
        }
    }

    public void validateDoctorId(String doctorId) {
        if (!validationUtil.isNotEmpty(doctorId)) {
            throw new BadRequestException("Doctor ID is required");
        }
    }

    public void validatePatientId(String patientId) {
        if (!validationUtil.isNotEmpty(patientId)) {
            throw new BadRequestException("Patient ID is required");
        }
    }
}
