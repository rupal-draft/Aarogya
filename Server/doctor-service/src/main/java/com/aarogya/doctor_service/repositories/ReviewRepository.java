package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    List<Review> findByDoctorIdAndStatus(String doctorId, String status);

    List<Review> findByDoctorId(String doctorId);
}
