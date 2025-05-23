package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.DoctorAvailability;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorAvailabilityRepository extends MongoRepository<DoctorAvailability, String> {

    List<DoctorAvailability> findByDoctorId(String doctorId);

    Optional<DoctorAvailability> findByDoctorIdAndDayOfWeek(String doctorId, Integer dayOfWeek);
}
