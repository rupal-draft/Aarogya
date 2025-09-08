package com.aarogya.doctor_service.repositories.forum;

import com.aarogya.doctor_service.dto.forum.request.ThreadFilterRequest;
import com.aarogya.doctor_service.models.forum.ForumThread;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ThreadRepositoryCustomImpl  implements ThreadRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<ForumThread> searchWithFilters(ThreadFilterRequest filter, Pageable pageable, String doctorId) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        if (filter != null) {
            if (filter.getSearchQuery() != null && !filter.getSearchQuery().isEmpty()) {
                criteriaList.add(new Criteria().orOperator(
                        Criteria.where("title").regex(filter.getSearchQuery(), "i"),
                        Criteria.where("description").regex(filter.getSearchQuery(), "i")
                ));
            }

            if (filter.getTags() != null && !filter.getTags().isEmpty()) {
                criteriaList.add(Criteria.where("tags").in(filter.getTags()));
            }

            if (filter.getType() != null) {
                criteriaList.add(Criteria.where("type").is(filter.getType()));
            }

            if (filter.getStatus() != null) {
                criteriaList.add(Criteria.where("status").is(filter.getStatus()));
            }

            if (filter.getAuthorId() != null) {
                criteriaList.add(Criteria.where("authorId").is(filter.getAuthorId()));
            }

            if (Boolean.TRUE.equals(filter.getBookmarked()) && doctorId != null) {
                criteriaList.add(Criteria.where("bookmarks").in(doctorId));
            }

            if (Boolean.TRUE.equals(filter.getParticipated()) && doctorId != null) {
                criteriaList.add(Criteria.where("participants").in(doctorId));
            }
        }

        criteriaList.add(Criteria.where("isActive").is(true));

        query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));

        if (filter != null && filter.getSortBy() != null) {
            Sort.Direction direction = "desc".equalsIgnoreCase(filter.getSortOrder()) ? Sort.Direction.DESC : Sort.Direction.ASC;
            query.with(Sort.by(direction, filter.getSortBy()));
        }

        query.with(pageable);

        List<ForumThread> threads = mongoTemplate.find(query, ForumThread.class);
        long count = mongoTemplate.count(query.skip(-1).limit(-1), ForumThread.class);

        return new PageImpl<>(threads, pageable, count);
    }
}

