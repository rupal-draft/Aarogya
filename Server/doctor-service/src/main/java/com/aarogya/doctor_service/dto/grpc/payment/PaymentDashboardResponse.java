package com.aarogya.doctor_service.dto.grpc.payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDashboardResponse {
    private Double totalEarningsThisMonth;
    private Double pendingPayouts;
    private Double averageConsultationFee;
    private List<MonthlyEarning> earningsTrend;
}

