package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ForumReply;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumReplyRepository extends MongoRepository<ForumReply, String> {

    Page<ForumReply> findByThreadIdAndIsActiveTrueOrderByCreatedAtAsc(String threadId, Pageable pageable);

    Page<ForumReply> findByThreadIdAndParentReplyIdIsNullAndIsActiveTrueOrderByCreatedAtAsc(String threadId, Pageable pageable);

    List<ForumReply> findByThreadIdAndIsActiveTrue(String threadId);

    List<ForumReply> findByParentReplyIdAndIsActiveTrue(String parentReplyId);

    Integer countByThreadIdAndIsActiveTrue(String threadId);

    Integer countByAuthorIdAndIsActiveTrue(String authorId);

    Optional<ForumReply> findByThreadIdAndIsSolutionTrue(String threadId);

    List<ForumReply> findByAuthorIdAndIsActiveTrueOrderByCreatedAtDesc(String authorId, Pageable pageable);
}