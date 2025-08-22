package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.CreateLabTestRequest;
import com.aarogya.lab_service.dto.request.UpdateLabTestRequest;
import com.aarogya.lab_service.dto.response.LabTestResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LabTestService {

    LabTestResponse createTest(CreateLabTestRequest request);

    List<LabTestResponse> createTestsBulk(List<CreateLabTestRequest> requests);

    LabTestResponse updateTest(String testId, UpdateLabTestRequest request);

    void deactivateTest(String testId);

    List<LabTestResponse> getAllActiveTests();

    Page<LabTestResponse> getAllActiveTests(int page, int size);

    List<LabTestResponse> getTestsByCategory(String category);

    Page<LabTestResponse> searchTests(String searchTerm, int page, int size);

    List<String> getAllCategories();

    LabTestResponse getTestById(String testId);

    LabTestResponse getTestByCode(String testCode);

    List<LabTestResponse> getTestsByIds(List<String> testIds);
}
