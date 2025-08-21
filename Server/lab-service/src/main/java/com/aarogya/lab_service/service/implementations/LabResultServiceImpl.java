package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.clients.UserGrpcClient;
import com.aarogya.lab_service.dto.grpc.DoctorResponseDTO;
import com.aarogya.lab_service.dto.grpc.PatientResponseDTO;
import com.aarogya.lab_service.dto.request.UpdateLabResultRequest;
import com.aarogya.lab_service.dto.response.LabResultResponse;
import com.aarogya.lab_service.enums.OrderStatus;
import com.aarogya.lab_service.exceptions.AccessForbidden;
import com.aarogya.lab_service.exceptions.ResourceNotFoundException;
import com.aarogya.lab_service.models.LabOrder;
import com.aarogya.lab_service.models.LabResult;
import com.aarogya.lab_service.repository.LabOrderRepository;
import com.aarogya.lab_service.repository.LabResultRepository;
import com.aarogya.lab_service.service.LabResultService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabResultServiceImpl implements LabResultService {

    private final LabResultRepository labResultRepository;
    private final LabOrderRepository labOrderRepository;
    private final ModelMapper modelMapper;
    private final UserGrpcClient userGrpcClient;

    @Override
    @Cacheable(value = "patientResults", key = "#patientId + '_' + #page + '_' + #size")
    public Page<LabResultResponse> getPatientResults(String patientId, int page, int size) {
        log.info("Fetching results for patient: {}, page: {}, size: {}", patientId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<LabResult> resultsPage = labResultRepository.findByPatientIdOrderByResultGeneratedAtDesc(patientId, pageable);

        return resultsPage.map(this::mapToResultResponse);
    }

    @Override
    @Cacheable(value = "doctorResults", key = "#doctorId + '_' + #page + '_' + #size")
    public Page<LabResultResponse> getDoctorPatientResults(String doctorId, int page, int size) {
        log.info("Fetching results for doctor: {}, page: {}, size: {}", doctorId, page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<LabResult> resultsPage = labResultRepository.findByDoctorIdAndIsVerifiedTrue(doctorId, pageable);

        return resultsPage.map(this::mapToResultResponse);
    }

    @Override
    public List<LabResultResponse> getOrderResults(String orderId) {
        log.info("Fetching results for order: {}", orderId);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!order.getPatientId().equals(currentUserId) &&
                (order.getDoctorId() == null || !order.getDoctorId().equals(currentUserId))) {
            throw new AccessForbidden("Access denied to this lab order results");
        }

        List<LabResult> results = labResultRepository.findByOrderId(orderId);
        return results.stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LabResultResponse getResultById(String resultId) {
        log.info("Fetching result by ID: {}", resultId);

        LabResult result = labResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Result", resultId));

        String currentUserId = UserContextHolder.getUserDetails().getUserId();
        if (!result.getPatientId().equals(currentUserId) &&
                (result.getDoctorId() == null || !result.getDoctorId().equals(currentUserId))) {
            throw new AccessForbidden("Access denied to this lab result");
        }

        return mapToResultResponse(result);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientResults", "doctorResults"}, allEntries = true)
    public LabResultResponse updateResult(String resultId, UpdateLabResultRequest request) {
        log.info("Updating lab result: {}", resultId);

        LabResult result = labResultRepository.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Result", resultId));

        result.setParameters(request.getParameters());
        result.setOverallResult(request.getOverallResult());
        result.setInterpretation(request.getInterpretation());
        result.setTechnicalNotes(request.getTechnicalNotes());
        result.setReportUrl(request.getReportUrl());
        result.setSampleCollectedAt(request.getSampleCollectedAt());
        result.setResultGeneratedAt(request.getResultGeneratedAt());
        result.setLabTechnicianId(request.getLabTechnicianId());
        result.setPathologistId(request.getPathologistId());
        result.setCritical(request.isCritical());
        result.setVerified(true);

        boolean isCritical = request.isCritical();
        result.setCritical(isCritical);

        LabResult updatedResult = labResultRepository.save(result);

        updateOrderStatusIfAllTestsCompleted(result.getOrderId());

        log.info("Lab result updated successfully: {}", resultId);
        return mapToResultResponse(updatedResult);
    }

    @Override
    public List<LabResultResponse> getPatientResultsByDateRange(String patientId,
                                                                LocalDateTime startDate,
                                                                LocalDateTime endDate) {
        log.info("Fetching results for patient: {} between {} and {}", patientId, startDate, endDate);

        List<LabResult> results = labResultRepository.findByPatientIdAndResultGeneratedAtBetween(
                patientId, startDate, endDate);

        return results.stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<LabResultResponse> getAbnormalResults(String patientId) {
        log.info("Fetching abnormal results for patient: {}", patientId);

        List<LabResult> results = labResultRepository.findByPatientIdAndOverallResult(patientId, "ABNORMAL");
        results.addAll(labResultRepository.findByPatientIdAndOverallResult(patientId, "CRITICAL"));

        return results.stream()
                .map(this::mapToResultResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void createResultsForOrder(String orderId) {
        log.info("Creating result entries for order: {}", orderId);

        LabOrder order = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Order", orderId));

        List<LabResult> results = order.getOrderedTests().stream()
                .map(ot -> LabResult.fromOrderAndTest(order, ot))
                .collect(Collectors.toList());

        labResultRepository.saveAll(results);
        log.info("Created {} result entries for order: {}", results.size(), orderId);
    }

    private void updateOrderStatusIfAllTestsCompleted(String orderId) {
        List<LabResult> orderResults = labResultRepository.findByOrderId(orderId);

        boolean allResultsVerified = orderResults.stream()
                .allMatch(LabResult::isVerified);

        if (allResultsVerified && !orderResults.isEmpty()) {
            LabOrder order = labOrderRepository.findById(orderId).orElse(null);
            if (order != null && order.getStatus() != OrderStatus.COMPLETED) {
                order.setStatus(OrderStatus.COMPLETED);
                labOrderRepository.save(order);
                log.info("Order {} marked as completed - all results verified", orderId);
            }
        }
    }

    private LabResultResponse mapToResultResponse(LabResult result) {
        LabResultResponse response = modelMapper.map(result, LabResultResponse.class);
        labOrderRepository.findById(result.getOrderId())
                .ifPresent(order -> response.setOrderNumber(order.getOrderNumber()));

        PatientResponseDTO patientResponseDTO = userGrpcClient.getPatient(result.getPatientId());
        response.setPatientName(patientResponseDTO.getFirstName() + " " + patientResponseDTO.getLastName());
        if (result.getDoctorId() != null) {
            DoctorResponseDTO doctorResponseDTO = userGrpcClient.getDoctor(result.getDoctorId());
            response.setDoctorName(doctorResponseDTO.getFirstName() + " " + doctorResponseDTO.getLastName());
        }

        return response;
    }
}
