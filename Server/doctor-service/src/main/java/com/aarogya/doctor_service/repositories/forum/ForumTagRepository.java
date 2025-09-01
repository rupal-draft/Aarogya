package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ForumTag;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumTagRepository extends MongoRepository<ForumTag, String> {

    Optional<ForumTag> findByName(String name);

    List<ForumTag> findByIsActiveTrueOrderByThreadCountDesc(Pageable pageable);

    List<ForumTag> findByNameIn(List<String> names);
}
