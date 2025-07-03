package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.TestResultRequestDto;
import com.aarogya.lab_service.dto.response.TestResultResponseDto;
import com.aarogya.lab_service.enums.ResultStatus;
import org.springframework.data.domain.Page;

import java.util.List;

public interface TestResultService {

    TestResultResponseDto addTestResult(String orderId, String testId, TestResultRequestDto requestDto);

    TestResultResponseDto updateTestResult(String resultId, TestResultRequestDto requestDto);

    TestResultResponseDto reviewTestResult(String resultId, String comments);

    TestResultResponseDto approveTestResult(String resultId);

    TestResultResponseDto rejectTestResult(String resultId, String reason);

    Page<TestResultResponseDto> getPatientResults(String patientId, ResultStatus status, int page, int size);

    List<TestResultResponseDto> getOrderResults(String orderId);

    List<TestResultResponseDto> getCriticalResults();

    List<TestResultResponseDto> getPendingApprovalResults();

    TestResultResponseDto getResultDetails(String resultId);

    List<TestResultResponseDto> getHistoricalResults(String patientId, String testId);

    byte[] generateResultReport(String resultId);

    TestResultResponseDto addResultAttachment(String resultId, String attachmentUrl);
}
