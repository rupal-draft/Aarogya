package com.aarogya.appointment_service.grpc;

import appointment.Appointment;
import appointment.AppointmentServiceGrpc;
import com.aarogya.appointment_service.dto.grpc.AppointmentCountByDateDto;
import com.aarogya.appointment_service.dto.grpc.AppointmentStatsDto;
import com.aarogya.appointment_service.dto.grpc.PatientStatsDto;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import com.aarogya.appointment_service.service.AppointmentConsumerService;
import com.aarogya.appointment_service.service.AppointmentService;
import com.google.protobuf.util.Timestamps;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@GrpcService
@RequiredArgsConstructor
@Slf4j
public class AppointmentGrpcService extends AppointmentServiceGrpc.AppointmentServiceImplBase {

    private final AppointmentService appointmentService;
    private final ModelMapper modelMapper;
    private final AppointmentConsumerService appointmentConsumerService;

    @Override
    public void getAppointmentDetails(Appointment.AppointmentIdRequest request, StreamObserver<Appointment.AppointmentResponseDto> responseObserver) {
        log.info("Getting appointment details for id {}", request.getAppointmentId());
        AppointmentResponseDto appointment = appointmentService.getAppointmentDetails(request.getAppointmentId());
        try {
            Appointment.AppointmentResponseDto grpcAppointment = modelMapper.map(appointment, Appointment.AppointmentResponseDto.class);
            responseObserver.onNext(grpcAppointment);
            log.info("Sent appointment details for id {}", request.getAppointmentId());
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, "getAppointmentDetails");
        }
    }

    @Override
    public void getPatientAppointments(Appointment.AppointmentPageRequest request,
                                       StreamObserver<Appointment.AppointmentPageResponse> responseObserver) {
        log.info("Getting logged in patient appointments");
        handleAppointmentRequest(request, responseObserver, true);
    }

    @Override
    public void getDoctorAppointments(Appointment.AppointmentPageRequest request,
                                      StreamObserver<Appointment.AppointmentPageResponse> responseObserver) {
        log.info("Getting logged in doctor appointments");
        handleAppointmentRequest(request, responseObserver, false);
    }

    @Override
    public void getDoctorAppointmentsByDate(Appointment.AppointmentListRequest request, StreamObserver<Appointment.AppointmentListResponse> responseObserver) {
        log.info("Getting doctor appointments by date");
        try {
            LocalDate localDate = Instant.ofEpochSecond(
                    request.getDate().getSeconds(),
                    request.getDate().getNanos()
            ).atZone(ZoneId.systemDefault()).toLocalDate();
            List<AppointmentResponseDto> appointments = appointmentService.getDoctorAppointmentsByDate(request.getDoctorId(), localDate);
            List<Appointment.AppointmentResponseDto> grpcAppointments = appointments.stream()
                    .map(dto -> modelMapper.map(dto, Appointment.AppointmentResponseDto.class))
                    .collect(Collectors.toList());
            Appointment.AppointmentListResponse response = Appointment.AppointmentListResponse.newBuilder()
                    .addAllAppointments(grpcAppointments)
                    .build();
            responseObserver.onNext(response);
            log.info("Sent {} appointments by date", appointments.size());
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, "getDoctorAppointmentsByDate");
        }
    }

    @Override
    public void getAppointmentsByIds(Appointment.GetAppointmentsByIdsRequest request,
                                     StreamObserver<Appointment.GetAppointmentsByIdsResponse> responseObserver) {
        List<AppointmentResponseDto> appts = appointmentService.findByIds(request.getAppointmentIdsList());

        List<Appointment.AppointmentResponseDto> grpcAppts = appts.stream()
                .map(appt -> modelMapper.map(appt, Appointment.AppointmentResponseDto.class))
                .toList();


        Appointment.GetAppointmentsByIdsResponse response = Appointment.GetAppointmentsByIdsResponse.newBuilder()
                .addAllAppointments(grpcAppts)
                .build();

        responseObserver.onNext(response);
        log.info("Sent {} appointments", grpcAppts.size());
        responseObserver.onCompleted();
    }

    @Override
    public void getDoctorStats(Appointment.DoctorIdRequest request,
                               StreamObserver<Appointment.DoctorStatsResponse> responseObserver) {
        try {
            String doctorId = request.getDoctorId();
            log.info("Fetching combined stats for doctor: {}", doctorId);

            AppointmentStatsDto appointmentStatsDto = appointmentConsumerService.getDoctorStats(doctorId);
            PatientStatsDto patientStatsDto = appointmentConsumerService.getPatientStats(doctorId);

            Appointment.AppointmentStatsResponse appointmentStats =
                    Appointment.AppointmentStatsResponse.newBuilder()
                            .setTodayAppointments(appointmentStatsDto.getTodayAppointments())
                            .setUpcomingAppointments(appointmentStatsDto.getUpcomingAppointments())
                            .setCompletedAppointments(appointmentStatsDto.getCompletedAppointments())
                            .setInProgressAppointments(appointmentStatsDto.getInProgressAppointments())
                            .setRejectedAppointments(appointmentStatsDto.getRejectedAppointments())
                            .setFollowupAppointments(appointmentStatsDto.getFollowupAppointments())
                            .setEmergencyAppointments(appointmentStatsDto.getEmergencyAppointments())
                            .setOverdueFollowupAppointments(appointmentStatsDto.getOverdueFollowupAppointments())
                            .setPendingFollowupAppointments(appointmentStatsDto.getPendingFollowupAppointments())
                            .build();

            Appointment.PatientStatsResponse patientStats =
                    Appointment.PatientStatsResponse.newBuilder()
                            .setTotalPatients(patientStatsDto.getTotalPatients())
                            .setNewPatientsThisMonth(patientStatsDto.getNewPatientsThisMonth())
                            .setReturningPatients(patientStatsDto.getReturningPatients())
                            .setActivePatientsThisMonth(patientStatsDto.getActivePatientsThisMonth())
                            .setPatientsWithFollowUps(patientStatsDto.getPatientsWithFollowUps())
                            .setPatientsWithMultipleVisitsThisMonth(patientStatsDto.getPatientsWithMultipleVisitsThisMonth())
                            .setAverageVisitsPerPatient(patientStatsDto.getAverageVisitsPerPatient())
                            .build();

            Appointment.DoctorStatsResponse response =
                    Appointment.DoctorStatsResponse.newBuilder()
                            .setAppointmentStats(appointmentStats)
                            .setPatientStats(patientStats)
                            .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        } catch (Exception e) {
            handleError(responseObserver, e, "getDoctorStats");
        }
    }

    @Override
    public void getDoctorAppointmentsTrend(Appointment.AppointmentTrendRequest request,
                                           StreamObserver<Appointment.AppointmentTrendResponse> responseObserver) {
        try {
            String doctorId = request.getDoctorId();
            LocalDate startDate = Instant.ofEpochSecond(
                    request.getStartDate().getSeconds(),
                    request.getStartDate().getNanos()
            ).atZone(ZoneId.systemDefault()).toLocalDate();

            LocalDate endDate = Instant.ofEpochSecond(
                    request.getEndDate().getSeconds(),
                    request.getEndDate().getNanos()
            ).atZone(ZoneId.systemDefault()).toLocalDate();

            List<AppointmentCountByDateDto> stats =
                    appointmentConsumerService.getAppointmentCountsByDateRange(doctorId, startDate, endDate);

            List<Appointment.AppointmentCountByDate> grpcStats = stats.stream()
                    .map(dto -> Appointment.AppointmentCountByDate.newBuilder()
                            .setDate(Timestamps.fromMillis(dto.getDate()
                                    .atStartOfDay(ZoneId.systemDefault()).toInstant().toEpochMilli()))
                            .setCount(dto.getCount())
                            .build())
                    .toList();

            Appointment.AppointmentTrendResponse response =
                    Appointment.AppointmentTrendResponse.newBuilder()
                            .addAllTrend(grpcStats)
                            .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

            log.info("Sent {} daily appointment stats for doctor {}", grpcStats.size(), doctorId);
        } catch (Exception e) {
            handleError(responseObserver, e, "getDoctorAppointmentsTrend");
        }
    }


    private void handleAppointmentRequest(Appointment.AppointmentPageRequest request,
                                          StreamObserver<Appointment.AppointmentPageResponse> responseObserver,
                                          boolean isPatient) {
        try {
            LocalDate localDate = request.hasDate()
                    ? Instant.ofEpochSecond(request.getDate().getSeconds())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                    : null;

            Page<AppointmentResponseDto> appointments = isPatient
                    ? appointmentService.getPatientAppointments(
                    request.getStatus(), localDate, request.getPage(), request.getSize())
                    : appointmentService.getDoctorAppointments(
                    request.getStatus(), localDate, request.getPage(), request.getSize());

            List<Appointment.AppointmentResponseDto> grpcAppointments = appointments.getContent()
                    .stream()
                    .map(dto -> modelMapper.map(dto, Appointment.AppointmentResponseDto.class))
                    .collect(Collectors.toList());

            Appointment.AppointmentPageResponse response = Appointment.AppointmentPageResponse.newBuilder()
                    .addAllAppointments(grpcAppointments)
                    .setCurrentPage(appointments.getNumber())
                    .setTotalElements(appointments.getSize())
                    .setTotalPages(appointments.getTotalPages())
                    .build();

            responseObserver.onNext(response);
            responseObserver.onCompleted();

            log.info("Sent {} appointments", isPatient ? "patient" : "doctor");
        } catch (Exception e) {
            handleError(responseObserver, e, isPatient ? "getPatientAppointments" : "getDoctorAppointments");
        }
    }

    private void handleError(StreamObserver<?> responseObserver, Exception e, String methodName) {
        log.error("Error in {}: {}", methodName, e.getMessage(), e);
        StatusRuntimeException statusException = Status.INTERNAL
                .withDescription("Internal server error in " + methodName)
                .withCause(e)
                .asRuntimeException();
        responseObserver.onError(statusException);
    }
}
