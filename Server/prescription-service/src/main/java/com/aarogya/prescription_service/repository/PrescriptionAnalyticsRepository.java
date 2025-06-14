package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.PrescriptionAnalytics;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionAnalyticsRepository extends MongoRepository<PrescriptionAnalytics, String> {

    Optional<PrescriptionAnalytics> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<PrescriptionAnalytics> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    @Aggregation(pipeline = {
            "{ $match: { doctorId: ?0, date: { $gte: ?1, $lte: ?2 } } }",
            "{ $group: { " +
                    "_id: null, " +
                    "totalPrescriptions: { $sum: '$totalPrescriptions' }, " +
                    "totalValue: { $sum: '$totalPrescriptionValue' }, " +
                    "avgValue: { $avg: '$averagePrescriptionValue' } " +
                    "} }"
    })
    AggregatedAnalytics getAggregatedAnalytics(String doctorId, LocalDate startDate, LocalDate endDate);

    interface AggregatedAnalytics {
        Integer getTotalPrescriptions();
        Double getTotalValue();
        Double getAvgValue();
    }

    @Query("{ 'date': { $gte: ?0, $lte: ?1 } }")
    List<PrescriptionAnalytics> findByDateRange(LocalDate startDate, LocalDate endDate);

    void deleteByDateBefore(LocalDate cutoffDate);
}
