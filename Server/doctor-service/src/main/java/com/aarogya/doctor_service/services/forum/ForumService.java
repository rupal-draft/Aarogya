package com.aarogya.doctor_service.services.forum;

import com.aarogya.doctor_service.dto.common.PagedResponse;
import com.aarogya.doctor_service.dto.forum.request.*;
import com.aarogya.doctor_service.dto.forum.response.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ForumService {
    ThreadResponse createThread(CreateThreadRequest request);
    ThreadResponse getThread(String threadId);
    PagedResponse<ThreadSummaryResponse> getThreads(ThreadFilterRequest filter, Pageable pageable);
    ThreadResponse updateThread(String threadId, UpdateThreadRequest request);
    void deleteThread(String threadId);
    ReplyResponse createReply(String threadId, CreateReplyRequest request);
    PagedResponse<ReplyResponse> getReplies(String threadId, Pageable pageable);
    ReplyResponse updateReply(String replyId, CreateReplyRequest request);
    void deleteReply(String replyId);
    BookmarkResponse bookmarkThread(String threadId);
    void removeBookmark(String threadId);
    Page<BookmarkResponse> getBookmarks(Pageable pageable);
    VoteResponse voteThread(String threadId, VoteRequest request);
    VoteResponse voteReply(String replyId, VoteRequest request);
    void markAsSolution(String replyId);
    ForumStatsResponse getForumStats();
    List<TagResponse> getPopularTags();
    TagResponse subscribeToTag(String tagName);
    void unsubscribeFromTag(String tagName);
    PagedResponse<ThreadSummaryResponse> getSubscribedTagsThreads(Pageable pageable);
    void recordThreadView(String threadId);
}
