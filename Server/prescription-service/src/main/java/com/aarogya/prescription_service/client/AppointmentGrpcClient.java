package com.aarogya.prescription_service.client;

import appointment.Appointment;
import appointment.AppointmentServiceGrpc;
import com.aarogya.prescription_service.dto.AppointmentDTO;
import com.aarogya.prescription_service.exceptions.*;
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
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

@Service
@Slf4j
public class AppointmentGrpcClient {

    private final AppointmentServiceGrpc.AppointmentServiceBlockingStub appointmentServiceBlockingStub;
    private final ManagedChannel channel;
    private final ModelMapper modelMapper;

    public AppointmentGrpcClient(ModelMapper modelMapper) {
        try {
            this.channel = ManagedChannelBuilder
                    .forAddress("localhost", 3001)
                    .usePlaintext()
                    .build();

            this.appointmentServiceBlockingStub = AppointmentServiceGrpc.newBlockingStub(channel);
            this.modelMapper = modelMapper;
        } catch (Exception e) {
            log.error("Failed to initialize gRPC Appointment client", e);
            throw new ServiceUnavailable("Appointment service is currently unavailable");
        }
    }

    private void checkServiceHealth() {
        HealthGrpc.HealthBlockingStub healthStub = HealthGrpc.newBlockingStub(channel);
        try {
            HealthCheckResponse response = healthStub.check(
                    HealthCheckRequest.newBuilder().build());

            if (response.getStatus() != HealthCheckResponse.ServingStatus.SERVING) {
                log.error("Appointment service is not healthy: {}", response.getStatus());
                throw new ServiceUnavailable("Appointment service is not healthy");
            }
            log.info("Appointment service health status: {}", response.getStatus());
        } catch (StatusRuntimeException e) {
            log.error("Appointment service health check failed", e);
            throw new ServiceUnavailable("Appointment service is unreachable");
        }
    }

    @Cacheable(value = "appointment", key = "#appointmentId")
    public AppointmentDTO getAppointment(String appointmentId) {
        checkServiceHealth();
        try {
            Appointment.AppointmentIdRequest request = Appointment
                    .AppointmentIdRequest
                    .newBuilder()
                    .setAppointmentId(appointmentId)
                    .build();
            Appointment.AppointmentResponseDto response = appointmentServiceBlockingStub.getAppointmentDetails(request);
            return mapToAppointmentDTO(response);
        } catch (StatusRuntimeException e) {
            handleGrpcException(e, "getAppointment");
            return null;
        }
    }

    @Cacheable(value = "patient-appointments", key = "#status + #date + #page + #size")
    public Page<AppointmentDTO> getPatientAppointments(String status, LocalDate date, int page, int size) {
        return fetchAppointments(appointmentServiceBlockingStub::getPatientAppointments, status, date, page, size, "getPatientAppointments");
    }

    @Cacheable(value = "doctor-appointments", key = "#status + #date + #page + #size")
    public Page<AppointmentDTO> getDoctorAppointments(String status, LocalDate date, int page, int size) {
        return fetchAppointments(appointmentServiceBlockingStub::getDoctorAppointments, status, date, page, size, "getDoctorAppointments");
    }

    private Page<AppointmentDTO> fetchAppointments(
            Function<Appointment.AppointmentPageRequest, Appointment.AppointmentPageResponse> grpcMethod,
            String status, LocalDate date, int page, int size, String methodName) {

        checkServiceHealth();
        try {
            Appointment.AppointmentPageRequest.Builder requestBuilder = Appointment
                    .AppointmentPageRequest
                    .newBuilder()
                    .setStatus(status)
                    .setPage(page)
                    .setSize(size);

            if (date != null) {
                Instant instant = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
                Timestamp timestamp = Timestamp.newBuilder()
                        .setSeconds(instant.getEpochSecond())
                        .setNanos(instant.getNano())
                        .build();
                requestBuilder.setDate(timestamp);
            }

            Appointment.AppointmentPageRequest request = requestBuilder.build();
            Appointment.AppointmentPageResponse response = grpcMethod.apply(request);

            return new PageImpl<>(
                    response.getAppointmentsList().stream().map(this::mapToAppointmentDTO).toList(),
                    PageRequest.of(page, size),
                    response.getTotalElements()
            );
        } catch (StatusRuntimeException e) {
            handleGrpcException(e, methodName);
            return Page.empty();
        }
    }

    private AppointmentDTO mapToAppointmentDTO(Appointment.AppointmentResponseDto response) {
        return modelMapper.map(response, AppointmentDTO.class);
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
