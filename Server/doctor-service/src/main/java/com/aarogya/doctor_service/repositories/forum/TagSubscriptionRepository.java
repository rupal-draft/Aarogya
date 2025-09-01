package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.TagSubscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TagSubscriptionRepository extends MongoRepository<TagSubscription, String> {

    Optional<TagSubscription> findByDoctorIdAndTagId(String doctorId, String tagId);

    List<TagSubscription> findByDoctorId(String doctorId);

    Page<TagSubscription> findByDoctorIdOrderBySubscribedAtDesc(String doctorId, Pageable pageable);

    Integer countByTagId(String tagId);

    Boolean existsByDoctorIdAndTagId(String doctorId, String tagId);

    void deleteByDoctorIdAndTagId(String doctorId, String tagId);
}
