package com.aarogya.appointment_service.repository;

import com.aarogya.appointment_service.models.Appointment;
import com.aarogya.appointment_service.models.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    Page<Appointment> findByPatientId(String patientId, Pageable pageable);
    Page<Appointment> findByDoctorId(String doctorId, Pageable pageable);

    Page<Appointment> findByPatientIdAndStatus(String patientId, AppointmentStatus status, Pageable pageable);
    Page<Appointment> findByDoctorIdAndStatus(String doctorId, AppointmentStatus status, Pageable pageable);

    Page<Appointment> findByPatientIdAndAppointmentDate(String patientId, LocalDate appointmentDate, Pageable pageable);
    Page<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate, Pageable pageable);

    Page<Appointment> findByPatientIdAndStatusAndAppointmentDate(
            String patientId, AppointmentStatus status, LocalDate appointmentDate, Pageable pageable);
    Page<Appointment> findByDoctorIdAndStatusAndAppointmentDate(
            String doctorId, AppointmentStatus status, LocalDate appointmentDate, Pageable pageable);

    Optional<Appointment> findByIdAndDoctorId(String id, String doctorId);
    Optional<Appointment> findByIdAndPatientId(String id, String patientId);

    @Query("""
        {
            'doctorId': ?0,
            'appointmentDate': ?1,
            'status': { $in: ['PENDING', 'APPROVED'] },
            'id': { $ne: ?4 },
            $or: [
                { $and: [
                    { 'startTime': { $lte: ?2 } },
                    { 'endTime': { $gt: ?2 } }
                ]},
                { $and: [
                    { 'startTime': { $lt: ?3 } },
                    { 'endTime': { $gte: ?3 } }
                ]},
                { $and: [
                    { 'startTime': { $gte: ?2 } },
                    { 'endTime': { $lte: ?3 } }
                ]}
            ]
        }
        """)
    List<Appointment> findConflictingAppointments(String doctorId, LocalDate date,
                                                  LocalTime startTime, LocalTime endTime, String excludeId);

    @Query("{ 'appointmentDate': { $gte: ?0 }, 'status': { $in: ['PENDING', 'APPROVED'] } }")
    List<Appointment> findUpcomingAppointments(LocalDate fromDate);

    List<Appointment> findByDoctorIdAndAppointmentDateBetween(String doctorId,
                                                              LocalDate startDate,
                                                              LocalDate endDate,
                                                              Sort sort);

    List<Appointment> findByPatientIdAndAppointmentDateBetween(String patientId,
                                                               LocalDate startDate,
                                                               LocalDate endDate,
                                                               Sort sort);

    long countByDoctorIdAndStatus(String doctorId, AppointmentStatus status);
    long countByPatientIdAndStatus(String patientId, AppointmentStatus status);

    @Query("{ 'doctorId': ?0, 'appointmentDate': ?1, 'status': { $in: ['PENDING', 'APPROVED', 'IN_PROGRESS'] } }")
    List<Appointment> findTodayAppointmentsByDoctor(String doctorId, LocalDate today);
}
