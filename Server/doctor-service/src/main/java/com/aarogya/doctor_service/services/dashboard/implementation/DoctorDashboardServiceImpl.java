package com.aarogya.doctor_service.services.dashboard.implementation;

import com.aarogya.doctor_service.auth.UserContextHolder;
import com.aarogya.doctor_service.clients.*;
import com.aarogya.doctor_service.dto.availability.response.CalendarQuickViewResponse;
import com.aarogya.doctor_service.dto.dashboard.DoctorDashboard;
import com.aarogya.doctor_service.dto.forum.response.ForumDashboardResponse;
import com.aarogya.doctor_service.dto.journal.response.JournalDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.appointment.DoctorPatientAppointmentStats;
import com.aarogya.doctor_service.dto.grpc.article.DoctorArticleStatsDTO;
import com.aarogya.doctor_service.dto.grpc.auth.DoctorResponseDTO;
import com.aarogya.doctor_service.dto.grpc.lab.LabDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.payment.PaymentDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.prescription.PrescriptionDashboardResponse;
import com.aarogya.doctor_service.dto.rating.response.DoctorRatingDashboardResponse;
import com.aarogya.doctor_service.services.availability.AvailabilityQuickViewService;
import com.aarogya.doctor_service.services.dashboard.DoctorDashboardService;
import com.aarogya.doctor_service.services.forum.ForumStatsService;
import com.aarogya.doctor_service.services.journal.JournalStatsService;
import com.aarogya.doctor_service.services.rating.RatingStatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.YearMonth;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorDashboardServiceImpl implements DoctorDashboardService {

    private final UserGrpcClient userGrpcClient;
    private final AppointmentGrpcClient appointmentGrpcClient;
    private final ArticleStatsGrpcClient articleStatsGrpcClient;
    private final LabGrpcClient labGrpcClient;
    private final PaymentGrpcClient paymentGrpcClient;
    private final PrescriptionGrpcClient prescriptionGrpcClient;
    private final AvailabilityQuickViewService availabilityQuickViewService;
    private final ForumStatsService forumStatsService;
    private final RatingStatsService ratingStatsService;
    private final JournalStatsService journalStatsService;

    @Override
    @Cacheable(value = "doctorDashboardCache", key = "#root.methodName + '_' + T(com.aarogya.doctor_service.auth.UserContextHolder).getUserDetails().getUserId()")
    public DoctorDashboard getDoctorDashboardStats() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Fetching Dashboard statistics for Doctor with id: {}", doctorId);

        DoctorResponseDTO doctor = userGrpcClient.getDoctor(doctorId);
        log.debug("Fetched doctor profile for {}", doctorId);

        DoctorPatientAppointmentStats appointmentStats = appointmentGrpcClient.getDoctorAppointmentStats(doctorId);
        log.debug("Fetched appointment & patient stats for {}", doctorId);

        DoctorArticleStatsDTO articleStats = articleStatsGrpcClient.getDoctorArticleStats(doctorId);
        log.debug("Fetched article stats for {}", doctorId);

        LabDashboardResponse labStats = labGrpcClient.getDoctorLabStats(doctorId);
        log.debug("Fetched lab stats for {}", doctorId);

        PaymentDashboardResponse paymentStats = paymentGrpcClient.getPaymentStats(doctorId);
        log.debug("Fetched payment stats for {}", doctorId);

        PrescriptionDashboardResponse prescriptionStats = prescriptionGrpcClient.getPrescriptionStats(doctorId);
        log.debug("Fetched prescription stats for {}", doctorId);

        CalendarQuickViewResponse calendarQuickViewResponse = availabilityQuickViewService.getQuickView(doctorId, YearMonth.now());
        ForumDashboardResponse forumDashboardResponse = forumStatsService.getDoctorForumStats(doctorId);
        JournalDashboardResponse journalDashboardResponse = journalStatsService.getDoctorJournalStats(doctorId);
        DoctorRatingDashboardResponse ratingStatsResponse = ratingStatsService.getDoctorRatingStats(doctorId);

        return DoctorDashboard.builder()
                .doctorResponseDTO(doctor)
                .appointmentStats(appointmentStats)
                .articleStats(articleStats)
                .labStats(labStats)
                .paymentStats(paymentStats)
                .prescriptionStats(prescriptionStats)
                .forumDashboardResponse(forumDashboardResponse)
                .journalDashboardResponse(journalDashboardResponse)
                .quickViewResponse(calendarQuickViewResponse)
                .ratingDashboardResponse(ratingStatsResponse)
                .build();
    }
}
