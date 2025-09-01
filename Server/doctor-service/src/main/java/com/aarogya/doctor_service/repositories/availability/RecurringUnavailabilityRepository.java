package com.aarogya.doctor_service.repositories.availability;

import com.aarogya.doctor_service.models.availability.RecurringUnavailability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecurringUnavailabilityRepository extends MongoRepository<RecurringUnavailability, String> {

    List<RecurringUnavailability> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<RecurringUnavailability> findByDoctorId(String doctorId);

    void deleteByDoctorIdAndIsActiveFalse(String doctorId);
}
