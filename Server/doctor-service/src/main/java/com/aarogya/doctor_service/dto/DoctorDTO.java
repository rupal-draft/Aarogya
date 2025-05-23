package com.aarogya.doctor_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorDTO {
    private String id;
    private String firstName;
    private String lastName;
    private String specialization;
    private Integer experienceYears;
    private String phone;
    private String address;
    private String imageUrl;
    private String email;
    private LocalDateTime createdAt;
}
