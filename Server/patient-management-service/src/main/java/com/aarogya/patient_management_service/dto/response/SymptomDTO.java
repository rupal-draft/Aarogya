package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SymptomDTO {
    private String id;
    private String symptomName;
    private Integer severity;
    private String description;
    private String duration;
    private String frequency;
    private LocalDateTime recordedAt;
}
