package com.aarogya.prescription_service.grpc;

import com.aarogya.prescription.grpc.*;
import com.aarogya.prescription_service.dto.grpc.PrescriptionDashboardResponse;
import com.aarogya.prescription_service.service.PrescriptionStatsService;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;

@Slf4j
@GrpcService
@RequiredArgsConstructor
public class PrescriptionGrpcService extends PrescriptionServiceGrpc.PrescriptionServiceImplBase {

    private final PrescriptionStatsService prescriptionStatsService;

    @Override
    public void getPrescriptionStats(PrescriptionStatsRequest request,
                                     StreamObserver<PrescriptionStatsResponse> responseObserver) {
        try {
            PrescriptionDashboardResponse stats =
                    prescriptionStatsService.getDoctorPrescriptionStats(request.getDoctorId());

            PrescriptionStatsResponse.Builder responseBuilder = PrescriptionStatsResponse.newBuilder()
                    .setTotalPrescriptionsIssued(stats.getTotalPrescriptionsIssued())
                    .setAvgMedicinesPerPrescription(stats.getAvgMedicinesPerPrescription())
                    .setTemplateModificationRatio(stats.getTemplateModificationRatio());

            if (stats.getTopMedicines() != null) {
                stats.getTopMedicines().forEach(med ->
                        responseBuilder.addTopMedicines(
                                TopMedicine.newBuilder()
                                        .setMedicineId(med.getMedicineId())
                                        .setMedicineName(med.getMedicineName())
                                        .setCount(med.getCount())
                                        .build()
                        )
                );
            }

            if (stats.getFavoriteTemplatesUsed() != null) {
                stats.getFavoriteTemplatesUsed().forEach(tmpl ->
                        responseBuilder.addFavoriteTemplatesUsed(
                                FavoriteTemplateUsage.newBuilder()
                                        .setTemplateId(tmpl.getTemplateId())
                                        .setTemplateName(tmpl.getTemplateName())
                                        .setUsageCount(tmpl.getUsageCount())
                                        .build()
                        )
                );
            }

            if (stats.getPrescriptionGrowthTrend() != null) {
                stats.getPrescriptionGrowthTrend().forEach(gr ->
                        responseBuilder.addPrescriptionGrowthTrend(
                                PrescriptionGrowth.newBuilder()
                                        .setYear(gr.getYear())
                                        .setMonth(gr.getMonth())
                                        .setTotalPrescriptions(gr.getTotalPrescriptions())
                                        .build()
                        )
                );
            }

            responseObserver.onNext(responseBuilder.build());
            responseObserver.onCompleted();

        } catch (Exception e) {
            log.error("Error in getPrescriptionStats", e);
            responseObserver.onError(
                    Status.INTERNAL
                            .withDescription("Error fetching prescription stats: " + e.getMessage())
                            .withCause(e)
                            .asRuntimeException()
            );
        }
    }
}