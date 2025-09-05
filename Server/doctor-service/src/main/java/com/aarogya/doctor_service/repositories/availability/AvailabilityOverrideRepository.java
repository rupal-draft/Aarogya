package com.aarogya.doctor_service.repositories.availability;

import com.aarogya.doctor_service.models.availability.AvailabilityOverride;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityOverrideRepository extends MongoRepository<AvailabilityOverride, String> {

    Optional<AvailabilityOverride> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<AvailabilityOverride> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    List<AvailabilityOverride> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<AvailabilityOverride> findByDoctorIdAndDateBetweenAndIsActiveTrue(String doctorId, LocalDate start, LocalDate end);
}