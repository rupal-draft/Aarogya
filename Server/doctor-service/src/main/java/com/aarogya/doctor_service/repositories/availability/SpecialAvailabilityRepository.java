package com.aarogya.doctor_service.repositories.availability;

import com.aarogya.doctor_service.models.availability.SpecialAvailability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SpecialAvailabilityRepository extends MongoRepository<SpecialAvailability, String> {

    Optional<SpecialAvailability> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<SpecialAvailability> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    List<SpecialAvailability> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<SpecialAvailability> findByDoctorIdAndDateBetweenAndIsActiveTrue(String doctorId, LocalDate start, LocalDate end);
}
