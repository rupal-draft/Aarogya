package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.RecommendationType;
import com.aarogya.lab_service.model.TestRecommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestRecommendationRepository extends MongoRepository<TestRecommendation, String> {

    List<TestRecommendation> findByPatientIdOrderByCreatedAtDesc(String patientId);

    List<TestRecommendation> findByDoctorIdOrderByCreatedAtDesc(String doctorId);

    List<TestRecommendation> findByTypeOrderByCreatedAtDesc(RecommendationType type);

    List<TestRecommendation> findByPatientIdAndTypeOrderByCreatedAtDesc(String patientId, RecommendationType type);

    List<TestRecommendation> findByIsAcceptedByDoctorTrueAndIsOrderedByDoctorFalse();

    List<TestRecommendation> findByCreatedAtAfterOrderByConfidenceScoreDesc(LocalDateTime date);
}

