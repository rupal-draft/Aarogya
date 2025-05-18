package com.aarogya.auth_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginPatientResponse {

    private String token;
    private PatientResponseDTO patient;
}
