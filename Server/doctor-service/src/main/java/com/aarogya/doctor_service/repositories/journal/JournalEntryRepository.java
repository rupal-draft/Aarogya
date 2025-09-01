package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JournalEntryRepository extends MongoRepository<JournalEntry, String> {

    Page<JournalEntry> findByDoctorIdAndIsActiveTrue(String doctorId, Pageable pageable);

    Page<JournalEntry> findByDoctorId(String doctorId, Pageable pageable);

    Page<JournalEntry> findByDoctorIdAndPatientIdAndIsActiveTrue(String doctorId, String patientId, Pageable pageable);

    Page<JournalEntry> findByDoctorIdAndTagsInAndIsActiveTrue(String doctorId, List<String> tags, Pageable pageable);

    Page<JournalEntry> findByDoctorIdAndTypeAndIsActiveTrue(String doctorId, String type, Pageable pageable);

    Page<JournalEntry> findByDoctorIdAndIsBookmarkedTrueAndIsActiveTrue(String doctorId, Pageable pageable);

    Page<JournalEntry> findByDoctorIdAndIsPinnedTrueAndIsActiveTrue(String doctorId, Pageable pageable);

    @Query("{'doctorId': ?0, 'isActive': true, '$or': ["
            + "{'title': {$regex: ?1, $options: 'i'}}, "
            + "{'content': {$regex: ?1, $options: 'i'}}, "
            + "{'tags': {$regex: ?1, $options: 'i'}}"
            + "]}")
    Page<JournalEntry> search(String doctorId, String searchQuery, Pageable pageable);

    @Query("{'doctorId': ?0, 'isActive': true, 'reminderDate': {$ne: null, $gte: ?1, $lte: ?2}}")
    List<JournalEntry> findUpcomingReminders(String doctorId, LocalDateTime start, LocalDateTime end);

    List<JournalEntry> findByDoctorIdAndReminderDateBeforeAndIsActiveTrue(String doctorId, LocalDateTime date);

    Integer countByDoctorIdAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndPatientIdNotNullAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndIsBookmarkedTrueAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndIsPinnedTrueAndIsActiveTrue(String doctorId);

    @Query(value = "{'doctorId': ?0, 'isActive': true}", fields = "{'tags': 1}")
    List<JournalEntry> findTagsByDoctorId(String doctorId);
}
