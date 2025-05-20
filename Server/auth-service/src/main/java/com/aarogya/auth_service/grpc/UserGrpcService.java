package com.aarogya.auth_service.grpc;

import com.aarogya.auth.proto.*;
import com.aarogya.auth_service.dto.DoctorResponseDTO;
import com.aarogya.auth_service.dto.PatientResponseDTO;
import com.aarogya.auth_service.service.AuthService;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import com.google.protobuf.util.Timestamps;
import java.time.ZoneId;
import java.util.List;
import java.util.function.Supplier;
import java.util.stream.Collectors;

@GrpcService
@Slf4j
public class UserGrpcService extends AuthServiceGrpc.AuthServiceImplBase {

    private final AuthService authService;

    public UserGrpcService(AuthService authService) {
        this.authService = authService;
    }

    @Override
    public void getDoctorById(IdRequest request, StreamObserver<DoctorResponse> responseObserver) {
        try {
            log.info("Processing gRPC request for getDoctorById with ID: {}", request.getId());
            DoctorResponseDTO doctor = authService.getDoctorProfileById(request.getId());
            log.info("Sending response: {}", doctor);
            DoctorResponse doctorResponse = mapToDoctorResponse(doctor);
            responseObserver.onNext(doctorResponse);
            log.info("Completed gRPC request for getDoctorById with ID: {}", request.getId());
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, "getDoctorById");
        }
    }

    @Override
    public void getPatientById(IdRequest request, StreamObserver<PatientResponse> responseObserver) {
        try {
            log.info("Processing gRPC request for getPatientById with ID: {}", request.getId());
            PatientResponseDTO patient = authService.getPatientProfileById(request.getId());
            log.info("Sending response: {}", patient);
            PatientResponse patientResponse = mapToPatientResponse(patient);
            responseObserver.onNext(patientResponse);
            log.info("Completed gRPC request for getPatientById with ID: {}", request.getId());
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, "getPatientById");
        }
    }

    @Override
    public void getDoctorsBySpecialization(SpecializationRequest request, StreamObserver<DoctorListResponse> responseObserver) {
        handleDoctorListRequest(
                responseObserver,
                () -> authService.getDoctorsBySpecialization(request.getSpecialization()),
                "getDoctorsBySpecialization"
        );
    }

    @Override
    public void getPatientsByGender(GenderRequest request, StreamObserver<PatientListResponse> responseObserver) {
        handlePatientListRequest(
                responseObserver,
                () -> authService.getPatientsByGender(request.getGender()),
                "getPatientsByGender"
        );
    }


    private void handleError(StreamObserver<?> responseObserver, Exception e, String methodName) {
        log.error("Error in {}: {}", methodName, e.getMessage(), e);
        StatusRuntimeException statusException = Status.INTERNAL
                .withDescription("Internal server error in " + methodName)
                .withCause(e)
                .asRuntimeException();
        responseObserver.onError(statusException);
    }

    private void handleDoctorListRequest(StreamObserver<DoctorListResponse> responseObserver,
                                         Supplier<List<DoctorResponseDTO>> serviceMethod,
                                         String methodName) {
        try {
            log.info("Processing gRPC request for {}", methodName);
            List<DoctorResponseDTO> doctors = serviceMethod.get();
            List<DoctorResponse> grpcDoctors = doctors
                    .stream()
                    .map(this::mapToDoctorResponse)
                    .collect(Collectors.toUnmodifiableList());

            DoctorListResponse response = DoctorListResponse.newBuilder()
                    .addAllDoctors(grpcDoctors)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, methodName);
        }
    }

    private void handlePatientListRequest(StreamObserver<PatientListResponse> responseObserver,
                                          Supplier<List<PatientResponseDTO>> serviceMethod,
                                          String methodName) {
        try {
            log.info("Processing gRPC request for {}", methodName);
            List<PatientResponseDTO> patients = serviceMethod.get();
            List<PatientResponse> grpcPatients = patients
                    .stream()
                    .map(this::mapToPatientResponse)
                    .collect(Collectors.toUnmodifiableList());

            PatientListResponse response = PatientListResponse.newBuilder()
                    .addAllPatients(grpcPatients)
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, methodName);
        }
    }

    private DoctorResponse mapToDoctorResponse(DoctorResponseDTO doctor) {
        return DoctorResponse.newBuilder()
                .setId(doctor.getId())
                .setEmail(doctor.getEmail())
                .setFirstName(doctor.getFirstName())
                .setLastName(doctor.getLastName())
                .setSpecialization(doctor.getSpecialization())
                .setLicenseNumber(doctor.getLicenseNumber())
                .setExperienceYears(doctor.getExperienceYears())
                .setPhone(doctor.getPhone())
                .setAddress(doctor.getAddress())
                .setImageUrl(doctor.getImageUrl())
                .setCreatedAt(Timestamps.fromMillis(doctor.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
                .build();
    }

    private PatientResponse mapToPatientResponse(PatientResponseDTO patient) {
        return PatientResponse.newBuilder()
                .setId(patient.getId())
                .setEmail(patient.getEmail())
                .setFirstName(patient.getFirstName())
                .setLastName(patient.getLastName())
                .setGender(patient.getGender())
                .setBloodGroup(patient.getBloodGroup())
                .setPhone(patient.getPhone())
                .setAddress(patient.getAddress())
                .setImageUrl(patient.getImageUrl())
                .setDateOfBirth(patient.getDateOfBirth().toString())
                .setEmergencyContact(patient.getEmergencyContact())
                .setEmergencyPhone(patient.getEmergencyPhone())
                .setCreatedAt(Timestamps.fromMillis(patient.getCreatedAt().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()))
                .build();
    }
}
