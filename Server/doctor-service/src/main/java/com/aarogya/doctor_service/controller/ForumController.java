package com.aarogya.doctor_service.controller;

import com.aarogya.doctor_service.dto.forum.request.*;
import com.aarogya.doctor_service.dto.forum.response.*;
import com.aarogya.doctor_service.services.forum.ForumService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/forum")
@Slf4j
@RequiredArgsConstructor
@Validated
public class ForumController {

    private final ForumService forumService;

    @PostMapping("/threads")
    @CircuitBreaker(name = "forumController", fallbackMethod = "createThreadFallback")
    @RateLimiter(name = "forumController")
    public ResponseEntity<ThreadResponse> createThread(@Valid @RequestBody CreateThreadRequest request) {
        log.info("Creating new forum thread");
        ThreadResponse response = forumService.createThread(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/threads/{threadId}")
    public ResponseEntity<ThreadResponse> getThread(@PathVariable String threadId) {
        log.debug("Fetching thread: {}", threadId);
        ThreadResponse response = forumService.getThread(threadId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/threads")
    public ResponseEntity<Page<ThreadSummaryResponse>> getThreads(
            @ModelAttribute ThreadFilterRequest filter,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortOrder) {

        log.debug("Fetching threads with filter: {}", filter);
        Sort sort = sortOrder.equalsIgnoreCase("ASC") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ThreadSummaryResponse> response = forumService.getThreads(filter, pageable);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/threads/{threadId}")
    @CircuitBreaker(name = "forumController", fallbackMethod = "updateThreadFallback")
    public ResponseEntity<ThreadResponse> updateThread(
            @PathVariable String threadId,
            @Valid @RequestBody UpdateThreadRequest request) {
        log.info("Updating thread: {}", threadId);
        ThreadResponse response = forumService.updateThread(threadId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/threads/{threadId}")
    public ResponseEntity<Void> deleteThread(@PathVariable String threadId) {
        log.info("Deleting thread: {}", threadId);
        forumService.deleteThread(threadId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/threads/{threadId}/replies")
    @CircuitBreaker(name = "forumController", fallbackMethod = "createReplyFallback")
    public ResponseEntity<ReplyResponse> createReply(
            @PathVariable String threadId,
            @Valid @RequestBody CreateReplyRequest request) {
        log.info("Creating reply for thread: {}", threadId);
        ReplyResponse response = forumService.createReply(threadId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/threads/{threadId}/replies")
    public ResponseEntity<Page<ReplyResponse>> getReplies(
            @PathVariable String threadId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {

        log.debug("Fetching replies for thread: {}", threadId);
        Pageable pageable = PageRequest.of(page, size);
        Page<ReplyResponse> response = forumService.getReplies(threadId, pageable);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/replies/{replyId}")
    @CircuitBreaker(name = "forumController", fallbackMethod = "updateReplyFallback")
    public ResponseEntity<ReplyResponse> updateReply(
            @PathVariable String replyId,
            @Valid @RequestBody CreateReplyRequest request) {
        log.info("Updating reply: {}", replyId);
        ReplyResponse response = forumService.updateReply(replyId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/replies/{replyId}")
    public ResponseEntity<Void> deleteReply(@PathVariable String replyId) {
        log.info("Deleting reply: {}", replyId);
        forumService.deleteReply(replyId);
        return ResponseEntity.noContent().build();
    }

    // Bookmark endpoints
    @PostMapping("/threads/{threadId}/bookmark")
    @CircuitBreaker(name = "forumController", fallbackMethod = "bookmarkThreadFallback")
    public ResponseEntity<BookmarkResponse> bookmarkThread(@PathVariable String threadId) {
        log.info("Bookmarking thread: {}", threadId);
        BookmarkResponse response = forumService.bookmarkThread(threadId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/threads/{threadId}/bookmark")
    public ResponseEntity<Void> removeBookmark(@PathVariable String threadId) {
        log.info("Removing bookmark for thread: {}", threadId);
        forumService.removeBookmark(threadId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<Page<BookmarkResponse>> getBookmarks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching bookmarks");
        Pageable pageable = PageRequest.of(page, size);
        Page<BookmarkResponse> response = forumService.getBookmarks(pageable);
        return ResponseEntity.ok(response);
    }

    // Vote endpoints
    @PostMapping("/threads/{threadId}/vote")
    @CircuitBreaker(name = "forumController", fallbackMethod = "voteThreadFallback")
    public ResponseEntity<VoteResponse> voteThread(
            @PathVariable String threadId,
            @Valid @RequestBody VoteRequest request) {
        log.info("Voting on thread: {}", threadId);
        VoteResponse response = forumService.voteThread(threadId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/replies/{replyId}/vote")
    @CircuitBreaker(name = "forumController", fallbackMethod = "voteReplyFallback")
    public ResponseEntity<VoteResponse> voteReply(
            @PathVariable String replyId,
            @Valid @RequestBody VoteRequest request) {
        log.info("Voting on reply: {}", replyId);
        VoteResponse response = forumService.voteReply(replyId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/replies/{replyId}/solution")
    public ResponseEntity<Void> markAsSolution(@PathVariable String replyId) {
        log.info("Marking reply as solution: {}", replyId);
        forumService.markAsSolution(replyId);
        return ResponseEntity.ok().build();
    }

    // Tag endpoints
    @GetMapping("/tags")
    public ResponseEntity<List<TagResponse>> getPopularTags() {
        log.debug("Fetching popular tags");
        List<TagResponse> response = forumService.getPopularTags();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/tags/{tagName}/subscribe")
    public ResponseEntity<TagResponse> subscribeToTag(@PathVariable String tagName) {
        log.info("Subscribing to tag: {}", tagName);
        TagResponse response = forumService.subscribeToTag(tagName);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/tags/{tagName}/subscribe")
    public ResponseEntity<Void> unsubscribeFromTag(@PathVariable String tagName) {
        log.info("Unsubscribing from tag: {}", tagName);
        forumService.unsubscribeFromTag(tagName);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tags/subscribed/threads")
    public ResponseEntity<Page<ThreadSummaryResponse>> getSubscribedTagsThreads(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Fetching threads from subscribed tags");
        Pageable pageable = PageRequest.of(page, size);
        Page<ThreadSummaryResponse> response = forumService.getSubscribedTagsThreads(pageable);
        return ResponseEntity.ok(response);
    }

    // Stats endpoint
    @GetMapping("/stats")
    public ResponseEntity<ForumStatsResponse> getForumStats() {
        log.debug("Fetching forum statistics");
        ForumStatsResponse response = forumService.getForumStats();
        return ResponseEntity.ok(response);
    }

    // View tracking
    @PostMapping("/threads/{threadId}/view")
    public ResponseEntity<Void> recordThreadView(@PathVariable String threadId) {
        log.debug("Recording view for thread: {}", threadId);
        forumService.recordThreadView(threadId);
        return ResponseEntity.ok().build();
    }

    // Fallback methods
    public ResponseEntity<ThreadResponse> createThreadFallback(CreateThreadRequest request, Throwable t) {
        log.error("Fallback triggered for createThread: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<ThreadResponse> updateThreadFallback(String threadId, UpdateThreadRequest request, Throwable t) {
        log.error("Fallback triggered for updateThread: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<ReplyResponse> createReplyFallback(String threadId, CreateReplyRequest request, Throwable t) {
        log.error("Fallback triggered for createReply: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<ReplyResponse> updateReplyFallback(String replyId, CreateReplyRequest request, Throwable t) {
        log.error("Fallback triggered for updateReply: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<BookmarkResponse> bookmarkThreadFallback(String threadId, Throwable t) {
        log.error("Fallback triggered for bookmarkThread: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<VoteResponse> voteThreadFallback(String threadId, VoteRequest request, Throwable t) {
        log.error("Fallback triggered for voteThread: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }

    public ResponseEntity<VoteResponse> voteReplyFallback(String replyId, VoteRequest request, Throwable t) {
        log.error("Fallback triggered for voteReply: {}", t.getMessage());
        return ResponseEntity.badRequest().build();
    }
}
