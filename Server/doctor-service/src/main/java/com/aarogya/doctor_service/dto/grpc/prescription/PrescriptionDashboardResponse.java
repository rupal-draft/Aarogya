package com.aarogya.doctor_service.dto.grpc.prescription;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PrescriptionDashboardResponse {
    private Long totalPrescriptionsIssued;
    private List<TopMedicineDto> topMedicines;
    private List<FavoriteTemplateUsageDto> favoriteTemplatesUsed;
    private Double avgMedicinesPerPrescription;
    private Double templateModificationRatio;
    private List<PrescriptionGrowthDto> prescriptionGrowthTrend;
}
