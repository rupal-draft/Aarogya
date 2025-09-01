package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.models.forum.ForumVote;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ForumVoteRepository extends MongoRepository<ForumVote, String> {

    Optional<ForumVote> findByDoctorIdAndThreadId(String doctorId, String threadId);

    Optional<ForumVote> findByDoctorIdAndReplyId(String doctorId, String replyId);

    List<ForumVote> findByThreadIdAndVoteValue(String threadId, Integer voteValue);

    List<ForumVote> findByReplyIdAndVoteValue(String replyId, Integer voteValue);

    Integer countByThreadIdAndVoteValue(String threadId, Integer voteValue);

    Integer countByReplyIdAndVoteValue(String replyId, Integer voteValue);

    void deleteByDoctorIdAndThreadId(String doctorId, String threadId);

    void deleteByDoctorIdAndReplyId(String doctorId, String replyId);
}
