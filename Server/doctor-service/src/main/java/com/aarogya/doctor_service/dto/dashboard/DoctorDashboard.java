package com.aarogya.doctor_service.dto.dashboard;

import com.aarogya.doctor_service.dto.grpc.appointment.DoctorPatientAppointmentStats;
import com.aarogya.doctor_service.dto.grpc.article.DoctorArticleStatsDTO;
import com.aarogya.doctor_service.dto.grpc.auth.DoctorResponseDTO;
import com.aarogya.doctor_service.dto.grpc.lab.LabDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.payment.PaymentDashboardResponse;
import com.aarogya.doctor_service.dto.grpc.prescription.PrescriptionDashboardResponse;
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
}
