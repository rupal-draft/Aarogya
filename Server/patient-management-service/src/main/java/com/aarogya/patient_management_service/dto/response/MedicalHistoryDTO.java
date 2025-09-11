package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MedicalHistoryDTO {
    private String conditionName;
    private LocalDate diagnosisDate;
    private String status;
    private String severity;
    private String notes;
    private String category;
}
