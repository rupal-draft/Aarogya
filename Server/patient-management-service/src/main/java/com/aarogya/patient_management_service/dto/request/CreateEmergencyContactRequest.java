package com.aarogya.patient_management_service.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEmergencyContactRequest {

    @NotBlank(message = "Contact name is required")
    private String contactName;

    @NotBlank(message = "Relationship is required")
    private String relationship;

    @NotBlank(message = "Phone number is required")
    private String phoneNumber;

    private String secondaryPhone;

    @NotBlank(message = "Notes is required")
    private String notes;

    @Email(message = "Invalid email format")
    private String email;

    private String address;

    @Builder.Default
    private Boolean isPrimary = false;
}
