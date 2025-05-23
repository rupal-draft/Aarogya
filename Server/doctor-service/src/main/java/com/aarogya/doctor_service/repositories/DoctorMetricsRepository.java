package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.DoctorMetrics;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorMetricsRepository extends MongoRepository<DoctorMetrics, String> {

    Optional<DoctorMetrics> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<DoctorMetrics> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, date: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: null, " +
                    "totalAppointments: { $sum: '$appointmentsCompleted' }, " +
                    "totalCancellations: { $sum: '$appointmentsCancelled' }, " +
                    "totalNewPatients: { $sum: '$newPatients' }, " +
                    "totalReturningPatients: { $sum: '$returningPatients' }, " +
                    "avgConsultationTime: { $avg: '$averageConsultationTime' }, " +
                    "avgWaitTime: { $avg: '$averageWaitTime' }, " +
                    "totalPrescriptions: { $sum: '$prescriptionsIssued' }, " +
                    "totalRatings: { $sum: '$ratingsReceived' }, " +
                    "avgRating: { $avg: '$averageRating' } " +
                    "} }"
    })
    AggregatedMetrics getAggregatedMetrics(String doctorId, LocalDate startDate, LocalDate endDate);

    interface AggregatedMetrics {
        Integer getTotalAppointments();
        Integer getTotalCancellations();
        Integer getTotalNewPatients();
        Integer getTotalReturningPatients();
        Double getAvgConsultationTime();
        Double getAvgWaitTime();
        Integer getTotalPrescriptions();
        Integer getTotalRatings();
        Double getAvgRating();
    }

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, date: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: '$date', " +
                    "appointmentsCompleted: { $sum: '$appointmentsCompleted' }, " +
                    "appointmentsCancelled: { $sum: '$appointmentsCancelled' } " +
                    "} }",
            "{ $sort: { _id: 1 } }"
    })
    List<DailyAppointmentMetrics> getDailyAppointmentMetrics(String doctorId, LocalDate startDate, LocalDate endDate);

    interface DailyAppointmentMetrics {
        LocalDate getId();
        Integer getAppointmentsCompleted();
        Integer getAppointmentsCancelled();
    }

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, date: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: '$date', " +
                    "averageRating: { $avg: '$averageRating' }, " +
                    "ratingsReceived: { $sum: '$ratingsReceived' } " +
                    "} }",
            "{ $sort: { _id: 1 } }"
    })
    List<DailyRatingMetrics> getDailyRatingMetrics(String doctorId, LocalDate startDate, LocalDate endDate);

    interface DailyRatingMetrics {
        LocalDate getId();
        Double getAverageRating();
        Integer getRatingsReceived();
    }
}