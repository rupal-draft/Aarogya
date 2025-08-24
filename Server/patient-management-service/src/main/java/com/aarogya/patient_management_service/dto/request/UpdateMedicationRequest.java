package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMedicationRequest {

    private String medicationName;

    @DecimalMin(value = "0.0", inclusive = false, message = "Dosage must be greater than 0")
    private BigDecimal dosage;

    private String dosageUnit;

    private String frequency;

    private String route;

    private LocalDate startDate;

    private LocalDate endDate;

    @Pattern(regexp = "ACTIVE|COMPLETED|DISCONTINUED|PAUSED",
            message = "Status must be ACTIVE, COMPLETED, DISCONTINUED, or PAUSED")
    private String status;

    private String prescribedBy;

    private String notes;

    private String sideEffects;

    private String instructions;

    private String reason;

    private Boolean reminderEnabled;

    public void setMedicationName(String medicationName) {
        this.medicationName = medicationName != null ? medicationName.trim() : this.medicationName;
    }

    public void setDosageUnit(String dosageUnit) {
        this.dosageUnit = dosageUnit != null ? dosageUnit.trim() : this.dosageUnit;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency != null ? frequency.trim() : this.frequency;
    }

    public void setRoute(String route) {
        this.route = route != null ? route.trim() : this.route;
    }

    public void setStatus(String status) {
        this.status = status != null ? status.toUpperCase().trim() : this.status;
    }

    public void setPrescribedBy(String prescribedBy) {
        this.prescribedBy = prescribedBy != null ? prescribedBy.trim() : this.prescribedBy;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes.trim() : this.notes;
    }

    public void setSideEffects(String sideEffects) {
        this.sideEffects = sideEffects != null ? sideEffects.trim() : this.sideEffects;
    }

    public void setReminderEnabled(Boolean reminderEnabled) {
        this.reminderEnabled = reminderEnabled != null ? reminderEnabled : this.reminderEnabled;
    }
}
