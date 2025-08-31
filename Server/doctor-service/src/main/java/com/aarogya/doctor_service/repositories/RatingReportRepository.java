package com.aarogya.doctor_service.repositories;

import com.aarogya.doctor_service.models.RatingReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingReportRepository extends MongoRepository<RatingReport, String> {

    Page<RatingReport> findByRatingId(String ratingId, Pageable pageable);

    Integer countByRatingId(String ratingId);

    Boolean existsByRatingIdAndReporterId(String ratingId, String reporterId);

    List<RatingReport> findByIsResolvedFalse();
}
