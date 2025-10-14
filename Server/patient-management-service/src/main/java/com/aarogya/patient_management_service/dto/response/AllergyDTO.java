package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@JsonIgnoreProperties(ignoreUnknown = true)
public class AllergyDTO {
    private String id;
    private String allergen;
    private String allergyType;
    private String severity;
    private LocalDate diagnosedDate;
    private String reaction;
    private String emergencyAction;
    private Boolean isActive;
}
