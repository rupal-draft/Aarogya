package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.dto.grpc.FavoriteTemplateUsageDto;
import com.aarogya.prescription_service.dto.grpc.PrescriptionDashboardResponse;
import com.aarogya.prescription_service.dto.grpc.PrescriptionGrowthDto;
import com.aarogya.prescription_service.dto.grpc.TopMedicineDto;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.model.TemplateUsageStat;
import com.aarogya.prescription_service.service.PrescriptionStatsService;
import com.mongodb.BasicDBObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.ConditionalOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrescriptionStatsServiceImpl implements PrescriptionStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "prescriptionStats", key = "#doctorId", unless = "#result == null")
    public PrescriptionDashboardResponse getDoctorPrescriptionStats(String doctorId) {
        log.info("Fetching prescription stats for doctor with id: {}", doctorId);
        long totalPrescriptions = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)),
                Prescription.class
        );

        Aggregation topMedicinesAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.unwind("medicines"),
                Aggregation.group("medicines.medicineId", "medicines.medicineName")
                        .count().as("count"),
                Aggregation.project()
                        .and("_id.medicineId").as("medicineId")
                        .and("_id.medicineName").as("medicineName")
                        .and("count").as("count"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "count")),
                Aggregation.limit(3)
        );

        List<TopMedicineDto> topMedicines = mongoTemplate.aggregate(topMedicinesAgg,
                        Prescription.class,
                        TopMedicineDto.class)
                .getMappedResults();

        Aggregation favTemplatesAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.lookup("prescription_templates", "templateId", "_id", "template"),
                Aggregation.unwind("template"),
                Aggregation.match(Criteria.where("template.isFavorite").is(true)),
                Aggregation.group("template._id", "template.name").count().as("usageCount"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "usageCount")),
                Aggregation.limit(5)
        );
        List<FavoriteTemplateUsageDto> favoriteTemplates = mongoTemplate.aggregate(
                        favTemplatesAgg, TemplateUsageStat.class, FavoriteTemplateUsageDto.class)
                .getMappedResults();

        Aggregation avgMedsAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.project().and("medicines").size().as("medicineCount"),
                Aggregation.group().avg("medicineCount").as("avgMedicinesPerPrescription")
        );
        Double avgMeds = Objects.requireNonNull(mongoTemplate.aggregate(avgMedsAgg, Prescription.class, BasicDBObject.class)
                        .getUniqueMappedResult())
                .getDouble("avgMedicinesPerPrescription");

        Aggregation templateModAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.group()
                        .count().as("total")
                        .sum(ConditionalOperators.when(Criteria.where("wasModified").is(true)).then(1).otherwise(0))
                        .as("modified")
        );
        List<BasicDBObject> templateStats = mongoTemplate.aggregate(
                        templateModAgg, TemplateUsageStat.class, BasicDBObject.class)
                .getMappedResults();

        double modificationRatio = 0.0;
        if (!templateStats.isEmpty()) {
            BasicDBObject stats = templateStats.getFirst();
            long modified = stats.get("modified") != null ? stats.getLong("modified") : 0L;
            long total = stats.get("total") != null ? stats.getLong("total") : 0L;
            modificationRatio = total > 0 ? (double) modified / total : 0.0;
        }

        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        Aggregation growthAgg = Aggregation.newAggregation(
                Aggregation.match(
                        Criteria.where("doctorId").is(doctorId)
                                .and("createdAt").gte(sixMonthsAgo.atStartOfDay())
                ),
                Aggregation.project()
                        .andExpression("dateToString('%Y', createdAt)").as("yearStr")
                        .andExpression("dateToString('%m', createdAt)").as("monthStr"),
                Aggregation.group("yearStr", "monthStr")
                        .count().as("totalPrescriptions"),
                Aggregation.sort(Sort.by(Sort.Order.asc("_id.yearStr"), Sort.Order.asc("_id.monthStr")))
        );
        List<Document> rawResults = mongoTemplate.aggregate(
                growthAgg, "prescriptions", Document.class
        ).getMappedResults();
        List<PrescriptionGrowthDto> growthTrend = rawResults.stream()
                .map(doc -> {
                    Document idDoc = (Document) doc.get("_id");

                    Number totalPrescriptionsNum = (Number) doc.get("totalPrescriptions");
                    long totalPrescriptionsForTrend = totalPrescriptionsNum != null ? totalPrescriptionsNum.longValue() : 0L;

                    return PrescriptionGrowthDto.builder()
                            .year(Integer.parseInt(idDoc.getString("yearStr")))
                            .month(Integer.parseInt(idDoc.getString("monthStr")))
                            .totalPrescriptions(totalPrescriptionsForTrend)
                            .build();
                })
                .collect(Collectors.toList());



        log.info(
                """
                        Prescription stats for doctorId={}:
                        Total prescriptions issued: {}
                        Top medicines count: {}, Top medicines: {}
                        Favorite templates used count: {}, Favorite templates: {}
                        Template modification ratio: {}
                        Most recent growth trend: {}""",
                doctorId,
                totalPrescriptions,
                topMedicines.size(),
                topMedicines.stream()
                        .map(m -> m.getMedicineId() + " " + m.getMedicineName() + "(" + m.getCount() + ")")
                        .collect(Collectors.toList()),
                favoriteTemplates.size(),
                favoriteTemplates.stream()
                        .map(t -> t.getTemplateName() + "(" + t.getUsageCount() + ")")
                        .collect(Collectors.toList()),
                modificationRatio,
                growthTrend.isEmpty() ? "N/A" : growthTrend.getLast()
        );

        return PrescriptionDashboardResponse.builder()
                .totalPrescriptionsIssued(totalPrescriptions)
                .topMedicines(topMedicines)
                .favoriteTemplatesUsed(favoriteTemplates)
                .avgMedicinesPerPrescription(avgMeds)
                .templateModificationRatio(modificationRatio)
                .prescriptionGrowthTrend(growthTrend)
                .build();
    }
}
