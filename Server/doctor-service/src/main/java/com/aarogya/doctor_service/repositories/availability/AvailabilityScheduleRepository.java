package com.aarogya.doctor_service.repositories.availability;

import com.aarogya.doctor_service.models.availability.AvailabilitySchedule;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvailabilityScheduleRepository extends MongoRepository<AvailabilitySchedule, String> {

    Optional<AvailabilitySchedule> findByDoctorId(String doctorId);

    Optional<AvailabilitySchedule> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<AvailabilitySchedule> findByDoctorIdIn(List<String> doctorIds);
}
