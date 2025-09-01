package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalReminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface JournalReminderRepository extends MongoRepository<JournalReminder, String> {

    List<JournalReminder> findByDoctorIdAndIsActiveTrue(String doctorId);

    List<JournalReminder> findByDoctorIdAndReminderDateBetweenAndIsActiveTrue(
            String doctorId, LocalDateTime start, LocalDateTime end);

    List<JournalReminder> findByDoctorIdAndReminderDateBeforeAndIsActiveTrue(
            String doctorId, LocalDateTime date);

    Optional<JournalReminder> findByDoctorIdAndEntryId(String doctorId, String entryId);

    void deleteByDoctorIdAndEntryId(String doctorId, String entryId);
}
