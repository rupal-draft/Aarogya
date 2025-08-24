package com.aarogya.patient_management_service.repository;

import com.aarogya.patient_management_service.model.DoctorNote;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorNoteRepository extends MongoRepository<DoctorNote, String> {

    Page<DoctorNote> findByPatientIdAndIsPrivateFalseOrderByCreatedAtDesc(String patientId, Pageable pageable);

    Page<DoctorNote> findByPatientIdOrderByCreatedAtDesc(String patientId, Pageable pageable);

    @Query("{'patientId': ?0, 'noteType': ?1, 'isPrivate': false}")
    List<DoctorNote> findByPatientIdAndNoteType(String patientId, String noteType);

    @Query("{'patientId': ?0, 'priority': {$in: ?1}, 'isPrivate': false}")
    List<DoctorNote> findByPatientIdAndPriorityIn(String patientId, List<String> priorities);

    long countByPatientIdAndIsPrivateFalse(String patientId);
}
