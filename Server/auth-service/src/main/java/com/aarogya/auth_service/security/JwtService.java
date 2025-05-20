package com.aarogya.auth_service.security;

import com.aarogya.auth_service.documents.Doctor;
import com.aarogya.auth_service.documents.Patient;
import com.aarogya.auth_service.documents.enums.Role;
import com.aarogya.auth_service.exceptions.IllegalState;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secretKey}")
    private String secretKey;

    private SecretKey getSecretKey() {
        if (secretKey == null || secretKey.length() < 32) {
            throw new IllegalState("Secret key must be at least 32 characters long for HS256:"+secretKey.length()+secretKey);
        }
        return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
    }

    public String getPatientAccessJwtToken(Patient patient){
        return Jwts
                .builder()
                .subject(String.valueOf(patient.getId()))
                .claim("email",patient.getEmail())
                .claim("role", Role.PATIENT)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 1))
                .signWith(getSecretKey())
                .compact();
    }

    public String getDoctorAccessJwtToken(Doctor doctor){
        return Jwts
                .builder()
                .subject(String.valueOf(doctor.getId()))
                .claim("email",doctor.getEmail())
                .claim("licenseNumber",doctor.getLicenseNumber())
                .claim("role", Role.DOCTOR)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24 * 1))
                .signWith(getSecretKey())
                .compact();
    }
}