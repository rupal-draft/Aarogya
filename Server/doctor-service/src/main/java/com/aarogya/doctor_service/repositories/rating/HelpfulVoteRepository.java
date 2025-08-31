package com.aarogya.doctor_service.repositories.rating;

import com.aarogya.doctor_service.models.rating.HelpfulVote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HelpfulVoteRepository extends MongoRepository<HelpfulVote, String> {

    Optional<HelpfulVote> findByRatingIdAndPatientId(String ratingId, String patientId);

    Integer countByRatingId(String ratingId);

    Boolean existsByRatingIdAndPatientId(String ratingId, String patientId);

    void deleteByRatingIdAndPatientId(String ratingId, String patientId);
}
