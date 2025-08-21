package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.dto.response.LabTestResponse;
import com.aarogya.lab_service.exceptions.ResourceNotFoundException;
import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.service.LabTestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabTestServiceImpl implements LabTestService {

    private final LabTestRepository labTestRepository;
    private final ModelMapper modelMapper;

    @Override
    @Cacheable(value = "labTests", key = "'all'")
    public List<LabTestResponse> getAllActiveTests() {
        log.info("Fetching all active lab tests");
        List<LabTest> tests = labTestRepository.findByIsActiveTrueOrderByTestNameAsc();
        return tests.stream()
                .map(test -> modelMapper.map(test, LabTestResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "labTests", key = "'page_' + #page + '_' + #size")
    public Page<LabTestResponse> getAllActiveTests(int page, int size) {
        log.info("Fetching active lab tests - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<LabTest> testsPage = labTestRepository.findByIsActiveTrueOrderByTestNameAsc(pageable);
        return testsPage.map(test -> modelMapper.map(test, LabTestResponse.class));
    }

    @Override
    @Cacheable(value = "labTests", key = "'category_' + #category")
    public List<LabTestResponse> getTestsByCategory(String category) {
        log.info("Fetching lab tests by category: {}", category);
        List<LabTest> tests = labTestRepository.findByCategoryAndIsActiveTrueOrderByTestNameAsc(category);
        return tests.stream()
                .map(test -> modelMapper.map(test, LabTestResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "labTests", key = "'search_' + #searchTerm + '_' + #page + '_' + #size")
    public Page<LabTestResponse> searchTests(String searchTerm, int page, int size) {
        log.info("Searching lab tests with term: {}, page: {}, size: {}", searchTerm, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<LabTest> testsPage = labTestRepository.searchActiveTests(searchTerm, pageable);
        return testsPage.map(test -> modelMapper.map(test, LabTestResponse.class));
    }

    @Override
    @Cacheable(value = "labTests", key = "'categories'")
    public List<String> getAllCategories() {
        log.info("Fetching all lab test categories");
        return labTestRepository.findDistinctCategoriesByIsActiveTrue();
    }

    @Override
    public LabTestResponse getTestById(String testId) {
        log.info("Fetching lab test by ID: {}", testId);
        LabTest test = labTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Test", testId));

        if (!test.isActive()) {
            throw new ResourceNotFoundException("Active Lab Test", testId);
        }

        return modelMapper.map(test, LabTestResponse.class);
    }

    @Override
    public LabTestResponse getTestByCode(String testCode) {
        log.info("Fetching lab test by code: {}", testCode);
        LabTest test = labTestRepository.findByTestCodeAndIsActiveTrue(testCode)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Test with code", testCode));

        return modelMapper.map(test, LabTestResponse.class);
    }

    @Override
    public List<LabTestResponse> getTestsByIds(List<String> testIds) {
        log.info("Fetching lab tests by IDs: {}", testIds);
        List<LabTest> tests = labTestRepository.findAllById(testIds);

        List<LabTest> activeTests = tests.stream()
                .filter(LabTest::isActive)
                .toList();

        if (activeTests.size() != testIds.size()) {
            log.warn("Some requested tests are not active or not found. Requested: {}, Found active: {}",
                    testIds.size(), activeTests.size());
        }

        return activeTests.stream()
                .map(test -> modelMapper.map(test, LabTestResponse.class))
                .collect(Collectors.toList());
    }
}
