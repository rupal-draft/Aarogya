package com.aarogya.doctor_service.services.rating;

import com.aarogya.doctor_service.dto.rating.response.DoctorRatingDashboardResponse;

public interface RatingStatsService {
    DoctorRatingDashboardResponse getDoctorRatingStats(String doctorId);
}
