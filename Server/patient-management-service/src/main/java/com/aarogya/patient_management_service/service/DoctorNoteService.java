package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.request.UpdateDoctorNoteRequest;
import com.aarogya.patient_management_service.dto.response.DoctorNoteResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DoctorNoteService {

    Page<DoctorNoteResponse> getPatientNotes(String patientId, Pageable pageable);

    DoctorNoteResponse getPatientNote(String patientId, String noteId);

    Page<DoctorNoteResponse> getPatientNotesByType(String patientId, String noteType, Pageable pageable);

    Page<DoctorNoteResponse> getPatientNotesByPriority(String patientId, String priority, Pageable pageable);

    Page<DoctorNoteResponse> getPatientNotesByCategory(String patientId, String category, Pageable pageable);

    Page<DoctorNoteResponse> getNonPrivateNotes(String patientId, Pageable pageable);

    Page<DoctorNoteResponse> getUrgentNotes(String patientId, Pageable pageable);

    Page<DoctorNoteResponse> getRecentNotes(String patientId, int days, Pageable pageable);

    DoctorNoteResponse createDoctorNote(CreateDoctorNoteRequest request);

    DoctorNoteResponse updateDoctorNote(String patientId, String noteId, UpdateDoctorNoteRequest request);

    void deleteDoctorNote(String patientId, String noteId);
}
