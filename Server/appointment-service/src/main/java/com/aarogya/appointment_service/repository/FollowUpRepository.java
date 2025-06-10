package com.aarogya.appointment_service.repository;

import com.aarogya.appointment_service.models.FollowUp;
import com.aarogya.appointment_service.models.enums.FollowUpStatus;
import jakarta.validation.constraints.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FollowUpRepository extends MongoRepository<FollowUp, String> {

    Optional<FollowUp> findByIdAndDoctorId(String id, String doctorId);
    Optional<FollowUp> findByIdAndPatientId(String id, String patientId);

    List<FollowUp> findByOriginalAppointmentIdOrderByRecommendedDateAsc(String originalAppointmentId);
    Page<FollowUp> findByOriginalAppointmentId(String originalAppointmentId, Pageable pageable);

    Page<FollowUp> findByStatus(FollowUpStatus status, Pageable pageable);
    Page<FollowUp> findByStatusOrderByRecommendedDateAsc(FollowUpStatus status, Pageable pageable);
    Page<FollowUp> findByStatusAndRecommendedDateBetween(FollowUpStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable);
    long countByStatus(FollowUpStatus status);

    Page<FollowUp> findByDoctorId(String doctorId, Pageable pageable);
    Page<FollowUp> findByDoctorIdAndStatus(String doctorId, FollowUpStatus status, Pageable pageable);
    Page<FollowUp> findByDoctorIdAndRecommendedDateBetween(String doctorId, LocalDate startDate, LocalDate endDate, Pageable pageable);
    Page<FollowUp> findByDoctorIdAndStatusAndRecommendedDateBetween(String doctorId, FollowUpStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<FollowUp> findByPatientId(String patientId, Pageable pageable);
    Page<FollowUp> findByPatientIdAndStatus(String patientId, FollowUpStatus status, Pageable pageable);
    Page<FollowUp> findByPatientIdAndRecommendedDateBetween(String patientId, LocalDate startDate, LocalDate endDate, Pageable pageable);
    Page<FollowUp> findByPatientIdAndStatusAndRecommendedDateBetween(String patientId, FollowUpStatus status, LocalDate startDate, LocalDate endDate, Pageable pageable);

    Page<FollowUp> findByRecommendedDateBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
    List<FollowUp> findByRecommendedDateBetweenOrderByRecommendedDateAsc(LocalDate startDate, LocalDate endDate);

    @Query("{ 'status': 'PENDING', 'recommendedDate': { $lt: ?0 } }")
    List<FollowUp> findOverdueFollowUps(LocalDate currentDate);

    @Query("{ 'status': 'PENDING', 'recommendedDate': { $gte: ?0, $lte: ?1 } }")
    List<FollowUp> findUpcomingFollowUps(LocalDate startDate, LocalDate endDate);

    Page<FollowUp> findByUrgencyLevel(Integer urgencyLevel, Pageable pageable);
    Page<FollowUp> findByStatusAndUrgencyLevel(FollowUpStatus status, Integer urgencyLevel, Pageable pageable);

    @Query("""
        {
            $and: [
                { ?0: ?1 },
                { ?2: ?3 },
                { ?4: ?5 }
            ]
        }
        """)
    Page<FollowUp> findByMultipleCriteria(String field1, Object value1,
                                          String field2, Object value2,
                                          String field3, Object value3,
                                          Pageable pageable);

    List<FollowUp> findByDoctorIdAndStatusAndUrgencyLevelGreaterThanEqual(@NotBlank String doctorId, FollowUpStatus followUpStatus, @Min(1) @Max(5) Integer urgencyLevel, Sort recommendedDate);

    boolean existsByOriginalAppointmentIdAndRecommendedDate(String originalAppointmentId, @NotNull(message = "Recommended date is required") @Future(message = "Recommended date must be in the future") LocalDate recommendedDate);
}
