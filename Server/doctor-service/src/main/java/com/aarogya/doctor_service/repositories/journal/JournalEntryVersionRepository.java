package com.aarogya.doctor_service.repositories.journal;

import com.aarogya.doctor_service.models.journal.JournalEntryVersion;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JournalEntryVersionRepository extends MongoRepository<JournalEntryVersion, String> {

    List<JournalEntryVersion> findByEntryIdOrderByVersionDesc(String entryId);

    Optional<JournalEntryVersion> findByEntryIdAndVersion(String entryId, Integer version);

    void deleteByEntryId(String entryId);

    Integer countByEntryId(String entryId);
}
