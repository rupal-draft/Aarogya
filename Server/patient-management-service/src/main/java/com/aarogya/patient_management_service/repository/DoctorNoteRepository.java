package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.DoctorNote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DoctorNoteRepository extends MongoRepository<DoctorNote, String> {

    Page<DoctorNote> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    Optional<DoctorNote> findByIdAndPatientId(String id, String patientId);

    Page<DoctorNote> findByPatientIdAndNoteTypeOrderByCreatedAtDesc(String patientId, String noteType, Pageable pageable);

    Page<DoctorNote> findByPatientIdAndPriorityOrderByCreatedAtDesc(String patientId, String priority, Pageable pageable);

    Page<DoctorNote> findByPatientIdAndIsPrivateFalseOrderByCreatedAtDesc(String patientId, Pageable pageable);

    Page<DoctorNote> findByPatientIdAndCategoryOrderByCreatedAtDesc(String patientId, String category, Pageable pageable);

    Page<DoctorNote> findByPatientIdAndIsUrgentTrueOrderByCreatedAtDesc(String patientId, Pageable pageable);

    List<DoctorNote> findByPatientIdAndCreatedAtAfter(String patientId, LocalDateTime date);

    List<DoctorNote> findTop5ByPatientIdOrderByCreatedAtDesc(String patientId);
}
