package com.aarogya.payment_service.service;

import com.aarogya.payment_service.dto.grpc.PaymentDashboardResponse;

public interface PaymentStatsService {
    PaymentDashboardResponse getDoctorDashboardStats(String doctorId);
}
