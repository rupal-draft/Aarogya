package com.aarogya.appointment_service.repository;

import com.aarogya.appointment_service.dto.grpc.AppointmentCountByDateDto;
import com.aarogya.appointment_service.enums.AppointmentStatus;
import com.aarogya.appointment_service.models.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.Aggregation;
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

    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate appointmentDate);

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

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, appointmentDate: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { _id: '$appointmentDate', count: { $sum: 1 } } }",
            "{ $project: { date: '$_id', count: 1, _id: 0 } }",
            "{ $sort: { date: 1 } }"
    })
    List<AppointmentCountByDateDto> countAppointmentsByDoctorAndDateRange(
            String doctorId, LocalDate start, LocalDate end
    );
}
