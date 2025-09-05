package com.aarogya.lab_service.grpc;

import com.aarogya.lab.grpc.*;
import com.aarogya.lab_service.dto.grpc.LabDashboardResponse;
import com.aarogya.lab_service.dto.grpc.LabTestTrendDto;
import com.aarogya.lab_service.dto.grpc.TopLabTestDto;
import com.aarogya.lab_service.service.LabStatsService;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import net.devh.boot.grpc.server.service.GrpcService;

@GrpcService
@RequiredArgsConstructor
public class LabGrpcService extends LabServiceGrpc.LabServiceImplBase {

    private final LabStatsService labStatsService;

    @Override
    public void getDoctorLabStats(LabStatsRequest request, StreamObserver<LabStatsResponse> responseObserver) {
        try {
            String doctorId = request.getDoctorId();
            LabDashboardResponse stats = labStatsService.getDoctorLabStats(doctorId);

            LabStatsResponse.Builder resp = LabStatsResponse.newBuilder()
                    .setTotalTestsOrdered(safeLong(stats.getTotalTestsOrdered()))
                    .setCompletedResults(safeLong(stats.getCompletedResults()))
                    .setPendingResults(safeLong(stats.getPendingResults()))
                    .setVerifiedResults(safeLong(stats.getVerifiedResults()))
                    .setCriticalResults(safeLong(stats.getCriticalResults()))
                    .setAvgTurnaroundTimeHours(safeDouble(stats.getAvgTurnaroundTimeHours()))
                    .setAbnormalParameters(safeLong(stats.getAbnormalParameters()))
                    .setDoctorNotificationsSent(safeLong(stats.getDoctorNotificationsSent()))
                    .setUniquePatientsTested(safeLong(stats.getUniquePatientsTested()));

            if (stats.getTopTests() != null) {
                for (TopLabTestDto t : stats.getTopTests()) {
                    resp.addTopTests(TopLabTest.newBuilder()
                            .setTestId(nz(t.getTestId()))
                            .setTestName(nz(t.getTestName()))
                            .setCount(safeLong(t.getCount()))
                            .build());
                }
            }

            if (stats.getMonthlyTestTrend() != null) {
                for (LabTestTrendDto lt : stats.getMonthlyTestTrend()) {
                    resp.addMonthlyTestTrend(LabTestTrend.newBuilder()
                            .setYear(lt.getYear())
                            .setMonth(lt.getMonth())
                            .setTestCount(safeLong(lt.getTestCount()))
                            .build());
                }
            }

            responseObserver.onNext(resp.build());
            responseObserver.onCompleted();
        } catch (Exception e) {
            StatusRuntimeException ex = Status.INTERNAL
                    .withDescription("Failed to fetch lab stats: " + e.getMessage())
                    .withCause(e)
                    .asRuntimeException();
            responseObserver.onError(ex);
        }
    }

    private static long safeLong(Long v) { return v == null ? 0L : v; }
    private static double safeDouble(Double v) { return v == null ? 0.0d : v; }
    private static String nz(String s) { return s == null ? "" : s; }
}
