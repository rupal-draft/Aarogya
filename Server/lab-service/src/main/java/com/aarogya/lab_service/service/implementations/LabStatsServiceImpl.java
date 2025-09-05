package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.dto.grpc.LabDashboardResponse;
import com.aarogya.lab_service.dto.grpc.LabTestTrendDto;
import com.aarogya.lab_service.dto.grpc.TopLabTestDto;
import com.aarogya.lab_service.models.LabResult;
import com.aarogya.lab_service.service.LabStatsService;
import lombok.RequiredArgsConstructor;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;

@Service
@RequiredArgsConstructor
public class LabStatsServiceImpl implements LabStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "labDashboard", key = "#doctorId")
    public LabDashboardResponse getDoctorLabStats(String doctorId) {

        long totalTests = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)), LabResult.class);

        long completed = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)
                        .and("resultGeneratedAt").ne(null)), LabResult.class);

        long verified = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)
                        .and("isVerified").is(true)), LabResult.class);

        long critical = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)
                        .and("isCritical").is(true)), LabResult.class);

        long pending = totalTests - completed;

        List<TopLabTestDto> topTests = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                group("testId", "testName").count().as("count"),
                project("count").and("_id.testId").as("testId").and("_id.testName").as("testName"),
                sort(Sort.Direction.DESC, "count"),
                limit(5)
        ), LabResult.class, TopLabTestDto.class).getMappedResults();

        List<Document> tatDocs = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)
                        .and("sampleCollectedAt").ne(null)
                        .and("resultGeneratedAt").ne(null)),
                project().andExpression("resultGeneratedAt - sampleCollectedAt")
                        .as("tatMillis"),
                group().avg("tatMillis").as("avgTat")
        ), LabResult.class, Document.class).getMappedResults();

        double avgTatHours = tatDocs.isEmpty() ? 0.0 :
                tatDocs.get(0).get("avgTat") != null ?
                        ((Number) tatDocs.getFirst().get("avgTat")).doubleValue() / (1000 * 60 * 60) : 0.0;

        long abnormalParams = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                unwind("parameters"),
                match(Criteria.where("parameters.status").ne("NORMAL")),
                count().as("abnormalCount")
        ), LabResult.class, Document.class).getUniqueMappedResult() != null ?
                ((Number) Objects.requireNonNull(mongoTemplate.aggregate(newAggregation(
                        match(Criteria.where("doctorId").is(doctorId)),
                        unwind("parameters"),
                        match(Criteria.where("parameters.status").ne("NORMAL")),
                        count().as("abnormalCount")
                ), LabResult.class, Document.class).getUniqueMappedResult()).get("abnormalCount")).longValue() : 0L;

        long doctorNotifications = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)
                        .and("isDoctorNotified").is(true)), LabResult.class);

        long uniquePatients = mongoTemplate.getCollection("lab_results")
                .distinct("patientId", new org.bson.Document("doctorId", doctorId), String.class)
                .into(new ArrayList<>()).size();

        List<LabTestTrendDto> monthlyTrend = mongoTemplate.aggregate(Aggregation.newAggregation(
                match(Criteria.where("doctorId").is(doctorId)),
                project().andExpression("year(createdAt)").as("year")
                        .andExpression("month(createdAt)").as("month"),
                group("year", "month").count().as("testCount"),
                sort(Sort.Direction.ASC, "_id.year", "_id.month")
        ), LabResult.class, LabTestTrendDto.class).getMappedResults();

        return LabDashboardResponse.builder()
                .totalTestsOrdered(totalTests)
                .completedResults(completed)
                .pendingResults(pending)
                .verifiedResults(verified)
                .criticalResults(critical)
                .avgTurnaroundTimeHours(avgTatHours)
                .topTests(topTests)
                .abnormalParameters(abnormalParams)
                .doctorNotificationsSent(doctorNotifications)
                .uniquePatientsTested(uniquePatients)
                .monthlyTestTrend(monthlyTrend)
                .build();
    }
}

