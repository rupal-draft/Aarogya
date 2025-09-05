package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.grpc.LabDashboardResponse;

public interface LabStatsService {

    LabDashboardResponse getDoctorLabStats(String doctorId);
}
