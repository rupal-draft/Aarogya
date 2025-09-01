package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalTemplateRepository extends MongoRepository<JournalTemplate, String> {

    List<JournalTemplate> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<JournalTemplate> findByIsSystemTrueAndIsActiveTrue();

    List<JournalTemplate> findByDoctorIdOrIsSystemTrueAndIsActiveTrue(String doctorId);

    Optional<JournalTemplate> findByDoctorIdAndNameAndIsActiveTrue(String doctorId, String name);

    Page<JournalTemplate> findByDoctorIdAndIsActiveTrue(String doctorId, Pageable pageable);
}
