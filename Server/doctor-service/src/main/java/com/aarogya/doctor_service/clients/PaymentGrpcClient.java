package com.aarogya.doctor_service.clients;

import com.aarogya.doctor_service.dto.grpc.payment.MonthlyEarning;
import com.aarogya.doctor_service.dto.grpc.payment.PaymentDashboardResponse;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PaymentGrpcClient {

    private final ManagedChannel channel;
    private final com.aarogya.payment.grpc.PaymentServiceGrpc.PaymentServiceBlockingStub blockingStub;

    public PaymentGrpcClient() {
        this.channel = ManagedChannelBuilder.forAddress("localhost", 6001)
                .usePlaintext()
                .build();
        this.blockingStub = com.aarogya.payment.grpc.PaymentServiceGrpc.newBlockingStub(channel);
    }

    public PaymentDashboardResponse getPaymentStats(String doctorId) {
        try {
            com.aarogya.payment.grpc.PaymentStatsRequest request = com.aarogya.payment.grpc.PaymentStatsRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .build();

            com.aarogya.payment.grpc.PaymentStatsResponse response = blockingStub.getPaymentStats(request);
            return mapToPaymentDashboardResponse(response);

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to PaymentService failed: {}", e.getStatus(), e);
            throw e;
        }
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    // ================== MAPPING ==================

    private PaymentDashboardResponse mapToPaymentDashboardResponse(com.aarogya.payment.grpc.PaymentStatsResponse proto) {
        return PaymentDashboardResponse.builder()
                .totalEarningsThisMonth(proto.getTotalEarningsThisMonth())
                .pendingPayouts(proto.getPendingPayouts())
                .averageConsultationFee(proto.getAverageConsultationFee())
                .earningsTrend(proto.getEarningsTrendList().stream()
                        .map(this::mapToMonthlyEarning)
                        .collect(Collectors.toList()))
                .build();
    }

    private MonthlyEarning mapToMonthlyEarning(com.aarogya.payment.grpc.MonthlyEarning proto) {
        return MonthlyEarning.builder()
                .year(proto.getYear())
                .month(proto.getMonth())
                .totalAmount(proto.getTotalEarnings())
                .build();
    }
}
