package com.aarogya.doctor_service.repositories.availability;

import com.aarogya.doctor_service.models.availability.DoctorAvailability;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends MongoRepository<DoctorAvailability, String> {

    Optional<DoctorAvailability> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<DoctorAvailability> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    List<DoctorAvailability> findByDoctorIdAndDateGreaterThanEqual(String doctorId, LocalDate date);

    List<DoctorAvailability> findByDoctorIdAndIsAvailableTrueAndDateGreaterThanEqual(String doctorId, LocalDate date);

    Page<DoctorAvailability> findByDoctorId(String doctorId, Pageable pageable);

    Boolean existsByDoctorIdAndDateAndIsAvailableTrue(String doctorId, LocalDate date);

    @Query("{'doctorId': ?0, 'date': {$gte: ?1}, 'timeSlots': {$elemMatch: {'availableSlots': {$gt: 0}}}}")
    List<DoctorAvailability> findAvailableSlots(String doctorId, LocalDate fromDate);

    void deleteByDoctorIdAndDateBefore(String doctorId, LocalDate date);
}