package com.aarogya.doctor_service.repositories.rating;

import com.aarogya.doctor_service.models.rating.DoctorRatingSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRatingSummaryRepository extends MongoRepository<DoctorRatingSummary, String> {

    Optional<DoctorRatingSummary> findByDoctorId(String doctorId);

    List<DoctorRatingSummary> findByDoctorIdIn(List<String> doctorIds);
}