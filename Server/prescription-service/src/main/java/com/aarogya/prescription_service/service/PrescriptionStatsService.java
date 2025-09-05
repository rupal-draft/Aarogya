package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.grpc.PrescriptionDashboardResponse;

public interface PrescriptionStatsService {
    PrescriptionDashboardResponse getDoctorPrescriptionStats(String doctorId);
}
