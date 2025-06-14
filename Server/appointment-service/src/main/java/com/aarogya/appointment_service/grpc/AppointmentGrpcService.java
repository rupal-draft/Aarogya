package com.aarogya.appointment_service.grpc;

import appointment.Appointment;
import appointment.AppointmentServiceGrpc;
import com.aarogya.appointment_service.dto.response.AppointmentResponseDto;
import com.aarogya.appointment_service.service.AppointmentService;
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
