package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmergencyContactRequest {

    private String contactName;
    private String relationship;
    private String phoneNumber;

    private String secondaryPhone;

    private String notes;

    @Email(message = "Invalid email format")
    private String email;

    private String address;
    private Boolean isPrimary;
    private Boolean isActive;
}