package com.aarogya.appointment_service.service.implementations;

import com.aarogya.appointment_service.enums.AppointmentStatus;
import com.aarogya.appointment_service.exceptions.DataIntegrityViolation;
import com.aarogya.appointment_service.exceptions.ResourceNotFound;
import com.aarogya.appointment_service.exceptions.ServiceUnavailable;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.service.AppointmentConsumerService;
import com.aarogya.appointment_service.service.NotificationService;
import com.aarogya.events.AppointmentApproveEvent;
import com.aarogya.events.AppointmentRejectEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentConsumerServiceImpl implements AppointmentConsumerService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    @KafkaListener(
            topics = "appointment-approve",
            groupId = "appointment-approve-group",
            containerFactory = "appointmentApproveKafkaListenerFactory"
    )
    public void approveAppointment(AppointmentApproveEvent event) {
        String appointmentId = event.getAppointmentId();
        String paymentId = event.getPaymentId();
        log.info("Approving appointment with id: {}", appointmentId);
        try {
            Appointment appointment = appointmentRepository
                    .findById(appointmentId)
                    .orElseThrow(() -> new ResourceNotFound("Appointment not found with id: " + appointmentId));

            appointment.setStatus(AppointmentStatus.APPROVED);
            appointment.setPaymentId(paymentId);
            appointmentRepository.save(appointment);
            notificationService.sendAppointmentStatusUpdateNotification(appointment, AppointmentStatus.APPROVED);
            log.info("Appointment approved with payment id: {}", paymentId);
        } catch (ResourceNotFound e) {
            log.error("Appointment not found: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating appointment status", e);
            throw new DataIntegrityViolation("Error updating appointment status");
        } catch (Exception e) {
            log.error("Unexpected error updating appointment status", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }

    @Override
    @Transactional
    @KafkaListener(
            topics = "appointment-reject",
            groupId = "appointment-reject-group",
            containerFactory = "appointmentRejectKafkaListenerFactory"
    )
    public void rejectAppointment(AppointmentRejectEvent event) {
        String appointmentId = event.getAppointmentId();
        log.info("Rejecting appointment with id: {}", appointmentId);
        try {
            Appointment appointment = appointmentRepository
                    .findById(appointmentId)
                    .orElseThrow(() -> new ResourceNotFound("Appointment not found with id: " + appointmentId));

            appointment.setStatus(AppointmentStatus.REJECTED);
            appointmentRepository.save(appointment);
            notificationService.sendAppointmentStatusUpdateNotification(appointment, AppointmentStatus.REJECTED);
            log.info("Appointment with id: {} rejected for failed payment", appointmentId);
        } catch (ResourceNotFound e) {
            log.error("Appointment not found: {}", e.getMessage());
            throw e;
        } catch (DataIntegrityViolationException e) {
            log.error("Data integrity violation while updating appointment status", e);
            throw new DataIntegrityViolation("Error updating appointment status");
        } catch (Exception e) {
            log.error("Unexpected error updating appointment status", e);
            throw new ServiceUnavailable(e.getLocalizedMessage());
        }
    }
}
