package com.aarogya.lab_service.service.implementations;

import com.aarogya.lab_service.Clients.LlvmRecommender;
import com.aarogya.lab_service.auth.UserContext;
import com.aarogya.lab_service.auth.UserContextHolder;
import com.aarogya.lab_service.dto.request.FollowUpRequest;
import com.aarogya.lab_service.dto.request.PreventiveCareRequest;
import com.aarogya.lab_service.dto.request.SymptomAnalysisRequest;
import com.aarogya.lab_service.dto.request.SymptomAnalysisRequestDto;
import com.aarogya.lab_service.dto.response.GeminiRecommendationResponse;
import com.aarogya.lab_service.dto.response.TestRecommendationResponseDto;
import com.aarogya.lab_service.enums.RecommendationType;
import com.aarogya.lab_service.exceptions.AccessForbidden;
import com.aarogya.lab_service.exceptions.ResourceNotFound;
import com.aarogya.lab_service.model.LabTest;
import com.aarogya.lab_service.model.TestRecommendation;
import com.aarogya.lab_service.repository.LabTestRepository;
import com.aarogya.lab_service.repository.TestRecommendationRepository;
import com.aarogya.lab_service.service.TestRecommendationService;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TestRecommendationServiceImpl implements TestRecommendationService {

    private final TestRecommendationRepository recommendationRepository;
    private final LabTestRepository labTestRepository;
    private final ModelMapper modelMapper;
    private final LlvmRecommender llvmRecommender;

    @Override
    public TestRecommendationResponseDto getTestRecommendationsForSymptoms(SymptomAnalysisRequestDto requestDto) {
        log.info("Generating test recommendations for symptoms: {}", requestDto.getSymptoms());

        validateRequest(requestDto);
        String doctorId = UserContextHolder.getUserDetails().getUserId();


        GeminiRecommendationResponse aiResponse = llvmRecommender.getTestRecommendations(
                new SymptomAnalysisRequest(
                        requestDto.getSymptoms(),
                        requestDto.getAge(),
                        requestDto.getGender()
                )
        );

        TestRecommendation recommendation = buildRecommendationFromAIResponse(
                requestDto.getPatientId(),
                doctorId,
                RecommendationType.SYMPTOM_BASED,
                aiResponse,
                "Symptom-based test recommendations"
        );

        recommendation.setSymptoms(requestDto.getSymptoms());
        recommendation.setAdditionalNotes(requestDto.getAdditionalNotes());
        recommendation.setSeverity(requestDto.getSeverity());
        recommendation.setDurationInDays(requestDto.getDurationInDays());

        recommendation = recommendationRepository.save(recommendation);

        return enrichResponseDto(mapToResponseDto(recommendation));
    }

    public List<TestRecommendationResponseDto> getPreventiveCareRecommendations(String patientId, int age, String gender) {
        log.info("Generating preventive care recommendations for patient: {}, age: {}, gender: {}",
                patientId, age, gender);

        validatePatientInfo(patientId, age, gender);
        String doctorId = UserContextHolder.getUserDetails().getUserId();

        GeminiRecommendationResponse aiResponse = llvmRecommender.getPreventiveRecommendations(
                new PreventiveCareRequest(age, gender)
        );

        TestRecommendation recommendation = buildRecommendationFromAIResponse(
                patientId,
                doctorId,
                RecommendationType.PREVENTIVE_CARE,
                aiResponse,
                String.format("Preventive care for age %d, gender %s", age, gender)
        );

        recommendation = recommendationRepository.save(recommendation);

        return List.of(enrichResponseDto(mapToResponseDto(recommendation)));
    }


    public TestRecommendationResponseDto getFollowUpRecommendations(String patientId, String previousTestId) {
        log.info("Generating follow-up recommendations for patient: {}, previous test: {}",
                patientId, previousTestId);

        validateFollowUpRequest(patientId, previousTestId);
        String doctorId = UserContextHolder.getUserDetails().getUserId();

        LabTest previousTest = labTestRepository.findById(previousTestId)
                .orElseThrow(() -> new ResourceNotFound("Previous test not found"));

        GeminiRecommendationResponse aiResponse = llvmRecommender.getFollowUpRecommendations(
                new FollowUpRequest(previousTest.getName(), "Normal")
        );

        TestRecommendation recommendation = buildRecommendationFromAIResponse(
                patientId,
                doctorId,
                RecommendationType.FOLLOW_UP,
                aiResponse,
                String.format("Follow-up for %s test", previousTest.getName())
        );

        recommendation = recommendationRepository.save(recommendation);

        return enrichResponseDto(mapToResponseDto(recommendation));
    }

    @Override
    public List<String> getSmartTestSuggestions(String searchQuery) {
        log.info("Getting smart test suggestions for query: {}", searchQuery);

        if (StringUtils.isBlank(searchQuery)) {
            return Collections.emptyList();
        }

        List<LabTest> matchingTests = labTestRepository.searchByNameOrKeywords(searchQuery.trim());

        return matchingTests.stream()
                .map(test -> String.format("%s (%s) - %s",
                        test.getName(),
                        test.getCode(),
                        test.getCategoryId()))
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public TestRecommendationResponseDto setRecommendationDoctorStatus(String recommendationId, boolean accepted, String notes) {
        if (recommendationId == null || recommendationId.isEmpty()) {
            throw new IllegalArgumentException("Recommendation ID cannot be null or empty");
        }

        String doctorId = UserContextHolder.getUserDetails().getUserId();
        if (doctorId == null) {
            throw new AccessForbidden("Doctor must be authenticated to update recommendation status");
        }

        TestRecommendation recommendation = recommendationRepository.findById(recommendationId)
                .orElseThrow(() -> new ResourceNotFound("Test recommendation not found with id: " + recommendationId));

        if (!doctorId.equals(recommendation.getDoctorId())) {
            throw new AccessForbidden("Only the recommending doctor can update the status");
        }

        recommendation.setIsAcceptedByDoctor(accepted);
        if (notes != null && !notes.isEmpty()) {
            String currentInsight = recommendation.getAiInsight() != null ? recommendation.getAiInsight() : "";
            recommendation.setAiInsight(currentInsight + "\n\nDoctor Notes: " + notes);
        }

        recommendation = recommendationRepository.save(recommendation);
        return enrichResponseDto(mapToResponseDto(recommendation));
    }

    @Override
    public List<TestRecommendationResponseDto> markRecommendationsAsOrdered(List<String> recommendationIds) {
        if (recommendationIds == null || recommendationIds.isEmpty()) {
            throw new IllegalArgumentException("Recommendation IDs cannot be null or empty");
        }

        String doctorId = UserContextHolder.getUserDetails().getUserId();
        if (doctorId == null) {
            throw new AccessForbidden("Doctor must be authenticated to mark recommendations as ordered");
        }

        List<TestRecommendation> recommendations = recommendationRepository.findAllById(recommendationIds);

        if (recommendations.size() != recommendationIds.size()) {
            throw new ResourceNotFound("Some recommendations not found");
        }

        recommendations.forEach(rec -> {
            if (!doctorId.equals(rec.getDoctorId())) {
                throw new AccessForbidden("Only the recommending doctor can mark recommendations as ordered");
            }
            if (!Boolean.TRUE.equals(rec.getIsAcceptedByDoctor())) {
                throw new IllegalStateException("Cannot order non-accepted recommendations");
            }
            rec.setIsOrderedByDoctor(true);
        });

        recommendations = recommendationRepository.saveAll(recommendations);
        return recommendations.stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestRecommendationResponseDto> getRecommendationHistory(String patientId, int limit) {
        if (patientId == null || patientId.isEmpty()) {
            throw new IllegalArgumentException("Patient ID cannot be null or empty");
        }
        if (limit <= 0) {
            limit = 10;
        }

        UserContext userDetails = UserContextHolder.getUserDetails();
        if (userDetails == null) {
            throw new AccessForbidden("User must be authenticated");
        }

        if (!userDetails.getUserId().equals(patientId) && !"DOCTOR".equals(userDetails.getRole())) {
            throw new AccessForbidden("Only the patient or a doctor can view recommendation history");
        }

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<TestRecommendation> recommendations = recommendationRepository.findByPatientIdOrderByCreatedAtDesc(patientId, pageable);

        return recommendations.getContent().stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestRecommendationResponseDto> getRecommendationsByDoctor(String doctorId) {
        if (StringUtils.isBlank(doctorId)) {
            throw new IllegalArgumentException("Doctor ID cannot be null or empty");
        }

        UserContext currentUser = UserContextHolder.getUserDetails();
        if (!currentUser.getUserId().equals(doctorId) && !"ADMIN".equals(currentUser.getRole())) {
            throw new AccessForbidden("Only the doctor or admin can view these recommendations");
        }

        List<TestRecommendation> recommendations = recommendationRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
        return recommendations.stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestRecommendationResponseDto> getRecommendationsByType(RecommendationType type) {
        List<TestRecommendation> recommendations = recommendationRepository.findByTypeOrderByCreatedAtDesc(type);
        return recommendations.stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestRecommendationResponseDto> getPendingDoctorAcceptance() {
        List<TestRecommendation> recommendations = recommendationRepository.findByIsAcceptedByDoctorTrueAndIsOrderedByDoctorFalse();
        return recommendations.stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TestRecommendationResponseDto> getRecentHighConfidenceRecommendations(LocalDateTime since) {
        if (since == null) {
            since = LocalDateTime.now().minusDays(7);
        }

        List<TestRecommendation> recommendations = recommendationRepository.findByCreatedAtAfterOrderByConfidenceScoreDesc(since);
        return recommendations.stream()
                .map(this::mapToResponseDto)
                .map(this::enrichResponseDto)
                .collect(Collectors.toList());
    }

    private TestRecommendation buildRecommendationFromAIResponse(
            String patientId, String doctorId, RecommendationType type,
            GeminiRecommendationResponse aiResponse, String reasoning) {

        if (aiResponse == null || aiResponse.getRecommendations() == null) {
            throw new IllegalStateException("AI response is invalid");
        }

        List<TestRecommendation.RecommendedTest> recommendedTests = aiResponse.getRecommendations().stream()
                .filter(Objects::nonNull)
                .map(aiRec -> {
                    String reason = (aiRec.getReason() == null || aiRec.getReason().trim().isEmpty())
                            ? "Recommended based on analysis"
                            : aiRec.getReason();
                    String urgency = (aiRec.getUrgency() == null || aiRec.getUrgency().trim().isEmpty())
                            ? "MEDIUM"
                            : aiRec.getUrgency();
                    return labTestRepository.findByCodeAndIsActiveTrue(aiRec.getTestCode())
                            .map(test -> TestRecommendation.RecommendedTest.builder()
                                    .testId(test.getId())
                                    .testName(test.getName())
                                    .reason(reason)
                                    .urgency(urgency)
                                    .relevanceScore(aiRec.getRelevanceScore() != null ?
                                            aiRec.getRelevanceScore() : 0.5)
                                    .build())
                            .orElse(null);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        String insights = (aiResponse.getAiInsight() == null || aiResponse.getAiInsight().trim().isEmpty() ?
                "No additional insights provided" : aiResponse.getAiInsight());
        return TestRecommendation.builder()
                .patientId(patientId)
                .doctorId(doctorId)
                .type(type)
                .recommendedTests(recommendedTests)
                .confidenceScore(aiResponse.getConfidenceScore() != null ?
                        aiResponse.getConfidenceScore() : 0.0)
                .aiInsight(insights)
                .reasoning(reasoning)
                .build();
    }

    private void validateRequest(SymptomAnalysisRequestDto request) {
        if (request == null || StringUtils.isBlank(request.getPatientId())) {
            throw new IllegalArgumentException("Invalid request - patient ID required");
        }

        if (request.getSymptoms() == null || request.getSymptoms().isEmpty()) {
            throw new IllegalArgumentException("At least one symptom must be provided");
        }
    }

    private void validatePatientInfo(String patientId, int age, String gender) {
        if (StringUtils.isBlank(patientId)) {
            throw new IllegalArgumentException("Patient ID is required");
        }

        if (age < 0 || age > 120) {
            throw new IllegalArgumentException("Invalid age value");
        }

        if (StringUtils.isBlank(gender)) {
            throw new IllegalArgumentException("Gender is required for preventive care recommendations");
        }
    }

    private void validateFollowUpRequest(String patientId, String previousTestId) {
        if (StringUtils.isBlank(patientId)) {
            throw new IllegalArgumentException("Patient ID is required");
        }

        if (StringUtils.isBlank(previousTestId)) {
            throw new IllegalArgumentException("Previous test ID is required for follow-up recommendations");
        }
    }

    private TestRecommendationResponseDto enrichResponseDto(TestRecommendationResponseDto dto) {
        if (dto == null) return null;

        if (dto.getRecommendedTests() != null && !dto.getRecommendedTests().isEmpty()) {
            boolean hasHighUrgency = dto.getRecommendedTests().stream()
                    .anyMatch(t -> t != null && "HIGH".equals(t.getUrgency()));

            boolean hasMediumUrgency = dto.getRecommendedTests().stream()
                    .anyMatch(t -> t != null && "MEDIUM".equals(t.getUrgency()));

            dto.setUrgencyLevel(hasHighUrgency ? "HIGH" : hasMediumUrgency ? "MEDIUM" : "LOW");
        } else {
            dto.setUrgencyLevel("LOW");
        }

        if (dto.getConfidenceScore() != null && dto.getConfidenceLevel() == null) {
            dto.setConfidenceScore(dto.getConfidenceScore() * 100);
        }

        return dto;
    }

    private TestRecommendationResponseDto mapToResponseDto(TestRecommendation recommendation) {
        return modelMapper.map(recommendation, TestRecommendationResponseDto.class);
    }
}
