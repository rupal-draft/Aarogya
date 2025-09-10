package com.aarogya.doctor_service.clients;

import appointment.Appointment;
import appointment.AppointmentServiceGrpc;
import com.aarogya.doctor_service.dto.grpc.appointment.*;
import com.aarogya.doctor_service.exceptions.*;
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
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class AppointmentGrpcClient {

    private final AppointmentServiceGrpc.AppointmentServiceBlockingStub appointmentServiceBlockingStub;
    private final ManagedChannel channel;
    private final ModelMapper modelMapper;

    public AppointmentGrpcClient(ModelMapper modelMapper) {
        try {
            this.channel = ManagedChannelBuilder
                    .forAddress("localhost", 7084)
                    .usePlaintext()
                    .build();

            this.appointmentServiceBlockingStub = AppointmentServiceGrpc.newBlockingStub(channel);
            this.modelMapper = modelMapper;
        } catch (Exception e) {
            log.error("Failed to initialize gRPC Appointment client", e);
            throw new ServiceUnavailableException("Appointment service is currently unavailable");
        }
    }

    private void checkServiceHealth() {
        HealthGrpc.HealthBlockingStub healthStub = HealthGrpc.newBlockingStub(channel);
        try {
            HealthCheckResponse response = healthStub.check(
                    HealthCheckRequest.newBuilder().build());

            if (response.getStatus() != HealthCheckResponse.ServingStatus.SERVING) {
                log.error("Appointment service is not healthy: {}", response.getStatus());
                throw new ServiceUnavailableException("Appointment service is not healthy");
            }
            log.info("Appointment service health status: {}", response.getStatus());
        } catch (StatusRuntimeException e) {
            log.error("Appointment service health check failed", e);
            throw new ServiceUnavailableException("Appointment service is unreachable");
        }
    }

    @Cacheable(value = "appointmentsByDate", key = "#doctorId + '_' + #date.format(T(java.time.format.DateTimeFormatter).ISO_LOCAL_DATE)")
    public List<AppointmentDto> getAppointmentsByDate(String doctorId, LocalDate date){
        checkServiceHealth();
        Instant instant = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Timestamp timestamp = Timestamp.newBuilder()
                .setSeconds(instant.getEpochSecond())
                .setNanos(instant.getNano())
                .build();
        log.info("Getting appointments for date {}", date);
        try {
            Appointment.AppointmentListRequest appointmentListRequest = Appointment.AppointmentListRequest
                    .newBuilder()
                    .setDoctorId(doctorId)
                    .setDate(timestamp)
                    .build();
            Appointment.AppointmentListResponse response = appointmentServiceBlockingStub.getDoctorAppointmentsByDate(appointmentListRequest);
            return response
                    .getAppointmentsList()
                    .stream()
                    .map(this::mapToAppointmentDTO)
                    .toList();
        } catch (StatusRuntimeException e) {
            handleGrpcException(e);
            return null;
        }
    }

    @Cacheable(value = "appointmentsByIds", key = "T(java.util.StringJoiner).new(',').addAll(#ids.stream().sorted().toList()).toString()")
    public Map<String, AppointmentDto> findByIds(List<String> ids) {
        Appointment.GetAppointmentsByIdsRequest request = Appointment.GetAppointmentsByIdsRequest.newBuilder()
                .addAllAppointmentIds(ids)
                .build();

        Appointment.GetAppointmentsByIdsResponse response = appointmentServiceBlockingStub.getAppointmentsByIds(request);

        return response.getAppointmentsList().stream()
                .collect(Collectors.toMap(Appointment.AppointmentResponseDto::getId,
                        this::mapToAppointmentDTO));
    }

    public DoctorPatientAppointmentStats getDoctorAppointmentStats(String doctorId) {
        checkServiceHealth();
        log.info("Fetching doctor stats for doctorId: {}", doctorId);

        try {
            Appointment.DoctorIdRequest request = Appointment.DoctorIdRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .build();

            Appointment.DoctorStatsResponse response = appointmentServiceBlockingStub.getDoctorStats(request);

            AppointmentStatsDto appointmentStats = mapToAppointmentStatsDto(response.getAppointmentStats());
            PatientStatsDto patientStats = mapToPatientStatsDto(response.getPatientStats());

            return new DoctorPatientAppointmentStats(appointmentStats, patientStats);

        } catch (StatusRuntimeException e) {
            handleGrpcException(e);
            return null;
        }
    }

    public List<AppointmentCountByDateDto> getDoctorAppointmentsTrend(String doctorId, LocalDate start, LocalDate end) {
        checkServiceHealth();
        log.info("Fetching doctor appointment trends for doctorId: {}", doctorId);

        try {
            Appointment.AppointmentTrendRequest request = Appointment.AppointmentTrendRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .setStartDate(toTimestamp(start))
                    .setEndDate(toTimestamp(end))
                    .build();

            Appointment.AppointmentTrendResponse response = appointmentServiceBlockingStub.getDoctorAppointmentsTrend(request);

            return response.getTrendList()
                    .stream()
                    .map(this::mapToAppointmentCountByDateDto)
                    .collect(Collectors.toList());

        } catch (StatusRuntimeException e) {
            handleGrpcException(e);
            return Collections.emptyList();
        }
    }


    private AppointmentDto mapToAppointmentDTO(Appointment.AppointmentResponseDto response) {
        return modelMapper.map(response, AppointmentDto.class);
    }

    private AppointmentStatsDto mapToAppointmentStatsDto(Appointment.AppointmentStatsResponse grpcResponse) {
        return new AppointmentStatsDto(
                grpcResponse.getTodayAppointments(),
                grpcResponse.getUpcomingAppointments(),
                grpcResponse.getCompletedAppointments(),
                grpcResponse.getInProgressAppointments(),
                grpcResponse.getRejectedAppointments(),
                grpcResponse.getFollowupAppointments(),
                grpcResponse.getEmergencyAppointments(),
                grpcResponse.getOverdueFollowupAppointments(),
                grpcResponse.getPendingFollowupAppointments()
        );
    }

    private PatientStatsDto mapToPatientStatsDto(Appointment.PatientStatsResponse grpcResponse) {
        return PatientStatsDto
                .builder()
                .totalPatients(grpcResponse.getTotalPatients())
                .returningPatients(grpcResponse.getReturningPatients())
                .newPatientsThisMonth(grpcResponse.getNewPatientsThisMonth())
                .patientsWithFollowUps(grpcResponse.getPatientsWithFollowUps())
                .activePatientsThisMonth(grpcResponse.getActivePatientsThisMonth())
                .averageVisitsPerPatient(grpcResponse.getAverageVisitsPerPatient())
                .patientsWithMultipleVisitsThisMonth(grpcResponse.getPatientsWithMultipleVisitsThisMonth())
                .build();
    }

    private AppointmentCountByDateDto mapToAppointmentCountByDateDto(Appointment.AppointmentCountByDate grpcResponse) {
        return new AppointmentCountByDateDto(
                fromTimestamp(grpcResponse.getDate()).toLocalDate(),
                grpcResponse.getCount()
        );
    }

    private Timestamp toTimestamp(LocalDate date) {
        return Timestamp.newBuilder()
                .setSeconds(date.atStartOfDay(ZoneId.systemDefault()).toEpochSecond())
                .build();
    }

    private LocalDateTime fromTimestamp(com.google.protobuf.Timestamp timestamp) {
        return Instant.ofEpochSecond(timestamp.getSeconds(), timestamp.getNanos())
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();
    }

    private void handleGrpcException(StatusRuntimeException e) {
        Status.Code code = e.getStatus().getCode();
        String description = e.getStatus().getDescription();

        log.error("gRPC error [{}] {}: {}", code, "Failed to get appointments by date", description, e);

        switch (code) {
            case NOT_FOUND:
                throw new ResourceNotFoundException(description != null ? description : "Requested blog not found");
            case INVALID_ARGUMENT:
                throw new BadRequestException(description != null ? description : "Invalid blog request parameters");
            case PERMISSION_DENIED:
                throw new AccessForbidden(description != null ? description : "Blog permission denied");
            case UNAVAILABLE:
                throw new ServiceUnavailableException("Blog service is currently unavailable");
            case FAILED_PRECONDITION:
                throw new IllegalState(description != null ? description : "Invalid blog state");
            default:
                throw new ServiceUnavailableException("Failed to process blog request");
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
