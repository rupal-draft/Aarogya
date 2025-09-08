package com.aarogya.doctor_service.dto.dashboard;

import com.aarogya.doctor_service.dto.availability.response.CalendarQuickViewResponse;
import com.aarogya.doctor_service.dto.forum.response.ForumDashboardResponse;
import com.aarogya.doctor_service.dto.forum.response.JournalDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.appointment.DoctorPatientAppointmentStats;
import com.aarogya.doctor_service.dto.grpc.article.DoctorArticleStatsDTO;
import com.aarogya.doctor_service.dto.grpc.auth.DoctorResponseDTO;
import com.aarogya.doctor_service.dto.grpc.lab.LabDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.payment.PaymentDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.prescription.PrescriptionDashboardResponse;
import com.aarogya.doctor_service.dto.rating.response.DoctorRatingDashboardResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDashboard {
    private DoctorResponseDTO doctorResponseDTO;
    private DoctorPatientAppointmentStats appointmentStats;
    private DoctorArticleStatsDTO articleStats;
    private LabDashboardResponse labStats;
    private PaymentDashboardResponse paymentStats;
    private PrescriptionDashboardResponse prescriptionStats;
    private CalendarQuickViewResponse quickViewResponse;
    private ForumDashboardResponse forumDashboardResponse;
    private JournalDashboardResponse journalDashboardResponse;
    private DoctorRatingDashboardResponse ratingDashboardResponse;
}
