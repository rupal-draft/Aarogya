package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.CollectionStatus;
import com.aarogya.lab_service.model.SampleCollection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SampleCollectionRepository extends MongoRepository<SampleCollection, String> {

    // Find collections by patient
    Page<SampleCollection> findByPatientIdOrderByScheduledTimeDesc(String patientId, Pageable pageable);

    // Find collections by technician
    List<SampleCollection> findByTechnicianIdOrderByScheduledTimeAsc(String technicianId);

    // Find collections by status
    Page<SampleCollection> findByStatusOrderByScheduledTimeAsc(CollectionStatus status, Pageable pageable);

    // Find collection by order
    Optional<SampleCollection> findByOrderId(String orderId);

    // Find scheduled collections for today
    @Query("{ 'status': 'SCHEDULED', 'scheduledTime': { $gte: ?0, $lt: ?1 } }")
    List<SampleCollection> findScheduledCollectionsForDate(LocalDateTime startOfDay, LocalDateTime endOfDay);

    // Find overdue collections
    @Query("{ 'status': 'SCHEDULED', 'scheduledTime': { $lt: ?0 } }")
    List<SampleCollection> findOverdueCollections(LocalDateTime currentTime);

    // Find home collections
    List<SampleCollection> findByIsHomeCollectionTrueAndStatusOrderByScheduledTimeAsc(CollectionStatus status);

    // Find collections by date range
    List<SampleCollection> findByScheduledTimeBetweenOrderByScheduledTimeAsc(LocalDateTime startDate, LocalDateTime endDate);

    // Count collections by status
    long countByStatus(CollectionStatus status);

    // Count collections by technician
    long countByTechnicianId(String technicianId);
}
