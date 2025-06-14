package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.CreatePrescriptionDTO;
import com.aarogya.prescription_service.dto.PrescriptionDTO;
import com.aarogya.prescription_service.dto.PrescriptionSummaryDTO;
import com.aarogya.prescription_service.dto.UpdatePrescriptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;

public interface PrescriptionService {

    PrescriptionDTO createPrescription(CreatePrescriptionDTO createPrescriptionDTO);

    PrescriptionDTO updatePrescription(String prescriptionId, UpdatePrescriptionDTO updatePrescriptionDTO);

    PrescriptionDTO getPrescriptionById(String prescriptionId);

    List<PrescriptionDTO> getPrescriptionsByAppointment(String appointmentId);

    Page<PrescriptionDTO> getDoctorPrescriptions(String doctorId, Pageable pageable);

    Page<PrescriptionDTO> getPatientPrescriptions(String patientId, Pageable pageable);

    List<PrescriptionDTO> getDoctorPatientPrescriptions(String doctorId, String patientId);

    void deletePrescription(String prescriptionId, String deletedBy);

    PrescriptionDTO duplicatePrescription(String prescriptionId, String appointmentId);

    List<PrescriptionDTO> getExpiredPrescriptions();

    List<PrescriptionDTO> getPrescriptionsWithFollowUpDue(LocalDateTime startDate, LocalDateTime endDate);

    PrescriptionDTO refillPrescription(String prescriptionId, String pharmacyId);

    void sendPrescriptionToPharmacy(String prescriptionId, String pharmacyId);

    PrescriptionSummaryDTO getPrescriptionSummary(String doctorId, LocalDateTime startDate, LocalDateTime endDate);

    List<PrescriptionDTO> searchPrescriptions(String query, String doctorId);

    void markPrescriptionAsDispensed(String prescriptionId, String pharmacyId);

    List<PrescriptionDTO> getPrescriptionsForRefill(String patientId);
}
