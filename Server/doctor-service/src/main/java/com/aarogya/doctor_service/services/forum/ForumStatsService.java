package com.aarogya.doctor_service.services.forum;

import com.aarogya.doctor_service.dto.forum.response.ForumDashboardResponse;

public interface ForumStatsService {
    ForumDashboardResponse getDoctorForumStats(String doctorId);
}
