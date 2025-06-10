package com.aarogya.appointment_service.Clients;

import com.aarogya.appointment_service.dto.response.DoctorResponseDTO;
import com.aarogya.appointment_service.dto.response.PatientResponseDTO;
import com.aarogya.appointment_service.exceptions.*;
import com.aarogya.auth.proto.AuthServiceGrpc;
import com.aarogya.auth.proto.DoctorResponse;
import com.aarogya.auth.proto.IdRequest;
import com.aarogya.auth.proto.PatientResponse;
import com.google.protobuf.Timestamp;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.health.v1.HealthCheckRequest;
import io.grpc.health.v1.HealthCheckResponse;
import io.grpc.health.v1.HealthGrpc;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;


@Service
@Slf4j
public class UserGrpcClient {

    private final AuthServiceGrpc.AuthServiceBlockingStub authServiceBlockingStub;
    private final ManagedChannel channel;

    public UserGrpcClient() {
        try {
            this.channel = ManagedChannelBuilder
                    .forAddress("localhost", 6001)
                    .usePlaintext()
                    .build();

            this.authServiceBlockingStub = AuthServiceGrpc.newBlockingStub(channel);
        } catch (Exception e) {
            log.error("Failed to initialize gRPC Auth client", e);
            throw new ServiceUnavailable("Auth service is currently unavailable");
        }
    }

    private void checkServiceHealth() {
        HealthGrpc.HealthBlockingStub healthStub = HealthGrpc.newBlockingStub(channel);
        try {
            HealthCheckResponse response = healthStub.check(
                    HealthCheckRequest.newBuilder().build());

            if (response.getStatus() != HealthCheckResponse.ServingStatus.SERVING) {
                log.error("Auth service is not healthy: {}", response.getStatus());
                throw new ServiceUnavailable("Auth service is not healthy");
            }
            log.info("Auth service health status: {}", response.getStatus());
        } catch (StatusRuntimeException e) {
            log.error("Auth service health check failed", e);
            throw new ServiceUnavailable("Auth service is unreachable");
        }
    }

    @Cacheable(value = "patient", key = "#patientId")
    public PatientResponseDTO getPatient(String patientId) {
        checkServiceHealth();
        log.info("Getting patient with id: {}", patientId);

        try {

            IdRequest request = IdRequest
                    .newBuilder()
                    .setId(patientId)
                    .build();

            PatientResponse patient = authServiceBlockingStub.getPatientById(request);

            if(patient == null || patient.getId().isEmpty()) {
                log.error("Patient with id: {} not found", patientId);
                throw new ServiceUnavailable("Patient with id: " + patientId + " not found");
            }

            log.info("Patient with id: {} found", patientId);

            return mapToPatientResponseDTO(patient);
        } catch (StatusRuntimeException e) {
            handleGrpcException(e, "Failed to get patient with id: " + patientId);
            return null;
        }
    }

    @Cacheable(value = "doctor", key = "#doctorId")
    public DoctorResponseDTO getDoctor(String doctorId) {
        checkServiceHealth();
        log.info("Getting doctor with id: {}", doctorId);

        try {

            IdRequest request = IdRequest
                    .newBuilder()
                    .setId(doctorId)
                    .build();

            DoctorResponse doctorResponse = authServiceBlockingStub.getDoctorById(request);

            if(doctorResponse == null || doctorResponse.getId().isEmpty()) {
                log.error("Doctor with id: {} not found", doctorId);
                throw new ServiceUnavailable("Doctor with id: " + doctorId + " not found");
            }

            log.info("Doctor with id: {} found", doctorId);

            return mapToDoctorResponseDto(doctorResponse);
        } catch (StatusRuntimeException e) {
            handleGrpcException(e, "Failed to get doctor with id: " + doctorId);
            return null;
        }
    }

    private DoctorResponseDTO mapToDoctorResponseDto(DoctorResponse doctorResponse) {
        return DoctorResponseDTO.builder()
                .id(doctorResponse.getId())
                .email(doctorResponse.getEmail())
                .firstName(doctorResponse.getFirstName())
                .lastName(doctorResponse.getLastName())
                .specialization(doctorResponse.getSpecialization())
                .licenseNumber(doctorResponse.getLicenseNumber())
                .experienceYears(doctorResponse.getExperienceYears())
                .phone(doctorResponse.getPhone())
                .address(doctorResponse.getAddress())
                .imageUrl(doctorResponse.getImageUrl())
                .createdAt(fromTimestamp(doctorResponse.getCreatedAt()))
                .build();
    }

    private PatientResponseDTO mapToPatientResponseDTO(PatientResponse patient) {
        return PatientResponseDTO.builder()
                .id(patient.getId())
                .email(patient.getEmail())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth().isEmpty() ? null : LocalDate.parse(patient.getDateOfBirth()))
                .gender(patient.getGender())
                .bloodGroup(patient.getBloodGroup())
                .phone(patient.getPhone())
                .address(patient.getAddress())
                .imageUrl(patient.getImageUrl())
                .emergencyContact(patient.getEmergencyContact())
                .emergencyPhone(patient.getEmergencyPhone())
                .createdAt(fromTimestamp(patient.getCreatedAt()))
                .build();
    }

    private LocalDateTime fromTimestamp(Timestamp timestamp) {
        return Instant.ofEpochSecond(timestamp.getSeconds(), timestamp.getNanos())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private void handleGrpcException(StatusRuntimeException e, String context) {
        Status.Code code = e.getStatus().getCode();
        String description = e.getStatus().getDescription();

        log.error("gRPC error [{}] {}: {}", code, context, description, e);

        switch (code) {
            case NOT_FOUND:
                throw new ResourceNotFound(description != null ? description : "Requested blog not found");
            case INVALID_ARGUMENT:
                throw new BadRequestException(description != null ? description : "Invalid blog request parameters");
            case PERMISSION_DENIED:
                throw new AccessForbidden(description != null ? description : "Blog permission denied");
            case UNAVAILABLE:
                throw new ServiceUnavailable("Blog service is currently unavailable");
            case FAILED_PRECONDITION:
                throw new IllegalState(description != null ? description : "Invalid blog state");
            default:
                throw new ServiceUnavailable("Failed to process blog request");
        }
    }

    @PreDestroy
    public void shutdown() {
        try {
            if (channel != null && !channel.isShutdown()) {
                channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
            }
        } catch (InterruptedException e) {
            log.warn("Failed to shutdown gRPC channel properly", e);
            Thread.currentThread().interrupt();
        }
    }
}
