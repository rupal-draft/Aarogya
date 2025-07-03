package com.aarogya.lab_service.service;

import com.aarogya.lab_service.dto.request.LabTestRequestDto;
import com.aarogya.lab_service.dto.response.LabTestResponseDto;
import com.aarogya.lab_service.dto.response.TestCategoryResponseDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface LabTestService {


    List<TestCategoryResponseDto> getAllTestCategories();


    Page<LabTestResponseDto> getTestsByCategory(String categoryId, int page, int size);


    Page<LabTestResponseDto> getAllTests(int page, int size);


    List<LabTestResponseDto> searchTests(String searchTerm);


    LabTestResponseDto getTestDetails(String testId);


    List<LabTestResponseDto> getTestsByIds(List<String> testIds);


    List<LabTestResponseDto> getUrgentTests();


    List<LabTestResponseDto> getFastingTests();


    List<LabTestResponseDto> getQuickTests(int maxHours);


    LabTestResponseDto createTest(LabTestRequestDto requestDto);


    LabTestResponseDto updateTest(String testId, LabTestRequestDto requestDto);


    void deactivateTest(String testId);
}
