package com.aarogya.doctor_service.clients;

import com.aarogya.doctor_service.dto.grpc.prescription.FavoriteTemplateUsageDto;
import com.aarogya.doctor_service.dto.grpc.prescription.PrescriptionDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.prescription.PrescriptionGrowthDto;
import com.aarogya.doctor_service.dto.grpc.prescription.TopMedicineDto;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.StatusRuntimeException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Slf4j
public class PrescriptionGrpcClient {

    private final ManagedChannel channel;
    private final com.aarogya.prescription.grpc.PrescriptionServiceGrpc.PrescriptionServiceBlockingStub blockingStub;

    public PrescriptionGrpcClient() {
        this.channel = ManagedChannelBuilder.forAddress("localhost", 8084)
                .usePlaintext()
                .build();
        this.blockingStub = com.aarogya.prescription.grpc.PrescriptionServiceGrpc.newBlockingStub(channel);
    }

    public PrescriptionDashboardResponse getPrescriptionStats(String doctorId) {
        try {
            com.aarogya.prescription.grpc.PrescriptionStatsRequest request = com.aarogya.prescription.grpc.PrescriptionStatsRequest.newBuilder()
                    .setDoctorId(doctorId)
                    .build();

            com.aarogya.prescription.grpc.PrescriptionStatsResponse response = blockingStub.getPrescriptionStats(request);
            return mapToPrescriptionDashboardResponse(response);

        } catch (StatusRuntimeException e) {
            log.error("gRPC call to PrescriptionService failed: {}", e.getStatus(), e);
            throw e;
        }
    }

    public void shutdown() throws InterruptedException {
        channel.shutdown().awaitTermination(5, TimeUnit.SECONDS);
    }

    // ================== MAPPING ==================

    private PrescriptionDashboardResponse mapToPrescriptionDashboardResponse(com.aarogya.prescription.grpc.PrescriptionStatsResponse proto) {
        return PrescriptionDashboardResponse.builder()
                .totalPrescriptionsIssued(proto.getTotalPrescriptionsIssued())
                .avgMedicinesPerPrescription(proto.getAvgMedicinesPerPrescription())
                .templateModificationRatio(proto.getTemplateModificationRatio())
                .topMedicines(proto.getTopMedicinesList().stream()
                        .map(this::mapToTopMedicineDto)
                        .collect(Collectors.toList()))
                .favoriteTemplatesUsed(proto.getFavoriteTemplatesUsedList().stream()
                        .map(this::mapToFavoriteTemplateUsageDto)
                        .collect(Collectors.toList()))
                .prescriptionGrowthTrend(proto.getPrescriptionGrowthTrendList().stream()
                        .map(this::mapToPrescriptionGrowthDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private TopMedicineDto mapToTopMedicineDto(com.aarogya.prescription.grpc.TopMedicine proto) {
        return TopMedicineDto.builder()
                .medicineId(proto.getMedicineId())
                .medicineName(proto.getMedicineName())
                .count(proto.getCount())
                .build();
    }

    private FavoriteTemplateUsageDto mapToFavoriteTemplateUsageDto(com.aarogya.prescription.grpc.FavoriteTemplateUsage proto) {
        return FavoriteTemplateUsageDto.builder()
                .templateId(proto.getTemplateId())
                .templateName(proto.getTemplateName())
                .usageCount(proto.getUsageCount())
                .build();
    }

    private PrescriptionGrowthDto mapToPrescriptionGrowthDto(com.aarogya.prescription.grpc.PrescriptionGrowth proto) {
        return PrescriptionGrowthDto.builder()
                .year(proto.getYear())
                .month(proto.getMonth())
                .totalPrescriptions(proto.getTotalPrescriptions())
                .build();
    }
}
