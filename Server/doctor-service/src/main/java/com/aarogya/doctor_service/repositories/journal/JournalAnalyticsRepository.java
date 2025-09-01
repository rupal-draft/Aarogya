package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalAnalytics;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalAnalyticsRepository extends MongoRepository<JournalAnalytics, String> {

    Optional<JournalAnalytics> findByDoctorIdAndDate(String doctorId, LocalDateTime date);

    List<JournalAnalytics> findByDoctorIdAndDateBetween(String doctorId, LocalDateTime start, LocalDateTime end);
}
