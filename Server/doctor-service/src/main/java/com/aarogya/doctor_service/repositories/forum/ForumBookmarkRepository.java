package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ForumBookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ForumBookmarkRepository extends MongoRepository<ForumBookmark, String> {

    Optional<ForumBookmark> findByDoctorIdAndThreadId(String doctorId, String threadId);

    Page<ForumBookmark> findByDoctorIdOrderByCreatedAtDesc(String doctorId, Pageable pageable);

    Integer countByThreadId(String threadId);

    Boolean existsByDoctorIdAndThreadId(String doctorId, String threadId);

    void deleteByDoctorIdAndThreadId(String doctorId, String threadId);
}