package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalBookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JournalBookmarkRepository extends MongoRepository<JournalBookmark, String> {

    Optional<JournalBookmark> findByDoctorIdAndEntryId(String doctorId, String entryId);

    Page<JournalBookmark> findByDoctorIdOrderByBookmarkedAtDesc(String doctorId, Pageable pageable);

    Boolean existsByDoctorIdAndEntryId(String doctorId, String entryId);

    void deleteByDoctorIdAndEntryId(String doctorId, String entryId);

    Integer countByDoctorId(String doctorId);
}
