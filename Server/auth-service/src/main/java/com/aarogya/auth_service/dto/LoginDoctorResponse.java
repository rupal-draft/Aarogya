package com.aarogya.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDoctorResponse {

    private String token;
    private DoctorResponseDTO doctor;
}
