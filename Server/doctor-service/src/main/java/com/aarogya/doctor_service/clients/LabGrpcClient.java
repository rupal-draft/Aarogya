package com.aarogya.doctor_service.clients;

import com.aarogya.doctor_service.dto.grpc.lab.LabDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.lab.LabTestTrendDto;
import com.aarogya.doctor_service.dto.grpc.lab.TopLabTestDto;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class LabGrpcClient {

    private final ManagedChannel channel;
    private final com.aarogya.lab.grpc.LabServiceGrpc.LabServiceBlockingStub blockingStub;

    public LabGrpcClient() {
        this.channel = ManagedChannelBuilder.forAddress("localhost", 2051)
                .usePlaintext()
                .build();
        this.blockingStub = com.aarogya.lab.grpc.LabServiceGrpc.newBlockingStub(channel);
    }

    public LabDashboardResponse getDoctorLabStats(String doctorId) {
        try {
            com.aarogya.lab.grpc.LabStatsRequest request = com.aarogya.lab.grpc.LabStatsRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .build();

            com.aarogya.lab.grpc.LabStatsResponse response = blockingStub.getDoctorLabStats(request);
            return mapToLabDashboardResponse(response);

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to LabService failed: {}", e.getStatus(), e);
            throw e;
        }
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    // ================== MAPPING ==================

    private LabDashboardResponse mapToLabDashboardResponse(com.aarogya.lab.grpc.LabStatsResponse proto) {
        return LabDashboardResponse.builder()
                .totalTestsOrdered(proto.getTotalTestsOrdered())
                .completedResults(proto.getCompletedResults())
                .pendingResults(proto.getPendingResults())
                .verifiedResults(proto.getVerifiedResults())
                .criticalResults(proto.getCriticalResults())
                .avgTurnaroundTimeHours(proto.getAvgTurnaroundTimeHours())
                .topTests(proto.getTopTestsList().stream()
                        .map(this::mapToTopLabTestDto)
                        .collect(Collectors.toList()))
                .abnormalParameters(proto.getAbnormalParameters())
                .doctorNotificationsSent(proto.getDoctorNotificationsSent())
                .uniquePatientsTested(proto.getUniquePatientsTested())
                .monthlyTestTrend(proto.getMonthlyTestTrendList().stream()
                        .map(this::mapToLabTestTrendDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private TopLabTestDto mapToTopLabTestDto(com.aarogya.lab.grpc.TopLabTest proto) {
        return TopLabTestDto.builder()
                .testId(proto.getTestId())
                .testName(proto.getTestName())
                .count(proto.getCount())
                .build();
    }

    private LabTestTrendDto mapToLabTestTrendDto(com.aarogya.lab.grpc.LabTestTrend proto) {
        return LabTestTrendDto.builder()
                .year(proto.getYear())
                .month(proto.getMonth())
                .testCount(proto.getTestCount())
                .build();
    }
}
