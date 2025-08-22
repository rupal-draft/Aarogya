package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.CreateLabResultRequest;
import com.aarogya.lab_service.dto.request.UpdateLabResultRequest;
import com.aarogya.lab_service.dto.response.LabResultResponse;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

public interface LabResultService {

    LabResultResponse createResult(CreateLabResultRequest request);

    List<LabResultResponse> createResultsBulk(List<CreateLabResultRequest> requests);

    LabResultResponse verifyResult(String resultId, String pathologistId);

    Page<LabResultResponse> getPendingResults(int page, int size);

    void notifyCriticalResult(String resultId);

    Page<LabResultResponse> getPatientResults(String patientId, int page, int size);

    Page<LabResultResponse> getDoctorPatientResults(String doctorId, int page, int size);

    List<LabResultResponse> getOrderResults(String orderId);

    LabResultResponse getResultById(String resultId);

    LabResultResponse updateResult(String resultId, UpdateLabResultRequest request);

    List<LabResultResponse> getPatientResultsByDateRange(String patientId,
                                                         LocalDateTime startDate,
                                                         LocalDateTime endDate);

    List<LabResultResponse> getAbnormalResults(String patientId);

    void createResultsForOrder(String orderId);
}
