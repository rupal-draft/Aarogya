package com.aarogya.doctor_service.services.forum.implementation;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.clients.UserGrpcClient;
import com.aarogya.doctor_service.dto.forum.request.*;
import com.aarogya.doctor_service.dto.forum.response.*;
import com.aarogya.doctor_service.dto.grpc.auth_service.DoctorResponseDTO;
import com.aarogya.doctor_service.enums.forum.ThreadType;
import com.aarogya.doctor_service.enums.forum.VoteType;
import com.aarogya.doctor_service.exceptions.BadRequestException;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.models.forum.*;
import com.aarogya.doctor_service.repositories.forum.*;
import com.aarogya.doctor_service.services.forum.ForumService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ForumServiceImpl implements ForumService {

    private final ForumThreadRepository threadRepository;
    private final ForumReplyRepository replyRepository;
    private final ForumBookmarkRepository bookmarkRepository;
    private final ForumVoteRepository voteRepository;
    private final ThreadViewRepository viewRepository;
    private final ForumTagRepository tagRepository;
    private final TagSubscriptionRepository subscriptionRepository;
    private final ModelMapper modelMapper;
    private final UserGrpcClient userGrpcClient;

    private static final String THREAD_CACHE = "forumThreads";
    private static final String REPLY_CACHE = "forumReplies";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, allEntries = true),
            @CacheEvict(value = "forumStats", allEntries = true)
    })
    public ThreadResponse createThread(CreateThreadRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating forum thread by doctor: {}", doctorId);

        validateThreadRequest(request);

        DoctorResponseDTO doctorDetails = getDoctorDetails(doctorId);

        List<String> validatedTags = validateAndProcessTags(request.getTags());

        ForumThread thread = buildThread(request, doctorId, doctorDetails, validatedTags);
        ForumThread savedThread = threadRepository.save(thread);

        updateTagThreadCounts(validatedTags, 1);

        log.info("Thread created successfully with ID: {}", savedThread.getId());
        return convertToThreadResponse(savedThread, doctorId);
    }

    @Override
    @Cacheable(value = THREAD_CACHE, key = "#threadId")
    public ThreadResponse getThread(String threadId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching thread: {}", threadId);

        ForumThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));

        if (Boolean.FALSE.equals(thread.getIsActive())) {
            throw new ResourceNotFoundException("Thread not found with id: " + threadId);
        }

        recordView(threadId, doctorId);

        return convertToThreadResponse(thread, doctorId);
    }

    @Override
    @Cacheable(value = THREAD_CACHE, key = "#filter.toString() + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<ThreadSummaryResponse> getThreads(ThreadFilterRequest filter, Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching threads with filter: {}", filter);

        Page<ForumThread> threadsPage = applyThreadFilters(filter, pageable, doctorId);

        return threadsPage.map(thread -> convertToThreadSummaryResponse(thread, doctorId));
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, key = "#threadId"),
            @CacheEvict(value = THREAD_CACHE, allEntries = true)
    })
    public ThreadResponse updateThread(String threadId, UpdateThreadRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating thread: {}", threadId);

        ForumThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));

        validateThreadOwnership(thread, doctorId);
        validateUpdateRequest(request);

        if (request.getTags() != null) {
            List<String> oldTags = thread.getTags();
            List<String> newTags = validateAndProcessTags(request.getTags());

            updateTagThreadCounts(oldTags, -1);
            updateTagThreadCounts(newTags, 1);

            thread.setTags(newTags);
        }

        updateThreadFields(thread, request);
        ForumThread updatedThread = threadRepository.save(thread);

        log.info("Thread updated successfully: {}", threadId);
        return convertToThreadResponse(updatedThread, doctorId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, key = "#threadId"),
            @CacheEvict(value = THREAD_CACHE, allEntries = true),
            @CacheEvict(value = "forumStats", allEntries = true)
    })
    public void deleteThread(String threadId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting thread: {}", threadId);

        ForumThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));

        validateThreadOwnership(thread, doctorId);

        updateTagThreadCounts(thread.getTags(), -1);

        thread.setIsActive(false);
        threadRepository.save(thread);

        log.info("Thread deleted successfully: {}", threadId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = REPLY_CACHE, key = "#threadId"),
            @CacheEvict(value = THREAD_CACHE, key = "#threadId")
    })
    public ReplyResponse createReply(String threadId, CreateReplyRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating reply for thread: {}", threadId);

        validateReplyRequest(request);

        ForumThread thread = threadRepository.findById(threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found with id: " + threadId));

        if (Boolean.FALSE.equals(thread.getIsActive())) {
            throw new BadRequestException("Cannot reply to deleted thread");
        }

        if (Boolean.TRUE.equals(thread.getIsClosed())) {
            throw new BadRequestException("Cannot reply to closed thread");
        }

        DoctorResponseDTO doctorDetails = getDoctorDetails(doctorId);

        if (request.getParentReplyId() != null) {
            validateParentReply(request.getParentReplyId(), threadId);
        }

        ForumReply reply = buildReply(request, threadId, doctorId, doctorDetails);
        ForumReply savedReply = replyRepository.save(reply);

        updateThreadAfterReply(thread);

        log.info("Reply created successfully with ID: {}", savedReply.getId());
        return convertToReplyResponse(savedReply, doctorId);
    }

    @Override
    @Cacheable(value = REPLY_CACHE, key = "#threadId + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<ReplyResponse> getReplies(String threadId, Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching replies for thread: {}", threadId);

        if (!threadRepository.existsByIdAndIsActiveTrue(threadId)) {
            throw new ResourceNotFoundException("Thread not found with id: " + threadId);
        }

        Page<ForumReply> repliesPage = replyRepository.findByThreadIdAndParentReplyIdIsNullAndIsActiveTrueOrderByCreatedAtAsc(threadId, pageable);

        return repliesPage.map(reply -> {
            ReplyResponse response = convertToReplyResponse(reply, doctorId);
            List<ForumReply> childReplies = replyRepository.findByParentReplyIdAndIsActiveTrue(reply.getId());
            response.setChildReplies(childReplies.stream()
                    .map(child -> convertToReplyResponse(child, doctorId))
                    .collect(Collectors.toList()));
            return response;
        });
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = REPLY_CACHE, key = "#result.threadId"),
            @CacheEvict(value = THREAD_CACHE, key = "#result.threadId")
    })
    public ReplyResponse updateReply(String replyId, CreateReplyRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating reply: {}", replyId);

        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id: " + replyId));

        validateReplyOwnership(reply, doctorId);
        validateReplyRequest(request);

        reply.setContent(request.getContent());
        if (request.getIsAnonymous() != null) {
            reply.setIsAnonymous(request.getIsAnonymous());
        }
        reply.setUpdatedAt(LocalDateTime.now());

        ForumReply updatedReply = replyRepository.save(reply);

        log.info("Reply updated successfully: {}", replyId);
        return convertToReplyResponse(updatedReply, doctorId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = REPLY_CACHE, key = "#result?.threadId"),
            @CacheEvict(value = THREAD_CACHE, key = "#result?.threadId")
    })
    public void deleteReply(String replyId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting reply: {}", replyId);

        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id: " + replyId));

        validateReplyOwnership(reply, doctorId);

        reply.setIsActive(false);
        replyRepository.save(reply);

        threadRepository.findById(reply.getThreadId()).ifPresent(thread -> {
            thread.setReplyCount(Math.max(0, thread.getReplyCount() - 1));
            threadRepository.save(thread);
        });

        log.info("Reply deleted successfully: {}", replyId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, key = "#threadId")
    })
    public BookmarkResponse bookmarkThread(String threadId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Bookmarking thread: {} by doctor: {}", threadId, doctorId);

        if (!threadRepository.existsByIdAndIsActiveTrue(threadId)) {
            throw new ResourceNotFoundException("Thread not found with id: " + threadId);
        }

        Optional<ForumBookmark> existingBookmark = bookmarkRepository.findByDoctorIdAndThreadId(doctorId, threadId);
        if (existingBookmark.isPresent()) {
            throw new BadRequestException("Thread already bookmarked");
        }

        ForumBookmark bookmark = ForumBookmark.builder()
                .doctorId(doctorId)
                .threadId(threadId)
                .createdAt(LocalDateTime.now())
                .build();

        ForumBookmark savedBookmark = bookmarkRepository.save(bookmark);

        threadRepository.findById(threadId).ifPresent(thread -> {
            thread.setBookmarkCount(thread.getBookmarkCount() + 1);
            threadRepository.save(thread);
        });

        return convertToBookmarkResponse(savedBookmark);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, key = "#threadId")
    })
    public void removeBookmark(String threadId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Removing bookmark for thread: {} by doctor: {}", threadId, doctorId);

        ForumBookmark bookmark = bookmarkRepository.findByDoctorIdAndThreadId(doctorId, threadId)
                .orElseThrow(() -> new ResourceNotFoundException("Bookmark not found"));

        bookmarkRepository.delete(bookmark);

        threadRepository.findById(threadId).ifPresent(thread -> {
            thread.setBookmarkCount(Math.max(0, thread.getBookmarkCount() - 1));
            threadRepository.save(thread);
        });
    }

    @Override
    public Page<BookmarkResponse> getBookmarks(Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching bookmarks for doctor: {}", doctorId);

        Page<ForumBookmark> bookmarksPage = bookmarkRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId, pageable);

        return bookmarksPage.map(bookmark -> {
            BookmarkResponse response = convertToBookmarkResponse(bookmark);
            threadRepository.findById(bookmark.getThreadId()).ifPresent(thread -> {
                response.setThreadTitle(thread.getTitle());
            });
            return response;
        });
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = THREAD_CACHE, key = "#threadId")
    })
    public VoteResponse voteThread(String threadId, VoteRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Voting on thread: {} by doctor: {}", threadId, doctorId);

        if (!threadRepository.existsByIdAndIsActiveTrue(threadId)) {
            throw new ResourceNotFoundException("Thread not found with id: " + threadId);
        }

        validateVoteRequest(request);

        Optional<ForumVote> existingVote = voteRepository.findByDoctorIdAndThreadId(doctorId, threadId);
        ForumThread thread = threadRepository.findById(threadId).orElseThrow();

        int voteValue = convertVoteTypeToValue(request.getVoteType());
        int oldVoteValue = 0;

        ForumVote vote;
        if (existingVote.isPresent()) {
            vote = existingVote.get();
            oldVoteValue = vote.getVoteValue();
            vote.setVoteValue(voteValue);
            vote.setUpdatedAt(LocalDateTime.now());
        } else {
            vote = ForumVote.builder()
                    .doctorId(doctorId)
                    .threadId(threadId)
                    .voteValue(voteValue)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        }
        voteRepository.save(vote);

        int voteDelta = voteValue - oldVoteValue;
        thread.setUpvoteCount(thread.getUpvoteCount() + voteDelta);
        threadRepository.save(thread);

        return VoteResponse.builder()
                .threadId(threadId)
                .voteType(request.getVoteType())
                .newUpvoteCount(thread.getUpvoteCount())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    public VoteResponse voteReply(String replyId, VoteRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Voting on reply: {} by doctor: {}", replyId, doctorId);

        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id: " + replyId));

        if (Boolean.FALSE.equals(reply.getIsActive())) {
            throw new ResourceNotFoundException("Reply not found with id: " + replyId);
        }

        validateVoteRequest(request);

        Optional<ForumVote> existingVote = voteRepository.findByDoctorIdAndReplyId(doctorId, replyId);

        int voteValue = convertVoteTypeToValue(request.getVoteType());
        int oldVoteValue = 0;

        ForumVote vote;
        if (existingVote.isPresent()) {
            vote = existingVote.get();
            oldVoteValue = vote.getVoteValue();
            vote.setVoteValue(voteValue);
            vote.setUpdatedAt(LocalDateTime.now());
        } else {
            vote = ForumVote.builder()
                    .doctorId(doctorId)
                    .replyId(replyId)
                    .voteValue(voteValue)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        }
        voteRepository.save(vote);

        int voteDelta = voteValue - oldVoteValue;
        reply.setUpvoteCount(reply.getUpvoteCount() + voteDelta);
        replyRepository.save(reply);

        return VoteResponse.builder()
                .replyId(replyId)
                .voteType(request.getVoteType())
                .newUpvoteCount(reply.getUpvoteCount())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = REPLY_CACHE, key = "#result?.threadId"),
            @CacheEvict(value = THREAD_CACHE, key = "#result?.threadId")
    })
    public void markAsSolution(String replyId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Marking reply as solution: {}", replyId);

        ForumReply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found with id: " + replyId));

        ForumThread thread = threadRepository.findById(reply.getThreadId())
                .orElseThrow(() -> new ResourceNotFoundException("Thread not found"));

        validateThreadOwnership(thread, doctorId);

        Optional<ForumReply> existingSolution = replyRepository.findByThreadIdAndIsSolutionTrue(thread.getId());
        existingSolution.ifPresent(solution -> {
            solution.setIsSolution(false);
            replyRepository.save(solution);
        });

        reply.setIsSolution(true);
        replyRepository.save(reply);

        if (ThreadType.QUESTION.name().equals(thread.getType())) {
            thread.setIsClosed(true);
            thread.setClosedReason("Solution found");
            threadRepository.save(thread);
        }

        log.info("Reply marked as solution: {}", replyId);
    }

    @Override
    @Cacheable(value = "forumStats")
    public ForumStatsResponse getForumStats() {
        log.debug("Fetching forum statistics");

        Integer totalThreads = threadRepository.countByIsActiveTrue();
        Integer totalReplies = replyRepository.countByIsActiveTrue();

        List<ForumTag> popularTags = tagRepository.findByIsActiveTrueOrderByThreadCountDesc(Pageable.ofSize(10));

        List<ForumThread> trendingThreads = threadRepository.findTop10ByIsActiveTrueOrderByReplyCountDesc();

        return ForumStatsResponse.builder()
                .totalThreads(totalThreads)
                .totalReplies(totalReplies)
                .totalDoctors(0)
                .activeThisWeek(0)
                .popularTags(popularTags.stream().map(this::convertToTagResponse).collect(Collectors.toList()))
                .trendingThreads(trendingThreads.stream()
                        .map(thread -> convertToThreadSummaryResponse(thread, null))
                        .collect(Collectors.toList()))
                .build();
    }

    @Override
    public List<TagResponse> getPopularTags() {
        log.debug("Fetching popular tags");

        List<ForumTag> tags = tagRepository.findByIsActiveTrueOrderByThreadCountDesc(Pageable.ofSize(20));
        String doctorId = UserContextHolder.getUserDetails().getUserId();

        return tags.stream()
                .map(tag -> {
                    TagResponse response = convertToTagResponse(tag);
                    response.setIsSubscribed(subscriptionRepository.existsByDoctorIdAndTagId(doctorId, tag.getId()));
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TagResponse subscribeToTag(String tagName) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Subscribing to tag: {} by doctor: {}", tagName, doctorId);

        ForumTag tag = tagRepository.findByName(tagName)
                .orElseGet(() -> createNewTag(tagName));

        Optional<TagSubscription> existingSubscription = subscriptionRepository.findByDoctorIdAndTagId(doctorId, tag.getId());
        if (existingSubscription.isPresent()) {
            throw new BadRequestException("Already subscribed to this tag");
        }

        TagSubscription subscription = TagSubscription.builder()
                .doctorId(doctorId)
                .tagId(tag.getId())
                .subscribedAt(LocalDateTime.now())
                .build();

        subscriptionRepository.save(subscription);

        tag.setFollowerCount(tag.getFollowerCount() + 1);
        tagRepository.save(tag);

        TagResponse response = convertToTagResponse(tag);
        response.setIsSubscribed(true);
        return response;
    }

    @Override
    @Transactional
    public void unsubscribeFromTag(String tagName) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Unsubscribing from tag: {} by doctor: {}", tagName, doctorId);

        ForumTag tag = tagRepository.findByName(tagName)
                .orElseThrow(() -> new ResourceNotFoundException("Tag not found: " + tagName));

        TagSubscription subscription = subscriptionRepository.findByDoctorIdAndTagId(doctorId, tag.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Not subscribed to this tag"));

        subscriptionRepository.delete(subscription);

        tag.setFollowerCount(Math.max(0, tag.getFollowerCount() - 1));
        tagRepository.save(tag);
    }

    @Override
    public Page<ThreadSummaryResponse> getSubscribedTagsThreads(Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching threads from subscribed tags for doctor: {}", doctorId);

        List<TagSubscription> subscriptions = subscriptionRepository.findByDoctorId(doctorId);
        List<String> tagIds = subscriptions.stream()
                .map(TagSubscription::getTagId)
                .collect(Collectors.toList());

        if (tagIds.isEmpty()) {
            return Page.empty();
        }

        List<ForumTag> tags = tagRepository.findAllById(tagIds);
        List<String> tagNames = tags.stream()
                .map(ForumTag::getName)
                .collect(Collectors.toList());

        Page<ForumThread> threadsPage = threadRepository.findByTagsInAndIsActiveTrue(tagNames, pageable);

        return threadsPage.map(thread -> convertToThreadSummaryResponse(thread, doctorId));
    }

    @Override
    @Transactional
    public void recordThreadView(String threadId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();

        Optional<ThreadView> existingView = viewRepository.findByThreadIdAndDoctorId(threadId, doctorId);
        if (existingView.isPresent()) {
            return;
        }

        ThreadView view = ThreadView.builder()
                .threadId(threadId)
                .doctorId(doctorId)
                .viewedAt(LocalDateTime.now())
                .build();

        viewRepository.save(view);

        threadRepository.findById(threadId).ifPresent(thread -> {
            thread.setViewCount(thread.getViewCount() + 1);
            threadRepository.save(thread);
        });
    }

    private void validateThreadRequest(CreateThreadRequest request) {
        if (request.getTags() == null || request.getTags().isEmpty()) {
            throw new BadRequestException("At least one tag is required");
        }

        if (request.getTags().size() > 5) {
            throw new BadRequestException("Maximum 5 tags allowed");
        }

        if (request.getType() != null) {
            try {
                ThreadType.valueOf(request.getType().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid thread type: " + request.getType());
            }
        }
    }

    private void validateUpdateRequest(UpdateThreadRequest request) {
        if (request.getTags() != null && request.getTags().size() > 5) {
            throw new BadRequestException("Maximum 5 tags allowed");
        }
    }

    private void validateReplyRequest(CreateReplyRequest request) {
        if (request.getParentReplyId() != null && request.getIsSolution() != null && request.getIsSolution()) {
            throw new BadRequestException("Child replies cannot be marked as solution");
        }
    }

    private void validateVoteRequest(VoteRequest request) {
        try {
            VoteType.valueOf(request.getVoteType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid vote type: " + request.getVoteType());
        }
    }

    private void validateThreadOwnership(ForumThread thread, String doctorId) {
        if (!thread.getAuthorId().equals(doctorId)) {
            throw new BadRequestException("You can only modify your own threads");
        }
    }

    private void validateReplyOwnership(ForumReply reply, String doctorId) {
        if (!reply.getAuthorId().equals(doctorId)) {
            throw new BadRequestException("You can only modify your own replies");
        }
    }

    private void validateParentReply(String parentReplyId, String threadId) {
        ForumReply parentReply = replyRepository.findById(parentReplyId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent reply not found"));

        if (!parentReply.getThreadId().equals(threadId)) {
            throw new BadRequestException("Parent reply does not belong to this thread");
        }

        if (Boolean.FALSE.equals(parentReply.getIsActive())) {
            throw new BadRequestException("Parent reply is deleted");
        }
    }

    private DoctorResponseDTO getDoctorDetails(String doctorId) {
        log.debug("Fetching doctor details for ID: {}", doctorId);
        return userGrpcClient.getDoctor(doctorId);
    }

    private List<String> validateAndProcessTags(List<String> tags) {
        return tags.stream()
                .map(String::toLowerCase)
                .map(tag -> tag.replaceAll("[^a-zA-Z0-9\\s]", "").trim())
                .filter(tag -> tag.length() >= 2 && tag.length() <= 20)
                .distinct()
                .collect(Collectors.toList());
    }

    private ForumThread buildThread(CreateThreadRequest request, String doctorId, DoctorResponseDTO doctorDetails, List<String> tags) {
        return ForumThread.builder()
                .authorId(doctorId)
                .authorName(doctorDetails.getFirstName() + doctorDetails.getLastName())
                .authorSpecialization(doctorDetails.getSpecialization())
                .title(request.getTitle())
                .content(request.getContent())
                .tags(tags)
                .type(request.getType() != null ? ThreadType.valueOf(request.getType().toUpperCase()) : ThreadType.DISCUSSION)
                .viewCount(0)
                .replyCount(0)
                .upvoteCount(0)
                .bookmarkCount(0)
                .isActive(true)
                .isClosed(false)
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private ForumReply buildReply(CreateReplyRequest request, String threadId, String doctorId, DoctorResponseDTO doctorDetails) {
        return ForumReply.builder()
                .threadId(threadId)
                .authorId(doctorId)
                .authorName(doctorDetails.getFirstName() + doctorDetails.getLastName())
                .authorSpecialization(doctorDetails.getSpecialization())
                .content(request.getContent())
                .parentReplyId(request.getParentReplyId())
                .isAnonymous(Boolean.TRUE.equals(request.getIsAnonymous()))
                .isSolution(Boolean.TRUE.equals(request.getIsSolution()))
                .isActive(true)
                .upvoteCount(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void updateThreadAfterReply(ForumThread thread) {
        thread.setReplyCount(thread.getReplyCount() + 1);
        thread.setLastRepliedAt(LocalDateTime.now());
        threadRepository.save(thread);
    }

    private void updateThreadFields(ForumThread thread, UpdateThreadRequest request) {
        if (request.getTitle() != null) {
            thread.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            thread.setContent(request.getContent());
        }
        if (request.getIsClosed() != null) {
            thread.setIsClosed(request.getIsClosed());
        }
        if (request.getClosedReason() != null) {
            thread.setClosedReason(request.getClosedReason());
        }
        thread.setUpdatedAt(LocalDateTime.now());
    }

    private void updateTagThreadCounts(List<String> tags, int delta) {
        for (String tagName : tags) {
            ForumTag tag = tagRepository.findByName(tagName)
                    .orElseGet(() -> createNewTag(tagName));

            tag.setThreadCount(Math.max(0, tag.getThreadCount() + delta));
            tagRepository.save(tag);
        }
    }

    private ForumTag createNewTag(String tagName) {
        ForumTag tag = ForumTag.builder()
                .name(tagName.toLowerCase())
                .description("")
                .threadCount(0)
                .followerCount(0)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
        return tagRepository.save(tag);
    }

    private int convertVoteTypeToValue(String voteType) {
        return switch (VoteType.valueOf(voteType.toUpperCase())) {
            case UPVOTE -> 1;
            case DOWNVOTE -> -1;
            case NEUTRAL -> 0;
        };
    }

    private void recordView(String threadId, String doctorId) {
        Optional<ThreadView> existingView = viewRepository.findByThreadIdAndDoctorId(threadId, doctorId);
        if (existingView.isEmpty()) {
            ThreadView view = ThreadView.builder()
                    .threadId(threadId)
                    .doctorId(doctorId)
                    .viewedAt(LocalDateTime.now())
                    .build();
            viewRepository.save(view);

            threadRepository.findById(threadId).ifPresent(thread -> {
                thread.setViewCount(thread.getViewCount() + 1);
                threadRepository.save(thread);
            });
        }
    }

    public Page<ForumThread> applyThreadFilters(ThreadFilterRequest filter, Pageable pageable, String doctorId) {
        return threadRepository.findByFilters(filter, pageable, doctorId);
    }

    private ThreadResponse convertToThreadResponse(ForumThread thread, String currentDoctorId) {
        ThreadResponse response = modelMapper.map(thread, ThreadResponse.class);

        response.setIsBookmarked(bookmarkRepository.existsByDoctorIdAndThreadId(currentDoctorId, thread.getId()));
        response.setUserVote(getUserVoteForThread(thread.getId(), currentDoctorId));

        List<ForumReply> recentReplies = replyRepository.findByThreadIdAndIsActiveTrue(thread.getId());
        response.setRecentReplies(recentReplies.stream()
                .map(reply -> convertToReplyResponse(reply, currentDoctorId))
                .collect(Collectors.toList()));

        return response;
    }

    private ThreadSummaryResponse convertToThreadSummaryResponse(ForumThread thread, String currentDoctorId) {
        ThreadSummaryResponse response = modelMapper.map(thread, ThreadSummaryResponse.class);

        if (thread.getContent().length() > 150) {
            response.setContentPreview(thread.getContent().substring(0, 150) + "...");
        } else {
            response.setContentPreview(thread.getContent());
        }

        if (currentDoctorId != null) {
            response.setIsBookmarked(bookmarkRepository.existsByDoctorIdAndThreadId(currentDoctorId, thread.getId()));
            response.setUserVote(getUserVoteForThread(thread.getId(), currentDoctorId));
        }

        return response;
    }

    private ReplyResponse convertToReplyResponse(ForumReply reply, String currentDoctorId) {
        ReplyResponse response = modelMapper.map(reply, ReplyResponse.class);

        if (currentDoctorId != null) {
            response.setUserVote(getUserVoteForReply(reply.getId(), currentDoctorId));
        }

        return response;
    }

    private BookmarkResponse convertToBookmarkResponse(ForumBookmark bookmark) {
        return modelMapper.map(bookmark, BookmarkResponse.class);
    }

    private TagResponse convertToTagResponse(ForumTag tag) {
        return modelMapper.map(tag, TagResponse.class);
    }

    private Integer getUserVoteForThread(String threadId, String doctorId) {
        return voteRepository.findByDoctorIdAndThreadId(doctorId, threadId)
                .map(ForumVote::getVoteValue)
                .orElse(0);
    }

    private Integer getUserVoteForReply(String replyId, String doctorId) {
        return voteRepository.findByDoctorIdAndReplyId(doctorId, replyId)
                .map(ForumVote::getVoteValue)
                .orElse(0);
    }
}
