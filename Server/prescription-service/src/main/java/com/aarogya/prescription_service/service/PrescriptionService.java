package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface PrescriptionService {
    PrescriptionResponse createPrescription(PrescriptionRequest request);
    PrescriptionResponse getPrescription(String id);
    PrescriptionResponse updatePrescription(String id, PrescriptionRequest request);
    void deletePrescription(String id);
    Page<PrescriptionResponse> getPrescriptionsByDoctor(Pageable pageable);
    List<PrescriptionResponse> getPrescriptionsByPatient(String patientId);
    Page<MedicineDto> searchMedicines(MedicineSearchRequest request, Pageable pageable);
    MedicineDto getMedicineDetails(String medicineId);
    List<MedicineInteractionCheck> checkMedicineInteractions(List<String> medicineIds);
    PrescriptionResponse addMedicineToPrescription(String prescriptionId, AddMedicineRequest request);
    PrescriptionResponse removeMedicineFromPrescription(String prescriptionId, RemoveMedicineRequest request);
    PrescriptionResponse partialUpdatePrescription(String id, Map<String, Object> updates);
}
