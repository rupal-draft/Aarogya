package com.aarogya.auth_service.controller;

import com.aarogya.auth_service.advices.ApiError;
import com.aarogya.auth_service.advices.ApiResponse;
import com.aarogya.auth_service.dto.*;
import com.aarogya.auth_service.service.AuthService;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/core")
public class AuthController {

    @Value("${deploy.env}")
    private String deployment;
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/doctor/register")
    @RateLimiter(name = "registerDoctor", fallbackMethod = "rateLimitFallbackDoctorSignup")
    public ResponseEntity<DoctorResponseDTO> registerDoctor(@RequestBody DoctorRequestDTO doctorRequestDTO) {
        return new ResponseEntity<>(authService.registerDoctor(doctorRequestDTO), HttpStatus.CREATED);
    }

    @PostMapping("/patient/register")
    @RateLimiter(name = "registerPatient", fallbackMethod = "rateLimitFallbackPatientSignup")
    public ResponseEntity<PatientResponseDTO> registerPatient(@RequestBody PatientRequestDTO patientRequestDTO) {
        return new ResponseEntity<>(authService.registerPatient(patientRequestDTO), HttpStatus.CREATED);
    }

    @PostMapping("/doctor/login")
    @RateLimiter(name = "loginDoctor", fallbackMethod = "rateLimitFallbackDoctorLogin")
    public ResponseEntity<LoginDoctorResponse> loginDoctor(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse httpServletResponse) {
        LoginDoctorResponse response = authService.loginDoctor(loginRequestDto);
        Cookie cookie = new Cookie("access_token", response.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(deployment.equals("prod"));
        cookie.setMaxAge(60 * 60);
        cookie.setPath("/doctor");
        httpServletResponse.addCookie(cookie);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/patient/login")
    @RateLimiter(name = "loginPatient", fallbackMethod = "rateLimitFallbackPatientLogin")
    public ResponseEntity<LoginPatientResponse> loginPatient(@RequestBody LoginRequestDto loginRequestDto, HttpServletResponse httpServletResponse) {
        LoginPatientResponse response = authService.loginPatient(loginRequestDto);
        Cookie cookie = new Cookie("access_token", response.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(deployment.equals("prod"));
        cookie.setMaxAge(60 * 60);
        cookie.setPath("/patient");
        httpServletResponse.addCookie(cookie);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    @RateLimiter(name = "forgotPassword", fallbackMethod = "rateLimitFallbackForgotPassword")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest) {
        authService.forgotPassword(forgotPasswordRequest);
        return new ResponseEntity<>(ApiResponse.success("Password reset link sent to " + forgotPasswordRequest.getEmail()), HttpStatus.OK);
    }

    @PatchMapping("/reset-password")
    @RateLimiter(name = "resetPassword", fallbackMethod = "rateLimitFallbackResetPassword")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody OtpVerificationRequest otpVerificationRequest) {
        authService.resetPassword(otpVerificationRequest);
        return new ResponseEntity<>(ApiResponse.success("Password reset successfully"), HttpStatus.OK);
    }

    @GetMapping("/doctor/{id}")
    @RateLimiter(name = "getDoctor", fallbackMethod = "rateLimitFallbackFetchDoctor")
    public ResponseEntity<DoctorResponseDTO> getDoctorById(@PathVariable String id) {
        return new ResponseEntity<>(authService.getDoctorProfileById(id), HttpStatus.OK);
    }

    @GetMapping("/patient/{id}")
    @RateLimiter(name = "getPatient", fallbackMethod = "rateLimitFallbackFetchPatient")
    public ResponseEntity<PatientResponseDTO> getPatientById(@PathVariable String id) {
        return new ResponseEntity<>(authService.getPatientProfileById(id), HttpStatus.OK);
    }

    @GetMapping("/doctors")
    @RateLimiter(name = "getDoctors", fallbackMethod = "rateLimitFallbackFetchDoctors")
    public ResponseEntity<List<DoctorResponseDTO>> getDoctorsBySpeciality(@RequestParam String specialization) {
        return new ResponseEntity<>(authService.getDoctorsBySpecialization(specialization), HttpStatus.OK);
    }

    @GetMapping("/patients")
    @RateLimiter(name = "getPatients", fallbackMethod = "rateLimitFallbackFetchPatients")
    public ResponseEntity<List<PatientResponseDTO>> getPatientsByGender(@RequestParam String gender) {
        return new ResponseEntity<>(authService.getPatientsByGender(gender), HttpStatus.OK);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallback(String serviceName, Throwable throwable) {
        ApiError apiError = new ApiError.ApiErrorBuilder()
                .setMessage("Too many requests to " + serviceName + ". Please try again later.")
                .setStatus(HttpStatus.TOO_MANY_REQUESTS)
                .build();
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(ApiResponse.error(apiError));
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackDoctorSignup(DoctorRequestDTO doctorRequestDTO, Throwable throwable) {
        return rateLimitFallback("registerDoctor", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackPatientSignup(PatientRequestDTO patientRequestDTO, Throwable throwable) {
        return rateLimitFallback("registerPatient", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackDoctorLogin(LoginRequestDto loginRequestDto, Throwable throwable) {
        return rateLimitFallback("loginDoctor", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackPatientLogin(LoginRequestDto loginRequestDto, Throwable throwable) {
        return rateLimitFallback("loginPatient", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackFetchDoctor(String id, Throwable throwable) {
        return rateLimitFallback("getDoctorById", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackFetchPatient(String id, Throwable throwable) {
        return rateLimitFallback("getPatientById", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackFetchDoctors(String specialization, Throwable throwable) {
        return rateLimitFallback("getDoctorsBySpeciality", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackFetchPatients(String gender, Throwable throwable) {
        return rateLimitFallback("getPatientsByGender", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackForgotPassword(String email, String role, Throwable throwable) {
        return rateLimitFallback("forgotPassword", throwable);
    }

    public ResponseEntity<ApiResponse<String>> rateLimitFallbackResetPassword(OtpVerificationRequest otpVerificationRequest, Throwable throwable) {
        return rateLimitFallback("resetPassword", throwable);
    }
}
