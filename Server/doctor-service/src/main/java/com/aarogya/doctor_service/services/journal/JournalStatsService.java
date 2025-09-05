package com.aarogya.doctor_service.services.journal;

import com.aarogya.doctor_service.dto.forum.response.JournalDashboardResponse;

public interface JournalStatsService {
    JournalDashboardResponse getDoctorJournalStats(String doctorId);
}
