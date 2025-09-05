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

@Service
@RequiredArgsConstructor
public class PrescriptionStatsServiceImpl implements PrescriptionStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "prescriptionStats", key = "#doctorId", unless = "#result == null")
    public PrescriptionDashboardResponse getDoctorPrescriptionStats(String doctorId) {
        long totalPrescriptions = mongoTemplate.count(
                Query.query(Criteria.where("doctorId").is(doctorId)),
                Prescription.class
        );

        Aggregation topMedicinesAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.unwind("medicines"),
                Aggregation.group("medicines.medicineId", "medicines.medicineName")
                        .count().as("count"),
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
        Double avgMeds = mongoTemplate.aggregate(avgMedsAgg, Prescription.class, BasicDBObject.class)
                .getUniqueMappedResult()
                .getDouble("avgMedicinesPerPrescription");

        Aggregation templateModAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)),
                Aggregation.group()
                        .sum(ConditionalOperators.when(Criteria.where("wasModified").is(true)).then(1).otherwise(0))
                        .as("modified"),
                Aggregation.group().count().as("total")
        );
        List<BasicDBObject> templateStats = mongoTemplate.aggregate(templateModAgg, TemplateUsageStat.class, BasicDBObject.class).getMappedResults();
        double modificationRatio = 0.0;
        if (!templateStats.isEmpty()) {
            long modified = templateStats.get(0).getLong("modified");
            long total = templateStats.get(0).getLong("total");
            modificationRatio = total > 0 ? (double) modified / total : 0.0;
        }

        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        Aggregation growthAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("doctorId").is(doctorId)
                        .and("createdAt").gte(sixMonthsAgo.atStartOfDay())),
                Aggregation.project()
                        .andExpression("year(createdAt)").as("year")
                        .andExpression("month(createdAt)").as("month"),
                Aggregation.group("year", "month").count().as("totalPrescriptions"),
                Aggregation.sort(Sort.by("year").ascending().and(Sort.by("month").ascending()))
        );
        List<PrescriptionGrowthDto> growthTrend = mongoTemplate.aggregate(
                        growthAgg, Prescription.class, PrescriptionGrowthDto.class)
                .getMappedResults();

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
