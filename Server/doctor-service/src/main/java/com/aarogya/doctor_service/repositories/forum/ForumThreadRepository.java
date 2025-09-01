package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ForumThread;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForumThreadRepository extends MongoRepository<ForumThread, String>, ThreadRepositoryCustom {

    Page<ForumThread> findByIsActiveTrue(Pageable pageable);

    Page<ForumThread> findByAuthorIdAndIsActiveTrue(String authorId, Pageable pageable);

    Page<ForumThread> findByTagsInAndIsActiveTrue(List<String> tags, Pageable pageable);

    Page<ForumThread> findByTypeAndIsActiveTrue(String type, Pageable pageable);

    @Query("{'isActive': true, '$or': [{'title': {$regex: ?0, $options: 'i'}}, {'content': {$regex: ?0, $options: 'i'}}]}")
    Page<ForumThread> search(String searchQuery, Pageable pageable);

    @Query("{'isActive': true, 'tags': {$in: ?0}, 'type': ?1}")
    Page<ForumThread> findByTagsInAndType(List<String> tags, String type, Pageable pageable);

    List<ForumThread> findTop10ByIsActiveTrueOrderByCreatedAtDesc();

    List<ForumThread> findTop10ByIsActiveTrueOrderByReplyCountDesc();

    List<ForumThread> findTop10ByIsActiveTrueOrderByUpvoteCountDesc();

    Integer countByAuthorIdAndIsActiveTrue(String authorId);

    Integer countByTagsContainingAndIsActiveTrue(String tag);

    boolean existsByIdAndIsActiveTrue(String threadId);

    Integer countByIsActiveTrue();
}