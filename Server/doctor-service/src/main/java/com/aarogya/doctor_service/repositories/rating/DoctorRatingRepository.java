package com.aarogya.doctor_service.repositories.rating;

import com.aarogya.doctor_service.models.rating.DoctorRating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRatingRepository extends MongoRepository<DoctorRating, String> {

    Optional<DoctorRating> findByDoctorIdAndPatientId(String doctorId, String patientId);

    Page<DoctorRating> findByDoctorId(String doctorId, Pageable pageable);

    Page<DoctorRating> findByDoctorIdAndRatingBetween(String doctorId, Integer minRating, Integer maxRating, Pageable pageable);

    @Query("{'doctorId': ?0, 'tags': { $in: ?1 }}")
    Page<DoctorRating> findByDoctorIdAndTagsIn(String doctorId, List<String> tags, Pageable pageable);

    @Query("{'doctorId': ?0, 'wouldRecommend': ?1}")
    Page<DoctorRating> findByDoctorIdAndWouldRecommend(String doctorId, Boolean wouldRecommend, Pageable pageable);

    List<DoctorRating> findByDoctorIdAndIsActiveTrue(String doctorId);

    Integer countByDoctorId(String doctorId);

    Integer countByDoctorIdAndRating(String doctorId, Integer rating);

    @Query(value = "{'doctorId': ?0}", count = true)
    Long countByDoctorIdWithReview(String doctorId);

    @Query(value = "{'doctorId': ?0, 'wouldRecommend': true}", count = true)
    Long countByDoctorIdAndWouldRecommendTrue(String doctorId);
}
