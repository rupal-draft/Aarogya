package com.aarogya.doctor_service.services.forum.implementation;

import com.aarogya.doctor_service.dto.forum.response.EngagementTrendDto;
import com.aarogya.doctor_service.dto.forum.response.ForumDashboardResponse;
import com.aarogya.doctor_service.dto.forum.response.MostUpvotedThreadResponse;
import com.aarogya.doctor_service.dto.forum.response.TagContributionDto;
import com.aarogya.doctor_service.models.forum.ForumBookmark;
import com.aarogya.doctor_service.models.forum.ForumReply;
import com.aarogya.doctor_service.models.forum.ForumThread;
import com.aarogya.doctor_service.models.forum.ThreadView;
import com.aarogya.doctor_service.services.forum.ForumStatsService;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.DateOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@RequiredArgsConstructor
public class ForumStatsServiceImpl implements ForumStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "forumDashboard", key = "#doctorId")
    public ForumDashboardResponse getDoctorForumStats(String doctorId) {

        long totalThreads = mongoTemplate.count(
                Query.query(Criteria.where("authorId").is(doctorId)), ForumThread.class);

        long totalReplies = mongoTemplate.count(
                Query.query(Criteria.where("authorId").is(doctorId)), ForumReply.class);

        long threadUpvotes = mongoTemplate.aggregate(Aggregation.newAggregation(
                        match(Criteria.where("authorId").is(doctorId)),
                        group().sum("upvoteCount").as("total")
                ), ForumThread.class, Document.class)
                .getUniqueMappedResult() != null ?
                ((Number) Objects.requireNonNull(
                        mongoTemplate.aggregate(
                                Aggregation.newAggregation(
                                        match(Criteria.where("authorId").is(doctorId)),
                                        group().sum("upvoteCount").as("total")
                                ), ForumThread.class, Document.class
                        ).getUniqueMappedResult()
                ).get("total")).longValue() : 0L;

        long replyUpvotes = mongoTemplate.aggregate(Aggregation.newAggregation(
                        match(Criteria.where("authorId").is(doctorId)),
                        group().sum("upvoteCount").as("total")
                ), ForumReply.class, Document.class)
                .getUniqueMappedResult() != null ?
                ((Number) Objects.requireNonNull(
                        mongoTemplate.aggregate(
                                Aggregation.newAggregation(
                                        match(Criteria.where("authorId").is(doctorId)),
                                        group().sum("upvoteCount").as("total")
                                ), ForumReply.class, Document.class
                        ).getUniqueMappedResult()
                ).get("total")).longValue() : 0L;

        long totalUpvotes = threadUpvotes + replyUpvotes;

        long bookmarks = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)), ForumBookmark.class);

        long solutions = mongoTemplate.count(
                Query.query(Criteria.where("authorId").is(doctorId).and("isSolution").is(true)), ForumReply.class);

        long views = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)), ThreadView.class);

        List<TagContributionDto> tagContributions = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("authorId").is(doctorId)),
                unwind("tags"),
                group("tags")
                        .count().as("threadCount")
                        .sum("replyCount").as("replyCount"),
                project("threadCount", "replyCount")
                        .and("_id").as("tagId")
                        .and("_id").as("tagName"),
                sort(Sort.Direction.DESC, "threadCount"),
                limit(5)
        ), ForumThread.class, TagContributionDto.class).getMappedResults();


        List<Document> rawThreadTrend = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("authorId").is(doctorId)),
                project()
                        .andExpression("dateToString('%Y', createdAt)").as("yearStr")
                        .andExpression("dateToString('%m', createdAt)").as("monthStr"),
                group("yearStr", "monthStr").count().as("threadCount"),
                sort(Sort.by(Sort.Order.asc("_id.yearStr"), Sort.Order.asc("_id.monthStr")))
        ), ForumThread.class, Document.class).getMappedResults();

        List<EngagementTrendDto> threadTrend = rawThreadTrend.stream()
                .map(doc -> {
                    Document idDoc = (Document) doc.get("_id");

                    return EngagementTrendDto.builder()
                            .year(Integer.parseInt(idDoc.getString("yearStr")))
                            .month(Integer.parseInt(idDoc.getString("monthStr")))
                            .threadCount(((Number) doc.get("threadCount")).longValue())
                            .replyCount(0L)
                            .build();
                })
                .toList();


        List<Document> rawReplyTrend = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("authorId").is(doctorId)),
                project()
                        .andExpression("dateToString('%Y', createdAt)").as("yearStr")
                        .andExpression("dateToString('%m', createdAt)").as("monthStr"),
                group("yearStr", "monthStr").count().as("replyCount"),
                sort(Sort.by(Sort.Order.asc("_id.yearStr"), Sort.Order.asc("_id.monthStr")))
        ), ForumReply.class, Document.class).getMappedResults();

        List<EngagementTrendDto> replyTrend = rawReplyTrend.stream()
                .map(doc -> {
                    Document idDoc = (Document) doc.get("_id");

                    return EngagementTrendDto.builder()
                            .year(Integer.parseInt(idDoc.getString("yearStr")))
                            .month(Integer.parseInt(idDoc.getString("monthStr")))
                            .threadCount(0L)
                            .replyCount(((Number) doc.get("replyCount")).longValue())
                            .build();
                })
                .toList();


        Map<String, EngagementTrendDto> mergedTrend = new LinkedHashMap<>();
        threadTrend.forEach(t -> {
            String key = t.getYear() + "-" + t.getMonth();
            mergedTrend.putIfAbsent(key, EngagementTrendDto.builder()
                    .year(t.getYear()).month(t.getMonth()).threadCount(0L).replyCount(0L).build());
            mergedTrend.get(key).setThreadCount(t.getThreadCount());
        });
        replyTrend.forEach(r -> {
            String key = r.getYear() + "-" + r.getMonth();
            mergedTrend.putIfAbsent(key, EngagementTrendDto.builder()
                    .year(r.getYear()).month(r.getMonth()).threadCount(0L).replyCount(0L).build());
            mergedTrend.get(key).setReplyCount(r.getReplyCount());
        });

        return ForumDashboardResponse.builder()
                .totalThreadsCreated(totalThreads)
                .totalRepliesGiven(totalReplies)
                .totalUpvotesReceived(totalUpvotes)
                .bookmarkedThreadsCount(bookmarks)
                .totalSolutionsAccepted(solutions)
                .totalThreadViews(views)
                .mostActiveTags(tagContributions)
                .engagementTrend(new ArrayList<>(mergedTrend.values()))
                .mostUpvotedThreadResponse(getMostUpvotedThread(doctorId))
                .build();
    }

    private MostUpvotedThreadResponse getMostUpvotedThread(String doctorId) {
        Query query = new Query(Criteria.where("authorId").is(doctorId));
        query.with(Sort.by(Sort.Direction.DESC, "upvoteCount"));
        query.limit(1);
        ForumThread forumThread = mongoTemplate.findOne(query, ForumThread.class);
        return MostUpvotedThreadResponse
                .builder()
                .title(Objects.requireNonNull(forumThread).getTitle())
                .tags(forumThread.getTags())
                .content(forumThread.getContent())
                .upvoteCount(forumThread.getUpvoteCount())
                .isActive(forumThread.getIsActive())
                .build();
    }
}
