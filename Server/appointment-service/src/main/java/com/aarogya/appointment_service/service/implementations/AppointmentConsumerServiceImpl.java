package com.aarogya.appointment_service.service.implementations;

import com.aarogya.appointment_service.dto.grpc.AppointmentCountByDateDto;
import com.aarogya.appointment_service.dto.grpc.AppointmentStatsDto;
import com.aarogya.appointment_service.dto.grpc.PatientStatsDto;
import com.aarogya.appointment_service.enums.AppointmentStatus;
import com.aarogya.appointment_service.enums.AppointmentType;
import com.aarogya.appointment_service.enums.FollowUpStatus;
import com.aarogya.appointment_service.events.IncreaseBookingCountEvent;
import com.aarogya.appointment_service.exceptions.DataIntegrityViolation;
import com.aarogya.appointment_service.exceptions.ResourceNotFound;
import com.aarogya.appointment_service.exceptions.ServiceUnavailable;
import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.repository.AppointmentRepository;
import com.aarogya.appointment_service.service.AppointmentConsumerService;
import com.aarogya.appointment_service.service.NotificationService;
import com.aarogya.payment_service.events.AppointmentApproveEvent;
import com.aarogya.payment_service.events.AppointmentRejectEvent;
import com.mongodb.BasicDBObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentConsumerServiceImpl implements AppointmentConsumerService {

    private final AppointmentRepository appointmentRepository;
    private final NotificationService notificationService;
    private final MongoTemplate mongoTemplate;
    private final KafkaTemplate<String, IncreaseBookingCountEvent> increaseBookingCountKafkaTemplate;

    private static final String APPOINTMENT_CACHE = "appointments";


    @Override
    @Transactional
    @KafkaListener(
            topics = "appointment-approve",
            groupId = "appointment-approve-group",
            containerFactory = "appointmentApproveKafkaListenerFactory"
    )
    @CacheEvict(value = APPOINTMENT_CACHE, allEntries = true)
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
            IncreaseBookingCountEvent increaseBookingCountEvent = IncreaseBookingCountEvent
                    .builder()
                    .doctorId(appointment.getDoctorId())
                    .date(appointment.getAppointmentDate())
                    .startTime(appointment.getStartTime())
                    .endTime(appointment.getEndTime())
                    .build();
            increaseBookingCountKafkaTemplate.send("increase-booking-count", appointment.getDoctorId(), increaseBookingCountEvent);
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
    @CacheEvict(value = APPOINTMENT_CACHE, allEntries = true)
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

    @Override
    @Cacheable(value = "doctorStats", key = "#doctorId", unless = "#result == null")
    public AppointmentStatsDto getDoctorStats(String doctorId) {
        LocalDate today = LocalDate.now();
        LocalDate weekLater = today.plusDays(7);

        Aggregation appointmentAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.group()
                        .sum(ConditionalOperators.when(Criteria.where("appointmentDate").is(today)).then(1).otherwise(0)).as("todayAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("appointmentDate").gt(today).lte(weekLater)).then(1).otherwise(0)).as("upcomingAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("status").is(AppointmentStatus.COMPLETED)).then(1).otherwise(0)).as("completedAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("status").is(AppointmentStatus.IN_PROGRESS)).then(1).otherwise(0)).as("inProgressAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("status").is(AppointmentStatus.REJECTED)).then(1).otherwise(0)).as("rejectedAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("type").is(AppointmentType.EMERGENCY)).then(1).otherwise(0)).as("emergencyAppointments")
        );

        AggregationResults<BasicDBObject> appointmentResults =
                mongoTemplate.aggregate(appointmentAgg, Appointment.class, BasicDBObject.class);

        BasicDBObject appointmentStats = appointmentResults.getUniqueMappedResult();
        if (appointmentStats == null) {
            appointmentStats = new BasicDBObject();
        }

        int todayAppointments = appointmentStats.getInt("todayAppointments", 0);
        int upcomingAppointments = appointmentStats.getInt("upcomingAppointments", 0);
        int completedAppointments = appointmentStats.getInt("completedAppointments", 0);
        int inProgressAppointments = appointmentStats.getInt("inProgressAppointments", 0);
        int rejectedAppointments = appointmentStats.getInt("rejectedAppointments", 0);
        int emergencyAppointments = appointmentStats.getInt("emergencyAppointments", 0);

        Aggregation followUpAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.group()
                        .sum(ConditionalOperators.when(Criteria.where("status").is(FollowUpStatus.PENDING)).then(1).otherwise(0)).as("pendingFollowupAppointments")
                        .sum(ConditionalOperators.when(Criteria.where("status").is(FollowUpStatus.OVERDUE)).then(1).otherwise(0)).as("overdueFollowupAppointments")
        );

        AggregationResults<BasicDBObject> followUpResults =
                mongoTemplate.aggregate(followUpAgg, FollowUp.class, BasicDBObject.class);

        BasicDBObject followUpStats = followUpResults.getUniqueMappedResult();
        if (followUpStats == null) {
            followUpStats = new BasicDBObject();
        }

        int pendingFollowupAppointments = followUpStats.getInt("pendingFollowupAppointments", 0);
        int overdueFollowupAppointments = followUpStats.getInt("overdueFollowupAppointments", 0);

        return new AppointmentStatsDto(
                todayAppointments,
                upcomingAppointments,
                completedAppointments,
                inProgressAppointments,
                rejectedAppointments,
                pendingFollowupAppointments + overdueFollowupAppointments, // total followups
                emergencyAppointments,
                overdueFollowupAppointments,
                pendingFollowupAppointments
        );
    }

    @Override
    @Cacheable(value = "patientStats", key = "#doctorId", unless = "#result == null")
    public PatientStatsDto getPatientStats(String doctorId) {
        LocalDate firstDayOfMonth = LocalDate.now().withDayOfMonth(1);
        LocalDate lastDayOfMonth = firstDayOfMonth.plusMonths(1).minusDays(1);

        long totalPatients = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)),
                        Aggregation.group("patientId")
                ),
                Appointment.class,
                Document.class
        ).getMappedResults().size();

        long newPatients = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)),
                        Aggregation.group("patientId").min("appointmentDate").as("firstVisit"),
                        Aggregation.match(Criteria.where("firstVisit").gte(firstDayOfMonth).lte(lastDayOfMonth))
                ),
                Appointment.class,
                Document.class
        ).getMappedResults().size();

        long returningPatients = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)),
                        Aggregation.group("patientId").count().as("appointmentCount"),
                        Aggregation.match(Criteria.where("appointmentCount").gt(1))
                ),
                Appointment.class,
                Document.class
        ).getMappedResults().size();

        long activePatientsThisMonth = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)
                                .and("appointmentDate").gte(firstDayOfMonth).lte(lastDayOfMonth)),
                        Aggregation.group("patientId")
                ),
                Appointment.class,
                Document.class
        ).getMappedResults().size();

        long patientsWithFollowUps = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                        Aggregation.group("patientId")
                ),
                FollowUp.class,
                Document.class
        ).getMappedResults().size();

        long patientsWithMultipleVisitsThisMonth = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)
                                .and("appointmentDate").gte(firstDayOfMonth).lte(lastDayOfMonth)),
                        Aggregation.group("patientId").count().as("visits"),
                        Aggregation.match(Criteria.where("visits").gt(1))
                ),
                Appointment.class,
                Document.class
        ).getMappedResults().size();

        AggregationResults<Document> avgResults = mongoTemplate.aggregate(
                Aggregation.newAggregation(
                        Aggregation.match(Criteria.where("doctorId").is(doctorId)
                                .and("status").is(AppointmentStatus.COMPLETED)),
                        Aggregation.group("patientId").count().as("visitCount"),
                        Aggregation.group().avg("visitCount").as("avgVisits")
                ),
                Appointment.class,
                Document.class
        );

        double averageVisitsPerPatient = avgResults.getUniqueMappedResult() != null
                ? avgResults.getUniqueMappedResult().getDouble("avgVisits")
                : 0.0;

        return PatientStatsDto
                .builder()
                .totalPatients(totalPatients)
                .newPatientsThisMonth(newPatients)
                .activePatientsThisMonth(activePatientsThisMonth)
                .averageVisitsPerPatient(averageVisitsPerPatient)
                .patientsWithFollowUps(patientsWithFollowUps)
                .patientsWithMultipleVisitsThisMonth(patientsWithMultipleVisitsThisMonth)
                .returningPatients(returningPatients)
                .build();
    }

    @Override
    public List<AppointmentCountByDateDto> getAppointmentCountsByDateRange(
            String doctorId, LocalDate start, LocalDate end) {
        log.info("Fetching appointments for doctor: {} from {} to {}", doctorId, start, end);
        return appointmentRepository
                .countAppointmentsByDoctorAndDateRange(doctorId, start, end);
    }
}
