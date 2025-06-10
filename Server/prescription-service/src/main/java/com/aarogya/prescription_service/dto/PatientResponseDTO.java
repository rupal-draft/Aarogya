package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientResponseDTO {

    private String id;

    private String email;
    private String firstName;
    private String lastName;

    private LocalDate dateOfBirth;
    private String gender;
    private String bloodGroup;

    private String phone;
    private String address;
    private String imageUrl;

    private String emergencyContact;
    private String emergencyPhone;

    private LocalDateTime createdAt;
}
