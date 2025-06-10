package com.aarogya.prescription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorResponseDTO {

    private String id;

    private String email;
    private String firstName;
    private String lastName;

    private String specialization;
    private String licenseNumber;

    private Integer experienceYears;
    private String phone;
    private String address;

    private String imageUrl;
    private LocalDateTime createdAt;
}
