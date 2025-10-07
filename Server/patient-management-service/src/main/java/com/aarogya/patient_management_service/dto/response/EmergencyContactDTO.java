package com.aarogya.patient_management_service.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmergencyContactDTO {
    private String id;
    private String contactName;
    private String relationship;
    private String phoneNumber;
    private String secondaryPhone;
    private String email;
    private String address;
    private Boolean isPrimary;
}