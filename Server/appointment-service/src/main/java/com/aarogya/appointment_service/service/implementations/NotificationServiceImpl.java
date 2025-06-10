package com.aarogya.appointment_service.service.implementations;

import com.aarogya.appointment_service.Clients.UserGrpcClient;
import com.aarogya.appointment_service.dto.response.DoctorResponseDTO;
import com.aarogya.appointment_service.dto.response.PatientResponseDTO;
import com.aarogya.appointment_service.events.AppointmentNotificationData;
import com.aarogya.appointment_service.events.FollowUpNotificationData;
import com.aarogya.appointment_service.events.NotificationEvent;
import com.aarogya.appointment_service.events.enums.NotificationType;
import com.aarogya.appointment_service.exceptions.RuntimeConflict;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.models.enums.AppointmentStatus;
import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import com.aarogya.appointment_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.KafkaException;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationServiceImpl implements NotificationService {


    private final KafkaTemplate<String, NotificationEvent> kafkaTemplate;
    private final ModelMapper modelMapper;
    private final UserGrpcClient userGrpcClient;

    @Override
    public void sendAppointmentRequestNotification(Appointment appointment) {
        try {
            log.info("Sending appointment request notification for appointment: {}", appointment.getId());

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(appointment.getDoctorId());
            PatientResponseDTO patient = userGrpcClient.getPatient(appointment.getPatientId());

            AppointmentNotificationData data = AppointmentNotificationData.builder()
                    .appointmentId(appointment.getId())
                    .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                    .patientName(patient.getFirstName() + " " + patient.getLastName())
                    .appointmentDate(appointment.getAppointmentDate())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .status(appointment.getStatus())
                    .meetingLink(appointment.getMeetingLink())
                    .reason(appointment.getReason())
                    .notes(appointment.getNotes())
                    .build();

            NotificationEvent event = buildNotificationEvent(
                    NotificationType.APPOINTMENT_REQUEST,
                    doctor.getEmail(),
                    doctor.getFirstName() + " " + doctor.getLastName(),
                    "New Appointment Request",
                    data
            );

            kafkaTemplate.send("appointment-request", appointment.getDoctorId(), event);

            log.info("Appointment request notification sent successfully for appointment: {}", appointment.getId());
        } catch (KafkaException e) {
            log.error("Failed to send appointment request notification for appointment: {}", appointment.getId(), e);
            throw new RuntimeConflict(e.getLocalizedMessage());
        }
    }

    public void sendAppointmentStatusUpdateNotification(Appointment appointment, AppointmentStatus oldStatus) {
        try {
            log.info("Sending appointment status update notification for appointment: {}", appointment.getId());

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(appointment.getDoctorId());
            PatientResponseDTO patient = userGrpcClient.getPatient(appointment.getPatientId());

            boolean notifyPatient = !oldStatus.equals(appointment.getStatus());
            boolean notifyDoctor = appointment.getStatus() == AppointmentStatus.CANCELLED
                    && oldStatus != AppointmentStatus.CANCELLED;

            AppointmentNotificationData data = AppointmentNotificationData.builder()
                    .appointmentId(appointment.getId())
                    .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                    .patientName(patient.getFirstName() + " " + patient.getLastName())
                    .appointmentDate(appointment.getAppointmentDate())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .status(appointment.getStatus())
                    .previousStatus(oldStatus)
                    .meetingLink(appointment.getMeetingLink())
                    .reason(appointment.getReason())
                    .notes(appointment.getNotes())
                    .build();
            if (notifyPatient) {
                NotificationEvent patientEvent = buildNotificationEvent(
                        NotificationType.APPOINTMENT_STATUS_UPDATE,
                        patient.getEmail(),
                        patient.getFirstName() + " " + patient.getLastName(),
                        "Appointment Status Updated",
                        data
                );
                kafkaTemplate.send("appointment-update-status", appointment.getPatientId(), patientEvent);
            }

            if (notifyDoctor) {
                NotificationEvent doctorEvent = buildNotificationEvent(
                        NotificationType.APPOINTMENT_STATUS_UPDATE,
                        doctor.getEmail(),
                        doctor.getFirstName() + " " + doctor.getLastName(),
                        "Appointment Cancellation Notification",
                        data
                );
                kafkaTemplate.send("appointment-update-status", appointment.getDoctorId(), doctorEvent);
            }

            log.info("Appointment status update notification sent successfully for appointment: {}", appointment.getId());
        } catch (KafkaException e) {
            log.error("Failed to send appointment status update notification for appointment: {}", appointment.getId(), e);
            throw new RuntimeConflict(e.getLocalizedMessage());
        }
    }

    @Override
    public void sendEmergencyAppointmentNotification(Appointment appointment) {
        try {
            log.info("Sending emergency appointment notification for appointment: {}", appointment.getId());

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(appointment.getDoctorId());
            PatientResponseDTO patient = userGrpcClient.getPatient(appointment.getPatientId());

            AppointmentNotificationData data = AppointmentNotificationData.builder()
                    .appointmentId(appointment.getId())
                    .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                    .patientName(patient.getFirstName() + " " + patient.getLastName())
                    .appointmentDate(appointment.getAppointmentDate())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .status(appointment.getStatus())
                    .meetingLink(appointment.getMeetingLink())
                    .reason(appointment.getReason())
                    .notes(appointment.getNotes())
                    .build();
            NotificationEvent doctorEvent = buildNotificationEvent(
                    NotificationType.EMERGENCY_APPOINTMENT,
                    doctor.getEmail(),
                    doctor.getFirstName() + " " + doctor.getLastName(),
                    "Emergency Appointment Scheduled",
                    data
            );
            kafkaTemplate.send("emergency-appointment-request", appointment.getDoctorId(), doctorEvent);

            NotificationEvent patientEvent = buildNotificationEvent(
                    NotificationType.EMERGENCY_APPOINTMENT,
                    patient.getEmail(),
                    patient.getFirstName() + " " + patient.getLastName(),
                    "Your Emergency Appointment",
                    data
            );
            kafkaTemplate.send("emergency-appointment-request", appointment.getPatientId(), patientEvent);

            log.info("Emergency appointment notification sent successfully for appointment: {}", appointment.getId());
        } catch (KafkaException e) {
            log.error("Failed to send emergency appointment notification for appointment: {}", appointment.getId(), e);
            throw new RuntimeConflict(e.getLocalizedMessage());
        }
    }

    @Override
    public void sendFollowUpScheduledNotification(FollowUp followUp, Appointment originalAppointment) {
        try {
            log.info("Sending follow-up scheduled notification for follow-up: {}", followUp.getId());

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(followUp.getDoctorId());
            PatientResponseDTO patient = userGrpcClient.getPatient(followUp.getPatientId());

            FollowUpNotificationData data = FollowUpNotificationData.builder()
                    .followUpId(followUp.getId())
                    .originalAppointmentId(followUp.getOriginalAppointmentId())
                    .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                    .patientName(patient.getFirstName() + " " + patient.getLastName())
                    .recommendedDate(followUp.getRecommendedDate())
                    .status(followUp.getStatus())
                    .reason(followUp.getReason())
                    .notes(followUp.getNotes())
                    .urgencyLevel(followUp.getUrgencyLevel())
                    .build();

            NotificationEvent patientEvent = buildNotificationEvent(
                    NotificationType.FOLLOW_UP_SCHEDULED,
                    patient.getEmail(),
                    patient.getFirstName() + " " + patient.getLastName(),
                    "Follow-Up Appointment Scheduled",
                    data
            );
            kafkaTemplate.send("follow-up-schedule", followUp.getPatientId(), patientEvent);

            log.info("Follow-up scheduled notification sent successfully for follow-up: {}", followUp.getId());
        } catch (Exception e) {
            log.error("Failed to send follow-up scheduled notification for follow-up: {}", followUp.getId(), e);
        }
    }

    @Override
    public void sendFollowUpStatusNotification(FollowUp followUp) {
        try {
            log.info("Sending follow-up status notification for follow-up: {}", followUp.getId());

            DoctorResponseDTO doctor = userGrpcClient.getDoctor(followUp.getDoctorId());
            PatientResponseDTO patient = userGrpcClient.getPatient(followUp.getPatientId());

            FollowUpNotificationData data = FollowUpNotificationData.builder()
                    .followUpId(followUp.getId())
                    .originalAppointmentId(followUp.getOriginalAppointmentId())
                    .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                    .patientName(patient.getFirstName() + " " + patient.getLastName())
                    .recommendedDate(followUp.getRecommendedDate())
                    .status(followUp.getStatus())
                    .reason(followUp.getReason())
                    .notes(followUp.getNotes())
                    .urgencyLevel(followUp.getUrgencyLevel())
                    .build();

            if (followUp.getStatus() == FollowUpStatus.COMPLETED ||
                    followUp.getStatus() == FollowUpStatus.CANCELLED) {
                NotificationEvent doctorEvent = buildNotificationEvent(
                        NotificationType.FOLLOW_UP_STATUS_UPDATE,
                        doctor.getEmail(),
                        doctor.getFirstName() + " " + doctor.getLastName(),
                        "Follow-Up " + followUp.getStatus().toString(),
                        data
                );
                kafkaTemplate.send("follow-up-update-status", followUp.getDoctorId(), doctorEvent);

                NotificationEvent patientEvent = buildNotificationEvent(
                        NotificationType.FOLLOW_UP_STATUS_UPDATE,
                        patient.getEmail(),
                        patient.getFirstName() + " " + patient.getLastName(),
                        "Follow-Up " + followUp.getStatus().toString(),
                        data
                );
                kafkaTemplate.send("follow-up-update-status", followUp.getPatientId(), patientEvent);
            } else if (followUp.getStatus() == FollowUpStatus.OVERDUE) {
                NotificationEvent patientEvent = buildNotificationEvent(
                        NotificationType.FOLLOW_UP_STATUS_UPDATE,
                        patient.getEmail(),
                        patient.getFirstName() + " " + patient.getLastName(),
                        "Follow-Up Overdue",
                        data
                );
                kafkaTemplate.send("follow-up-update-status", followUp.getPatientId(), patientEvent);
            }

            log.info("Follow-up status notification sent successfully for follow-up: {}", followUp.getId());
        } catch (KafkaException e) {
            log.error("Failed to send follow-up status notification for follow-up: {}", followUp.getId(), e);
            throw new RuntimeConflict(e.getLocalizedMessage());
        }
    }

    private NotificationEvent buildNotificationEvent(NotificationType type, String email,
                                                     String name, String subject, Object data) {
        Map<String, Object> dataMap = modelMapper.map(data, Map.class);

        return NotificationEvent.builder()
                .type(type)
                .recipientEmail(email)
                .recipientName(name)
                .subject(subject)
                .data(dataMap)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
