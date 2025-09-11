package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActiveMedicationDTO {
    private String id;
    private String medicationName;
    private BigDecimal dosage;
    private String dosageUnit;
    private String frequency;
    private String route;
    private LocalDate startDate;
    private LocalDate endDate;
    private String prescribedBy;
    private String status;
    private Boolean reminderEnabled;
    private String instructions;
}
