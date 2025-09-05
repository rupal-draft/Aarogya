package com.aarogya.payment_service.service.implementation;

import com.aarogya.payment_service.dto.grpc.MonthlyEarning;
import com.aarogya.payment_service.dto.grpc.PaymentDashboardResponse;
import com.aarogya.payment_service.enums.PaymentStatus;
import com.aarogya.payment_service.models.AppointmentPayment;
import com.aarogya.payment_service.service.PaymentStatsService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.*;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentStatsServiceImpl implements PaymentStatsService {

    private final MongoTemplate mongoTemplate;

    @Override
    @Cacheable(value = "paymentDashboard", key = "#doctorId", unless = "#result == null")
    public PaymentDashboardResponse getDoctorDashboardStats(String doctorId) {
        LocalDate startOfMonth = YearMonth.now().atDay(1);
        LocalDate startOfSixMonthsAgo = YearMonth.now().minusMonths(5).atDay(1);

        Aggregation totalEarningsAgg = newAggregation(
                match(Criteria.where("doctorId").is(doctorId)
                        .and("status").is(PaymentStatus.SUCCESS.name())
                        .and("paidAt").gte(startOfMonth.atStartOfDay(ZoneId.systemDefault()).toInstant())),
                group().sum("amount").as("totalEarnings")
        );

        Double totalEarningsThisMonth = mongoTemplate.aggregate(totalEarningsAgg, AppointmentPayment.class, TotalResult.class)
                .getUniqueMappedResult() != null ?
                Objects.requireNonNull(mongoTemplate.aggregate(totalEarningsAgg, AppointmentPayment.class, TotalResult.class)
                        .getUniqueMappedResult()).getTotalEarnings() : 0.0;

        Aggregation pendingPayoutsAgg = newAggregation(
                match(Criteria.where("doctorId").is(doctorId)
                        .and("status").is(PaymentStatus.SUCCESS.name())
                        .and("payoutStatus").is("PENDING")),
                group().sum("amount").as("pendingPayouts")
        );

        Double pendingPayouts = mongoTemplate.aggregate(pendingPayoutsAgg, AppointmentPayment.class, TotalResult.class)
                .getUniqueMappedResult() != null ?
                mongoTemplate.aggregate(pendingPayoutsAgg, AppointmentPayment.class, TotalResult.class)
                        .getUniqueMappedResult().getPendingPayouts() : 0.0;

        Aggregation avgFeeAgg = newAggregation(
                match(Criteria.where("doctorId").is(doctorId)
                        .and("status").is(PaymentStatus.SUCCESS.name())),
                group().avg("amount").as("avgFee")
        );

        Double avgFee = mongoTemplate.aggregate(avgFeeAgg, AppointmentPayment.class, AvgResult.class)
                .getUniqueMappedResult() != null ?
                mongoTemplate.aggregate(avgFeeAgg, AppointmentPayment.class, AvgResult.class)
                        .getUniqueMappedResult().getAvgFee() : 0.0;

        Aggregation trendAgg = newAggregation(
                match(Criteria.where("doctorId").is(doctorId)
                        .and("status").is(PaymentStatus.SUCCESS.name())
                        .and("paidAt").gte(startOfSixMonthsAgo.atStartOfDay(ZoneId.systemDefault()).toInstant())),
                project("amount")
                        .andExpression("year(paidAt)").as("year")
                        .andExpression("month(paidAt)").as("month"),
                group("year", "month").sum("amount").as("totalAmount"),
                sort(Sort.by(Sort.Direction.ASC, "_id.year", "_id.month"))
        );

        List<MonthlyEarning> earningsTrend = mongoTemplate.aggregate(trendAgg, AppointmentPayment.class, TrendResult.class)
                .getMappedResults()
                .stream()
                .map(r -> new MonthlyEarning(r.getYear(), r.getMonth(), r.getTotalAmount()))
                .collect(Collectors.toList());

        return PaymentDashboardResponse.builder()
                .totalEarningsThisMonth(totalEarningsThisMonth)
                .pendingPayouts(pendingPayouts)
                .averageConsultationFee(avgFee)
                .earningsTrend(earningsTrend)
                .build();
    }

    @Data
    static class TotalResult {
        private Double totalEarnings;
        private Double pendingPayouts;
    }

    @Data
    static class AvgResult {
        private Double avgFee;
    }

    @Data
    static class TrendResult {
        private Id _id;
        private Double totalAmount;

        public int getYear() {
            return _id.getYear();
        }

        public int getMonth() {
            return _id.getMonth();
        }

        @Data
        static class Id {
            private int year;
            private int month;
        }
    }
}
