package com.aarogya.auth_service.service.implementation;

import com.aarogya.auth_service.documents.Doctor;
import com.aarogya.auth_service.documents.PasswordResetOtp;
import com.aarogya.auth_service.documents.Patient;
import com.aarogya.auth_service.documents.enums.Role;
import com.aarogya.auth_service.documents.enums.Specialization;
import com.aarogya.auth_service.dto.*;
import com.aarogya.auth_service.events.SendOtpEvent;
import com.aarogya.auth_service.exceptions.*;
import com.aarogya.auth_service.repository.DoctorRepository;
import com.aarogya.auth_service.repository.OtpRepository;
import com.aarogya.auth_service.repository.PatientRepository;
import com.aarogya.auth_service.security.JwtService;
import com.aarogya.auth_service.service.AuthService;
import com.aarogya.auth_service.util.GenerateOtp;
import com.aarogya.auth_service.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.MappingException;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ModelMapper modelMapper;
    private final JwtService jwtService;
    private final OtpRepository otpRepository;
    private final KafkaTemplate<String, SendOtpEvent> otpKafkaTemplate;
    private static final String topicName = "send-otp";

    @Override
    @Transactional
    @CacheEvict(value = "doctors", allEntries = true)
    public DoctorResponseDTO registerDoctor(DoctorRequestDTO doctorRequestDTO) {
        try {
            log.info("Processing signup request of doctor for email: {}", doctorRequestDTO.getEmail());

            if (doctorRequestDTO.getEmail() == null || doctorRequestDTO.getEmail().isBlank()) {
                throw new BadRequestException("Email is required");
            }
            if (doctorRequestDTO.getPassword() == null || doctorRequestDTO.getPassword().isBlank()) {
                throw new BadRequestException("Password is required");
            }

            if (doctorRepository.existsByEmail(doctorRequestDTO.getEmail())) {
                log.warn("Signup failed: Email already exists - {}", doctorRequestDTO.getEmail());
                throw new ResourceConflictException("Doctor already exists with email: " + doctorRequestDTO.getEmail());
            }

            Doctor doctor = modelMapper.map(doctorRequestDTO, Doctor.class);
            doctor.setPassword(PasswordUtil.hashPassword(doctorRequestDTO.getPassword()));

            Doctor savedDoctor = doctorRepository.save(doctor);
            log.info("Doctor successfully signed up with ID: {}", savedDoctor.getId());

            return modelMapper.map(savedDoctor, DoctorResponseDTO.class);

        } catch (DataAccessException ex) {
            log.error("Database error during signup for email: {}", doctorRequestDTO.getEmail(), ex);
            throw new DataIntegrityViolation("Failed to create user due to database error");
        } catch (MappingException ex) {
            log.error("Mapping error during signup", ex);
            throw new IllegalState("Failed to map user data");
        } catch (Exception ex) {
            log.error("Error during signup", ex);
            throw new ServiceUnavailable("Failed to sign up patient");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public LoginDoctorResponse loginDoctor(LoginRequestDto loginRequestDto) {
        try {
            log.info("Processing login for email: {}", loginRequestDto.getEmail());

            if (loginRequestDto.getEmail() == null || loginRequestDto.getEmail().isBlank()) {
                throw new BadRequestException("Email is required");
            }
            if (loginRequestDto.getPassword() == null || loginRequestDto.getPassword().isBlank()) {
                throw new BadRequestException("Password is required");
            }

            Doctor doctor = doctorRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> {
                        log.warn("Login failed: Doctor not found - {}", loginRequestDto.getEmail());
                        return new ResourceNotFound("Doctor not found with email: " + loginRequestDto.getEmail());
                    });

            if (!PasswordUtil.checkPassword(loginRequestDto.getPassword(), doctor.getPassword())) {
                log.warn("Login failed: Invalid password for email - {}", loginRequestDto.getEmail());
                throw new ResourceConflictException("Invalid credentials");
            }

            String token = jwtService.getDoctorAccessJwtToken(doctor);
            log.info("Doctor successfully logged in with ID: {}", doctor.getId());

            LoginDoctorResponse response = new LoginDoctorResponse();
            response.setDoctor(modelMapper.map(doctor, DoctorResponseDTO.class));
            response.setToken(token);

            return response;

        } catch (DataAccessException ex) {
            log.error("Database error during login for email: {}", loginRequestDto.getEmail(), ex);
            throw new ServiceUnavailable("Unable to process login at this time");
        } catch (Exception ex) {
            log.error("Error during login", ex);
            throw new ServiceUnavailable("Unable to process login at this time");
        }
    }
    @Override
    @Transactional
    @CacheEvict(value = "patients", allEntries = true)
    public PatientResponseDTO registerPatient(PatientRequestDTO patientRequestDTO) {
        try {
            log.info("Processing signup request of patient for email: {}", patientRequestDTO.getEmail());

            if (patientRequestDTO.getEmail() == null || patientRequestDTO.getEmail().isBlank()) {
                throw new BadRequestException("Email is required");
            }

            if (patientRequestDTO.getPassword() == null || patientRequestDTO.getPassword().isBlank()) {
                throw new BadRequestException("Password is required");
            }

            if (patientRepository.existsByEmail(patientRequestDTO.getEmail())) {
                log.warn("Signup failed: Email already exists - {}", patientRequestDTO.getEmail());
                throw new ResourceConflictException("Patient already exists with email: " + patientRequestDTO.getEmail());
            }

            Patient patient = modelMapper.map(patientRequestDTO, Patient.class);
            patient.setPassword(PasswordUtil.hashPassword(patientRequestDTO.getPassword()));

            Patient savedPatient = patientRepository.save(patient);
            log.info("Patient successfully signed up with ID: {}", savedPatient.getId());

            return modelMapper.map(savedPatient, PatientResponseDTO.class);

        } catch (DataAccessException ex) {
            log.error("Database error during signup for email: {}", patientRequestDTO.getEmail(), ex);
            throw new DataIntegrityViolation("Failed to create patient due to database error");
        } catch (MappingException ex) {
            log.error("Mapping error during signup", ex);
            throw new IllegalState("Failed to map patient data");
        } catch (Exception ex) {
            log.error("Error during signup", ex);
            throw new ServiceUnavailable("Failed to sign up patient");
        }
    }


    @Override
    @Transactional(readOnly = true)
    public LoginPatientResponse loginPatient(LoginRequestDto loginRequestDto) {
        try {
            log.info("Processing login for email: {}", loginRequestDto.getEmail());

            if (loginRequestDto.getEmail() == null || loginRequestDto.getEmail().isBlank()) {
                throw new BadRequestException("Email is required");
            }
            if (loginRequestDto.getPassword() == null || loginRequestDto.getPassword().isBlank()) {
                throw new BadRequestException("Password is required");
            }

            Patient patient = patientRepository.findByEmail(loginRequestDto.getEmail())
                    .orElseThrow(() -> {
                        log.warn("Login failed: Patient not found - {}", loginRequestDto.getEmail());
                        return new ResourceNotFound("Doctor not found with email: " + loginRequestDto.getEmail());
                    });

            if (!PasswordUtil.checkPassword(loginRequestDto.getPassword(), patient.getPassword())) {
                log.warn("Login failed: Invalid password for email - {}", loginRequestDto.getEmail());
                throw new ResourceConflictException("Invalid credentials");
            }

            String token = jwtService.getPatientAccessJwtToken(patient);
            log.info("Patient successfully logged in with ID: {}", patient.getId());

            LoginPatientResponse response = new LoginPatientResponse();
            response.setPatient(modelMapper.map(patient, PatientResponseDTO.class));
            response.setToken(token);

            return response;
        } catch (DataAccessException ex) {
            log.error("Database error during login for email: {}", loginRequestDto.getEmail(), ex);
            throw new ServiceUnavailable("Unable to process login at this time");
        } catch (Exception ex) {
            log.error("Error during login", ex);
            throw new ServiceUnavailable("Unable to process login at this time");
        }
    }

    @Override
    @Transactional
    public void resetPassword(OtpVerificationRequest request) {
        try {
            if (request.getEmail() == null || request.getEmail().isBlank()) {
                throw new BadRequestException("Email is required");
            }
            if (request.getOtp() == null || request.getOtp().isBlank()) {
                throw new BadRequestException("OTP is required");
            }
            if (request.getNewPassword() == null || request.getNewPassword().isBlank()) {
                throw new BadRequestException("New password is required");
            }

            log.info("Processing password reset for email: {}", request.getEmail());

            PasswordResetOtp otpEntry = otpRepository.findByEmailAndOtp(request.getEmail(), request.getOtp())
                    .orElseThrow(() -> new BadRequestException("Invalid OTP"));

            if (otpEntry.isExpired()) {
                throw new BadRequestException("OTP has expired");
            }

            switch (otpEntry.getRole()) {
                case DOCTOR:
                    Doctor doctor = doctorRepository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new ResourceNotFound("Doctor not found with email: " + request.getEmail()));

                    doctor.setPassword(PasswordUtil.hashPassword(request.getNewPassword()));
                    doctorRepository.save(doctor);
                    break;

                case PATIENT:
                    Patient patient = patientRepository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new ResourceNotFound("Patient not found with email: " + request.getEmail()));

                    patient.setPassword(PasswordUtil.hashPassword(request.getNewPassword()));
                    patientRepository.save(patient);
                    break;

                default:
                    throw new IllegalArgumentException("Unsupported role: " + otpEntry.getRole());
            }

            otpRepository.delete(otpEntry);
            log.info("Password reset successful for {}", request.getEmail());
        } catch (DataAccessException ex) {
            log.error("Database error during password reset for email: {}", request.getEmail(), ex);
            throw new DataIntegrityViolation("Failed to reset password due to database error");
        } catch (Exception ex) {
            log.error("Error during password reset", ex);
            throw new ServiceUnavailable("Failed to reset password");
        }
    }


    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail();
        String role = request.getRole();
        try {
            if (email == null || email.isBlank()) {
                throw new BadRequestException("Email is required");
            }
            if (role == null || role.isBlank()) {
                throw new BadRequestException("Role is required");
            }
            log.info("Processing forgot password request for email: {}", email);
            String name;
            Role userRole = Role.valueOf(role.toUpperCase());

            switch (userRole) {
                case DOCTOR:
                    Doctor doctor = doctorRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFound("Doctor not found with email: " + email));
                    name = doctor.getFirstName() + " " + doctor.getLastName();
                    break;

                case PATIENT:
                    Patient patient = patientRepository.findByEmail(email)
                            .orElseThrow(() -> new ResourceNotFound("Patient not found with email: " + email));
                    name = patient.getFirstName() + " " + patient.getLastName();
                    break;

                default:
                    throw new IllegalArgumentException("Unsupported user role: " + userRole);
            }

            String otp = GenerateOtp.generateOtp();
            PasswordResetOtp passwordResetOtp = PasswordResetOtp
                    .builder()
                    .role(userRole)
                    .email(email)
                    .otp(otp)
                    .build();
            otpRepository.save(passwordResetOtp);
            log.info("OTP generated for forgot password request for email: {}", email);
            SendOtpEvent sendOtpEvent = SendOtpEvent
                    .builder()
                    .email(email)
                    .otp(otp)
                    .subject("Your OTP for Password Reset")
                    .role(userRole.toString())
                    .recipientName(name)
                    .purpose("Password Reset")
                    .generatedAt(LocalDateTime.now())
                    .build();
            otpKafkaTemplate.send(topicName, sendOtpEvent.getOtp(), sendOtpEvent);
            log.info("Kafka message sent for forgot password request for email: {}", email);
        } catch (DataAccessException ex) {
            log.error("Database error during forgot password request for email: {}", email, ex);
            throw new DataIntegrityViolation("Unable to process forgot password request at this time");
        } catch (KafkaException ex) {
            log.error("Kafka error during forgot password request for email: {}", email, ex);
            throw new ServiceUnavailable("Unable to process forgot password request at this time");
        } catch (Exception ex) {
            log.error("Error during forgot password request", ex);
            throw new ServiceUnavailable("Unable to process forgot password request at this time");
        }
    }

    @Override
    @Cacheable(value = "doctors", key = "#id")
    @Transactional(readOnly = true)
    public DoctorResponseDTO getDoctorProfileById(String id) {
        try {
            log.info("Fetching doctor profile with ID: {}", id);

            if (id == null || id.isBlank()) {
                throw new BadRequestException("Doctor ID is required");
            }

            Doctor doctor = doctorRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Doctor not found for ID: {}", id);
                        return new ResourceNotFound("Doctor not found with ID: " + id);
                    });

            return modelMapper.map(doctor, DoctorResponseDTO.class);
        } catch (DataAccessException ex) {
            log.error("Database error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        } catch (MappingException ex) {
            log.error("Mapping error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        } catch (Exception ex) {
            log.error("Error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        }
    }


    @Override
    @Cacheable(value = "patients", key = "#id")
    @Transactional(readOnly = true)
    public PatientResponseDTO getPatientProfileById(String id) {
        try {
            log.info("Fetching patient profile with ID: {}", id);

            if (id == null || id.isBlank()) {
                throw new BadRequestException("Patient ID is required");
            }

            Patient patient = patientRepository.findById(id)
                    .orElseThrow(() -> {
                        log.warn("Patient not found for ID: {}", id);
                        return new ResourceNotFound("Patient not found with ID: " + id);
                    });

            return modelMapper.map(patient, PatientResponseDTO.class);
        } catch (DataAccessException ex) {
            log.error("Database error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        } catch (MappingException ex) {
            log.error("Mapping error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        } catch (Exception ex) {
            log.error("Error during fetching doctor profile for ID: {}", id, ex);
            throw new ServiceUnavailable("Unable to fetch doctor profile at this time");
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "doctors", key = "#specialization")
    public List<DoctorResponseDTO> getDoctorsBySpecialization(String specialization) {
        log.info("Fetching doctors by specialization: {}", specialization);
        try {
            if (specialization == null || specialization.isBlank()) {
                throw new BadRequestException("Specialization is required");
            }
            List<Doctor> doctors = doctorRepository
                    .findBySpecialization(Specialization
                            .valueOf(specialization
                                    .toUpperCase()));

            log.info("{} Doctors found for specialization: {}",doctors.size(), specialization);
            return doctors.stream()
                    .map(doctor -> modelMapper.map(doctor, DoctorResponseDTO.class))
                    .collect(Collectors.toList());
        } catch (DataAccessException ex) {
            log.error("Database error during fetching doctors by specialization: {}", specialization, ex);
            throw new ServiceUnavailable("Unable to fetch doctors at this time");
        } catch (MappingException ex) {
            log.error("Mapping error during fetching doctors by specialization: {}", specialization, ex);
            throw new ServiceUnavailable("Unable to fetch doctors at this time");
        } catch (Exception ex) {
            log.error("Error during fetching doctors by specialization: {}", specialization, ex);
            throw new ServiceUnavailable("Unable to fetch doctors at this time");
        }
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "patients", key = "#gender")
    public List<PatientResponseDTO> getPatientsByGender(String gender) {
        log.info("Fetching patients by gender: {}", gender);
        try {
            if (gender == null || gender.isBlank()) {
                throw new BadRequestException("Gender is required");
            }

            List<Patient> patients = patientRepository.findByGender(gender);

            log.info("{} Patients found for gender: {}",patients.size(), gender);
            return patients.stream()
                    .map(patient -> modelMapper.map(patient, PatientResponseDTO.class))
                    .collect(Collectors.toList());
        } catch (DataAccessException ex) {
            log.error("Database error during fetching patients by gender: {}", gender, ex);
            throw new ServiceUnavailable("Unable to fetch patients at this time");
        } catch (MappingException ex) {
            log.error("Mapping error during fetching patients by gender: {}", gender, ex);
            throw new ServiceUnavailable("Unable to fetch patients at this time");
        } catch (Exception ex) {
            log.error("Error during fetching patients by gender: {}", gender, ex);
            throw new ServiceUnavailable("Unable to fetch patients at this time");
        }
    }
}
