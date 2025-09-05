package com.aarogya.payment_service.grpc;

import com.aarogya.payment.grpc.*;
import com.aarogya.payment_service.dto.grpc.PaymentDashboardResponse;
import com.aarogya.payment_service.service.PaymentStatsService;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class PaymentGrpcService extends PaymentServiceGrpc.PaymentServiceImplBase {

    private final PaymentStatsService paymentStatsService;

    @Override
    public void getPaymentStats(PaymentStatsRequest request, StreamObserver<PaymentStatsResponse> responseObserver) {
        try {
            PaymentDashboardResponse stats = paymentStatsService.getDoctorDashboardStats(request.getDoctorId());

            PaymentStatsResponse.Builder responseBuilder =
                    PaymentStatsResponse.newBuilder()
                            .setTotalEarningsThisMonth(stats.getTotalEarningsThisMonth())
                            .setPendingPayouts(stats.getPendingPayouts())
                            .setAverageConsultationFee(stats.getAverageConsultationFee());

            stats.getEarningsTrend().forEach(dto -> {
                responseBuilder.addEarningsTrend(
                        MonthlyEarning.newBuilder()
                                .setYear(dto.getYear())
                                .setMonth(dto.getMonth())
                                .setTotalEarnings(dto.getTotalAmount())
                                .build()
                );
            });

            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            responseObserver.onError(e);
        }
    }
}
