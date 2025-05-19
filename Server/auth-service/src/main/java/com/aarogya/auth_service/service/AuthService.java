package com.aarogya.auth_service.service;

import com.aarogya.auth_service.dto.*;

import java.util.List;

public interface AuthService {

    DoctorResponseDTO registerDoctor(DoctorRequestDTO doctorRequestDTO);

    LoginDoctorResponse loginDoctor(LoginRequestDto loginRequestDto);

    PatientResponseDTO registerPatient(PatientRequestDTO patientRequestDTO);

    LoginPatientResponse loginPatient(LoginRequestDto loginRequestDto);

    void forgotPassword(ForgotPasswordRequest forgotPasswordRequest);

    void resetPassword(OtpVerificationRequest otpVerificationRequest);

    DoctorResponseDTO getDoctorProfileById(String id);

    PatientResponseDTO getPatientProfileById(String id);

    List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization);

    List<PatientResponseDTO> getPatientsByGender(String gender);
}
