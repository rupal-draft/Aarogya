package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ThreadView;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreadViewRepository extends MongoRepository<ThreadView, String> {

    Optional<ThreadView> findByThreadIdAndDoctorId(String threadId, String doctorId);

    Integer countByThreadId(String threadId);

    List<ThreadView> findByDoctorIdOrderByViewedAtDesc(String doctorId, Pageable pageable);
}