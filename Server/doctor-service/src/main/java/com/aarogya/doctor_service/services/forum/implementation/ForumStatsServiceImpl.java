package com.aarogya.doctor_service.services.forum.implementation;

import com.aarogya.doctor_service.dto.forum.response.EngagementTrendDto;
import com.aarogya.doctor_service.dto.forum.response.ForumDashboardResponse;
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
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;


import java.util.*;

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
                group("tags").count().as("threadCount"),
                project("threadCount").and("_id").as("tagId"),
                sort(Sort.Direction.DESC, "threadCount"),
                limit(5)
        ), ForumThread.class, TagContributionDto.class).getMappedResults();

        List<EngagementTrendDto> threadTrend = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("authorId").is(doctorId)),
                project().andExpression("year(createdAt)").as("year")
                        .andExpression("month(createdAt)").as("month"),
                group("year", "month").count().as("threadCount"),
                sort(Sort.Direction.ASC, "_id.year", "_id.month")
        ), ForumThread.class, EngagementTrendDto.class).getMappedResults();

        List<EngagementTrendDto> replyTrend = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("authorId").is(doctorId)),
                project().andExpression("year(createdAt)").as("year")
                        .andExpression("month(createdAt)").as("month"),
                group("year", "month").count().as("replyCount"),
                sort(Sort.Direction.ASC, "_id.year", "_id.month")
        ), ForumReply.class, EngagementTrendDto.class).getMappedResults();

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
                .build();
    }
}
