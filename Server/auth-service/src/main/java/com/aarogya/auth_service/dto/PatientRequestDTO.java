package com.aarogya.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRequestDTO {

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotNull
    private LocalDate dateOfBirth;

    @Pattern(regexp = "^(Male|Female|Other)?$", message = "Gender must be Male, Female, or Other")
    private String gender;

    @Pattern(regexp = "^(A|B|AB|O)[+-]?$", message = "Invalid blood group")
    private String bloodGroup;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Invalid phone number")
    private String phone;

    private String address;
    private String imageUrl;

    private String emergencyContact;

    @Pattern(regexp = "\\+?[0-9]{7,15}", message = "Invalid emergency phone number")
    private String emergencyPhone;
}
