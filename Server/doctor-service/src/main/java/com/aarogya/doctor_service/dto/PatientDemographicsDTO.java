package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientDemographicsDTO {
    private String gender;
    private Integer count;
    private Integer avgAge;
}
