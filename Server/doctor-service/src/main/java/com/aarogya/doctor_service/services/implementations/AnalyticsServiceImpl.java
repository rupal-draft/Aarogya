package com.aarogya.doctor_service.services.implementations;

import com.aarogya.doctor_service.dto.DashboardDataDTO;
import com.aarogya.doctor_service.exceptions.ResourceNotFoundException;
import com.aarogya.doctor_service.repositories.DoctorRatingRepository;
import com.aarogya.doctor_service.services.AnalyticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final DoctorRatingRepository ratingRepository;

    @Override
    @Cacheable(value = "dashboardData", key = "#doctorId")
    public DashboardDataDTO getDashboardData(String doctorId) {
        // Verify doctor exists
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        LocalDate today = LocalDate.now();

        // Get today's appointments
        var todayAppointments = appointmentServiceClient.getDoctorAppointmentsByDate(doctorId, today);

        // Get pending appointments
        var pendingAppointments = appointmentServiceClient.getDoctorAppointmentsByStatus(doctorId, "pending");

        // Get upcoming appointments (limited to 5)
        var upcomingAppointments = appointmentServiceClient.getDoctorAppointmentsByStatus(doctorId, "approved")
                .stream()
                .filter(apt -> apt.getAppointmentDate().isEqual(today) || apt.getAppointmentDate().isAfter(today))
                .limit(5)
                .collect(Collectors.toList());

        // Get total unique patients
        var allPatients = getDoctorPatients(doctorId);

        // Build dashboard stats
        DashboardStatsDTO stats = DashboardStatsDTO.builder()
                .todayAppointments(todayAppointments.size())
                .pendingAppointments(pendingAppointments.size())
                .totalPatients(allPatients.size())
                .build();

        // TODO: Get recent articles (placeholder for now)
        List<ArticleDTO> recentArticles = List.of();

        return DashboardDataDTO.builder()
                .stats(stats)
                .upcomingAppointments(upcomingAppointments)
                .recentArticles(recentArticles)
                .build();
    }

    @Override
    @Cacheable(value = "analytics", key = "#doctorId + ':start:' + #startDate + ':end:' + #endDate")
    public AnalyticsDTO getDoctorAnalytics(String doctorId, LocalDate startDate, LocalDate endDate) {
        // Verify doctor exists
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Get appointment stats
        var appointmentStats = appointmentServiceClient.getAppointmentStats(doctorId, startDate, endDate);

        // Get rating stats
        var ratingStats = ratingRepository.getRatingStatsByDoctorId(doctorId);

        // Get doctor ratings/reviews
        var ratings = ratingRepository.findByDoctorId(doctorId);
        var ratingDTOs = ratings.stream()
                .map(rating -> {
                    DoctorRatingDTO dto = new DoctorRatingDTO();
                    dto.setId(rating.getId());
                    dto.setDoctorId(rating.getDoctorId());
                    dto.setPatientId(rating.getPatientId());
                    dto.setAppointmentId(rating.getAppointmentId());
                    dto.setRating(rating.getRating());
                    dto.setReview(rating.getReview());
                    dto.setCreatedAt(rating.getCreatedAt());

                    // Get patient name from Auth service
                    try {
                        PatientDTO patient = authServiceClient.getPatientById(rating.getPatientId());
                        dto.setPatientName(patient.getFirstName() + " " + patient.getLastName());
                    } catch (Exception e) {
                        log.error("Error fetching patient details for rating: {}", e.getMessage());
                        dto.setPatientName("Unknown Patient");
                    }

                    return dto;
                })
                .collect(Collectors.toList());

        // TODO: Get patient demographics (placeholder for now)
        List<PatientDemographicsDTO> patientDemographics = List.of();

        // Build analytics response
        AppointmentStatsDTO appointmentStatsDTO = AppointmentStatsDTO.builder()
                .totalAppointments(appointmentStats.getTotalAppointments())
                .completedAppointments(appointmentStats.getCompletedAppointments())
                .cancelledAppointments(appointmentStats.getCancelledAppointments())
                .uniquePatients(appointmentStats.getUniquePatients())
                .avgConsultationMinutes(appointmentStats.getAvgConsultationMinutes())
                .build();

        RatingStatsDTO ratingStatsDTO = RatingStatsDTO.builder()
                .totalRatings(ratingStats != null ? ratingStats.getCount() : 0)
                .averageRating(ratingStats != null ? ratingStats.getAvgRating() : 0.0)
                .fiveStarRatings(ratingStats != null ? ratingStats.getFiveStarCount() : 0)
                .build();

        return AnalyticsDTO.builder()
                .appointmentStats(appointmentStatsDTO)
                .ratingStats(ratingStatsDTO)
                .patientDemographics(patientDemographics)
                .reviews(ratingDTOs)
                .build();
    }

    @Override
    @Cacheable(value = "patientHistory", key = "#doctorId + ':patient:' + #patientId")
    public PatientHistoryDTO getPatientHistory(String doctorId, String patientId) {
        // Verify doctor exists
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", doctorId));

        // Get patient details
        PatientDTO patient = authServiceClient.getPatientById(patientId);

        // Get appointments for this doctor and patient
        List<AppointmentDTO> appointments = appointmentServiceClient.getDoctorPatientAppointments(doctorId, patientId);

        // Get prescriptions for this doctor and patient
        var prescriptions = prescriptionRepository.findByDoctorIdAndPatientId(doctorId, patientId);
        List<PrescriptionDTO> prescriptionDTOs = prescriptions.stream()
                .map(prescription -> {
                    PrescriptionDTO dto = new PrescriptionDTO();
                    dto.setId(prescription.getId());
                    dto.setAppointmentId(prescription.getAppointmentId());
                    dto.setDoctorId(prescription.getDoctorId());
                    dto.setPatientId(prescription.getPatientId());
                    dto.setDiagnosis(prescription.getDiagnosis());
                    dto.setNotes(prescription.getNotes());
                    dto.setCreatedAt(prescription.getCreatedAt());
                    dto.setUpdatedAt(prescription.getUpdatedAt());

                    // Map medicines
                    List<PrescriptionMedicineDTO> medicines = prescription.getMedicines().stream()
                            .map(medicine -> PrescriptionMedicineDTO.builder()
                                    .medicineName(medicine.getMedicineName())
                                    .dosage(medicine.getDosage())
                                    .frequency(medicine.getFrequency())
                                    .duration(medicine.getDuration())
                                    .instructions(medicine.getInstructions())
                                    .build())
                            .collect(Collectors.toList());

                    dto.setMedicines(medicines);
                    dto.setPatientFirstName(patient.getFirstName());
                    dto.setPatientLastName(patient.getLastName());

                    return dto;
                })
                .collect(Collectors.toList());

        return PatientHistoryDTO.builder()
                .patient(patient)
                .appointments(appointments)
                .prescriptions(prescriptionDTOs)
                .build();
    }

    private List<PatientDTO> getDoctorPatients(String doctorId) {
        // Get all appointments for this doctor
        var appointments = appointmentServiceClient.getDoctorAppointmentsByStatus(doctorId, "all");

        // Extract unique patient IDs
        var patientIds = appointments.stream()
                .map(AppointmentDTO::getPatientId)
                .distinct()
                .collect(Collectors.toList());

        // Fetch patient details from Auth service
        return authServiceClient.getPatientsByIds(patientIds);
    }
}
