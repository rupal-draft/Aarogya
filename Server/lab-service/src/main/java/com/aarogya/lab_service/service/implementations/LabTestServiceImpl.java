package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.dto.request.CreateLabTestRequest;
import com.aarogya.lab_service.dto.request.UpdateLabTestRequest;
import com.aarogya.lab_service.dto.response.LabTestResponse;
import com.aarogya.lab_service.exceptions.BadRequestException;
import com.aarogya.lab_service.exceptions.ResourceNotFoundException;
import com.aarogya.lab_service.models.LabTest;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.service.LabTestService;
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

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LabTestServiceImpl implements LabTestService {

    private final LabTestRepository labTestRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    @CacheEvict(value = "labTests", allEntries = true)
    public LabTestResponse createTest(CreateLabTestRequest request) {
        log.info("Creating lab test with code: {}", request.getTestCode());

        if (labTestRepository.findByTestCodeAndIsActiveTrue(request.getTestCode()).isPresent()) {
            throw new BadRequestException("Test code already exists: " + request.getTestCode());
        }

        LabTest labTest = modelMapper.map(request, LabTest.class);
        labTest.setActive(true);

        LabTest savedTest = labTestRepository.save(labTest);
        log.info("Lab test created successfully with ID: {}", savedTest.getId());

        return modelMapper.map(savedTest, LabTestResponse.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = "labTests", allEntries = true)
    public List<LabTestResponse> createTestsBulk(List<CreateLabTestRequest> requests) {
        log.info("Creating {} lab tests in bulk", requests.size());

        List<LabTest> tests = requests.stream()
                .map(request -> {
                    LabTest test = modelMapper.map(request, LabTest.class);
                    test.setActive(true);
                    return test;
                })
                .collect(Collectors.toList());

        List<LabTest> savedTests = labTestRepository.saveAll(tests);
        log.info("Created {} lab tests successfully", savedTests.size());

        return savedTests.stream()
                .map(test -> modelMapper.map(test, LabTestResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "labTests", allEntries = true)
    public LabTestResponse updateTest(String testId, UpdateLabTestRequest request) {
        log.info("Updating lab test: {}", testId);

        LabTest test = labTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Test", testId));

        if (request.getTestName() != null) test.setTestName(request.getTestName());
        if (request.getDescription() != null) test.setDescription(request.getDescription());
        if (request.getCategory() != null) test.setCategory(request.getCategory());
        if (request.getPrice() != null) test.setPrice(request.getPrice());
        if (request.getSampleType() != null) test.setSampleType(request.getSampleType());
        if (request.getPreparationTimeHours() != null) test.setPreparationTimeHours(request.getPreparationTimeHours());
        if (request.getPreparationInstructions() != null) test.setPreparationInstructions(request.getPreparationInstructions());
        if (request.getResultTimeHours() != null) test.setResultTimeHours(request.getResultTimeHours());
        if (request.getNormalRanges() != null) test.setNormalRanges(request.getNormalRanges());

        LabTest updatedTest = labTestRepository.save(test);
        log.info("Lab test updated successfully: {}", testId);

        return modelMapper.map(updatedTest, LabTestResponse.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = "labTests", allEntries = true)
    public void deactivateTest(String testId) {
        log.info("Deactivating lab test: {}", testId);

        LabTest test = labTestRepository.findById(testId)
                .orElseThrow(() -> new ResourceNotFoundException("Lab Test", testId));

        test.setActive(false);
        labTestRepository.save(test);

        log.info("Lab test deactivated successfully: {}", testId);
    }

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
