package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.request.*;
import com.aarogya.prescription_service.dto.response.*;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.exceptions.ResourceNotFound;
import com.aarogya.prescription_service.model.PrescribedMedicine;
import com.aarogya.prescription_service.model.PrescriptionTemplate;
import com.aarogya.prescription_service.model.TemplateCategory;
import com.aarogya.prescription_service.model.TemplateUsageStat;
import com.aarogya.prescription_service.repository.PrescriptionTemplateRepository;
import com.aarogya.prescription_service.repository.TemplateCategoryRepository;
import com.aarogya.prescription_service.repository.TemplateUsageStatRepository;
import com.aarogya.prescription_service.service.PrescriptionService;
import com.aarogya.prescription_service.service.PrescriptionTemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionTemplateServiceImpl implements PrescriptionTemplateService {

    private final PrescriptionTemplateRepository templateRepository;
    private final TemplateCategoryRepository categoryRepository;
    private final TemplateUsageStatRepository usageStatRepository;
    private final ModelMapper modelMapper;
    private final MongoTemplate mongoTemplate;
    private final PrescriptionService prescriptionService;

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", allEntries = true),
            @CacheEvict(value = "templateStats", allEntries = true)
    })
    public TemplateResponse createTemplate(CreateTemplateRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating prescription template for doctor: {}", doctorId);

        validateTemplateRequest(request);

        if (templateRepository.findByDoctorIdAndNameAndIsActiveTrue(doctorId, request.getName()).isPresent()) {
            throw new BadRequestException("Template with this name already exists");
        }

        if (request.getCategoryId() != null) {
            validateCategoryOwnership(request.getCategoryId(), doctorId);
        }

        PrescriptionTemplate template = buildTemplate(request, doctorId);
        PrescriptionTemplate savedTemplate = templateRepository.save(template);

        if (request.getCategoryId() != null) {
            updateCategoryTemplateCount(request.getCategoryId(), 1);
        }

        log.info("Template created successfully with ID: {}", savedTemplate.getId());
        return convertToTemplateResponse(savedTemplate);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#templateId")
    public TemplateResponse getTemplate(String templateId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching prescription template: {}", templateId);

        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + templateId));

        validateTemplateAccess(template, doctorId);

        return convertToTemplateResponse(template);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#filter.toString() + '_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<TemplateSummaryResponse> getTemplates(TemplateFilterRequest filter, Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching prescription templates with filter: {}", filter);

        Page<PrescriptionTemplate> templatesPage = applyTemplateFilters(doctorId, filter, pageable);

        return templatesPage.map(this::convertToTemplateSummaryResponse);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", key = "#templateId"),
            @CacheEvict(value = "prescriptionTemplates", allEntries = true),
            @CacheEvict(value = "templateStats", allEntries = true)
    })
    public TemplateResponse updateTemplate(String templateId, UpdateTemplateRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Updating prescription template: {}", templateId);

        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + templateId));

        validateTemplateAccess(template, doctorId);

        String oldCategoryId = template.getCategoryId();
        if (request.getCategoryId() != null && !request.getCategoryId().equals(oldCategoryId)) {
            validateCategoryOwnership(request.getCategoryId(), doctorId);
        }

        updateTemplateFields(template, request);
        PrescriptionTemplate updatedTemplate = templateRepository.save(template);

        if (oldCategoryId != null && !oldCategoryId.equals(request.getCategoryId())) {
            updateCategoryTemplateCount(oldCategoryId, -1);
        }
        if (request.getCategoryId() != null && !request.getCategoryId().equals(oldCategoryId)) {
            updateCategoryTemplateCount(request.getCategoryId(), 1);
        }

        log.info("Template updated successfully: {}", templateId);
        return convertToTemplateResponse(updatedTemplate);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", key = "#templateId"),
            @CacheEvict(value = "prescriptionTemplates", allEntries = true),
            @CacheEvict(value = "templateStats", allEntries = true)
    })
    public void deleteTemplate(String templateId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting prescription template: {}", templateId);

        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + templateId));

        validateTemplateAccess(template, doctorId);

        template.setIsActive(false);
        templateRepository.save(template);

        if (template.getCategoryId() != null) {
            updateCategoryTemplateCount(template.getCategoryId(), -1);
        }

        log.info("Template deleted successfully: {}", templateId);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", key = "#request.templateId"),
            @CacheEvict(value = "templateStats", allEntries = true)
    })
    public PrescriptionResponse applyTemplate(ApplyTemplateRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Applying prescription template: {}", request.getTemplateId());

        PrescriptionTemplate template = templateRepository.findById(request.getTemplateId())
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + request.getTemplateId()));

        validateTemplateAccess(template, doctorId);

        PrescriptionRequest prescriptionRequest = buildPrescriptionFromTemplate(template, request);
        PrescriptionResponse prescription = prescriptionService.createPrescription(prescriptionRequest);

        if (Boolean.TRUE.equals(request.getTrackUsage())) {
            trackTemplateUsage(template, request, doctorId);
        }

        template.setUsageCount(template.getUsageCount() + 1);
        templateRepository.save(template);

        log.info("Template applied successfully to create prescription: {}", prescription.getId());
        return prescription;
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", allEntries = true),
            @CacheEvict(value = "templateStats", allEntries = true)
    })
    public TemplateResponse duplicateTemplate(String templateId, DuplicateTemplateRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Duplicating prescription template: {}", templateId);

        PrescriptionTemplate original = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + templateId));

        validateTemplateAccess(original, doctorId);

        if (templateRepository.findByDoctorIdAndNameAndIsActiveTrue(doctorId, request.getNewName()).isPresent()) {
            throw new BadRequestException("Template with this name already exists");
        }

        PrescriptionTemplate duplicate = buildDuplicateTemplate(original, request, doctorId);
        PrescriptionTemplate savedDuplicate = templateRepository.save(duplicate);

        log.info("Template duplicated successfully with ID: {}", savedDuplicate.getId());
        return convertToTemplateResponse(savedDuplicate);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "prescriptionTemplates", key = "#templateId")
    })
    public TemplateResponse toggleFavorite(String templateId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Toggling favorite for template: {}", templateId);

        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Template not found with id: " + templateId));

        validateTemplateAccess(template, doctorId);

        template.setIsFavorite(!Boolean.TRUE.equals(template.getIsFavorite()));
        PrescriptionTemplate updatedTemplate = templateRepository.save(template);

        return convertToTemplateResponse(updatedTemplate);
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Creating template category for doctor: {}", doctorId);

        validateCategoryRequest(request);

        if (categoryRepository.existsByDoctorIdAndNameAndIsActiveTrue(doctorId, request.getName())) {
            throw new BadRequestException("Category with this name already exists");
        }

        TemplateCategory category = buildCategory(request, doctorId);
        TemplateCategory savedCategory = categoryRepository.save(category);

        return convertToCategoryResponse(savedCategory);
    }

    @Override
    public List<CategoryResponse> getCategories() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching template categories for doctor: {}", doctorId);

        List<TemplateCategory> categories = categoryRepository.findByDoctorIdAndIsActiveTrue(doctorId);

        return categories.stream()
                .map(this::convertToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCategory(String categoryId) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.info("Deleting template category: {}", categoryId);

        TemplateCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFound("Category not found with id: " + categoryId));

        if (!category.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Cannot delete another doctor's category");
        }

        long templateCount = templateRepository.countByDoctorIdAndCategoryIdAndIsActiveTrue(doctorId, categoryId);
        if (templateCount > 0) {
            throw new BadRequestException("Cannot delete category with existing templates");
        }

        category.setIsActive(false);
        categoryRepository.save(category);
    }

    @Override
    @Cacheable(value = "templateStats", key = "'stats:' + T(com.aarogya.prescription_service.auth.UserContextHolder).getUserDetails().getUserId()")
    public TemplateStatsResponse getTemplateStats() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching template statistics for doctor: {}", doctorId);

        Integer totalTemplates = templateRepository.countByDoctorIdAndIsActiveTrue(doctorId);
        Integer favoriteTemplates = templateRepository.countByDoctorIdAndIsFavoriteTrueAndIsActiveTrue(doctorId);
        Integer sharedTemplates = templateRepository.countByDoctorIdAndIsSharedTrueAndIsActiveTrue(doctorId);

        Integer totalUsage = templateRepository.findByDoctorIdAndIsActiveTrue(doctorId)
                .stream()
                .mapToInt(PrescriptionTemplate::getUsageCount)
                .sum();

        List<PrescriptionTemplate> mostUsed = templateRepository.findByDoctorIdAndIsActiveTrueOrderByUsageCountDesc(
                doctorId, PageRequest.of(0, 5));
        Map<String, Integer> mostUsedMap = mostUsed.stream()
                .collect(Collectors.toMap(PrescriptionTemplate::getName, PrescriptionTemplate::getUsageCount));

        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        int usageThisWeek = usageStatRepository.findByDoctorIdAndUsageDateBetween(doctorId, oneWeekAgo, LocalDateTime.now())
                .size();

        Map<String, Integer> categoryUsage = new HashMap<>();
        List<TemplateCategory> categories = categoryRepository.findByDoctorIdAndIsActiveTrue(doctorId);

        for (TemplateCategory category : categories) {
            int usageCount = templateRepository.findByDoctorIdAndCategoryIdAndIsActiveTrue(doctorId, category.getId(), Pageable.unpaged())
                    .stream()
                    .mapToInt(PrescriptionTemplate::getUsageCount)
                    .sum();

            categoryUsage.put(category.getName(), usageCount);
        }

        return TemplateStatsResponse.builder()
                .totalTemplates(totalTemplates)
                .favoriteTemplates(favoriteTemplates)
                .sharedTemplates(sharedTemplates)
                .totalUsageCount(totalUsage)
                .usageThisWeek(usageThisWeek)
                .usageThisMonth(usageThisWeek * 4)
                .mostUsedTemplates(mostUsedMap)
                .categoryUsage(categoryUsage)
                .lastUsedDate(getLastUsedDate(doctorId))
                .build();
    }


    @Override
    public TemplateSearchSuggestion getTemplateSuggestions() {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching template search suggestions for doctor: {}", doctorId);

        List<String> tags = templateRepository.findTagsByDoctorId(doctorId)
                .stream()
                .flatMap(template -> template.getTags().stream())
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<String> diagnoses = templateRepository.findDiagnosesByDoctorId(doctorId)
                .stream()
                .map(PrescriptionTemplate::getDiagnosis)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        List<String> categories = categoryRepository.findByDoctorIdAndIsActiveTrue(doctorId)
                .stream()
                .map(TemplateCategory::getName)
                .collect(Collectors.toList());

        return TemplateSearchSuggestion.builder()
                .tagSuggestions(tags)
                .diagnosisSuggestions(diagnoses)
                .categorySuggestions(categories)
                .build();
    }

    private void validateTemplateRequest(CreateTemplateRequest request) {
        if (request.getMedicines() == null || request.getMedicines().isEmpty()) {
            throw new BadRequestException("At least one medicine is required");
        }

        if (request.getTags() != null && request.getTags().size() > 10) {
            throw new BadRequestException("Maximum 10 tags allowed");
        }
    }

    private void validateCategoryRequest(CreateCategoryRequest request) {
        if (request.getName().length() > 50) {
            throw new BadRequestException("Category name must be less than 50 characters");
        }
    }

    private void validateTemplateAccess(PrescriptionTemplate template, String doctorId) {
        if (!template.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Access denied to this template");
        }
        if (Boolean.FALSE.equals(template.getIsActive())) {
            throw new ResourceNotFound("Template not found");
        }
    }

    private void validateCategoryOwnership(String categoryId, String doctorId) {
        TemplateCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFound("Category not found"));

        if (!category.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Cannot use another doctor's category");
        }
    }

    private PrescriptionTemplate buildTemplate(CreateTemplateRequest request, String doctorId) {
        return PrescriptionTemplate.builder()
                .doctorId(doctorId)
                .name(request.getName())
                .description(request.getDescription())
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .medicines(convertToPrescribedMedicines(request.getMedicines()))
                .tags(request.getTags() != null ? request.getTags() : new ArrayList<>())
                .applicableConditions(request.getApplicableConditions() != null ? request.getApplicableConditions() : new ArrayList<>())
                .usageCount(0)
                .isFavorite(Boolean.TRUE.equals(request.getIsFavorite()))
                .isActive(true)
                .isShared(Boolean.TRUE.equals(request.getIsShared()))
                .shareCount(0)
                .categoryId(request.getCategoryId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private TemplateCategory buildCategory(CreateCategoryRequest request, String doctorId) {
        return TemplateCategory.builder()
                .doctorId(doctorId)
                .name(request.getName())
                .description(request.getDescription())
                .templateCount(0)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .build();
    }

    private void updateTemplateFields(PrescriptionTemplate template, UpdateTemplateRequest request) {
        if (request.getName() != null) {
            template.setName(request.getName());
        }
        if (request.getDescription() != null) {
            template.setDescription(request.getDescription());
        }
        if (request.getDiagnosis() != null) {
            template.setDiagnosis(request.getDiagnosis());
        }
        if (request.getNotes() != null) {
            template.setNotes(request.getNotes());
        }
        if (request.getMedicines() != null) {
            template.setMedicines(convertToPrescribedMedicines(request.getMedicines()));
        }
        if (request.getTags() != null) {
            template.setTags(request.getTags());
        }
        if (request.getApplicableConditions() != null) {
            template.setApplicableConditions(request.getApplicableConditions());
        }
        if (request.getIsFavorite() != null) {
            template.setIsFavorite(request.getIsFavorite());
        }
        if (request.getIsShared() != null) {
            template.setIsShared(request.getIsShared());
        }
        if (request.getCategoryId() != null) {
            template.setCategoryId(request.getCategoryId());
        }
        template.setUpdatedAt(LocalDateTime.now());
    }

    private PrescriptionRequest buildPrescriptionFromTemplate(PrescriptionTemplate template, ApplyTemplateRequest request) {
        return PrescriptionRequest.builder()
                .appointmentId(request.getAppointmentId())
                .patientId(request.getPatientId())
                .diagnosis(request.getDiagnosis() != null ? request.getDiagnosis() : template.getDiagnosis())
                .notes(request.getNotes() != null ? request.getNotes() : template.getNotes())
                .medicines(request.getMedicineOverrides() != null ? request.getMedicineOverrides() :
                        template.getMedicines().stream()
                                .map(med -> modelMapper.map(med, PrescribedMedicineDto.class))
                                .collect(Collectors.toList()))
                .build();
    }

    private void trackTemplateUsage(PrescriptionTemplate template, ApplyTemplateRequest request, String doctorId) {
        TemplateUsageStat usageStat = TemplateUsageStat.builder()
                .templateId(template.getId())
                .doctorId(doctorId)
                .usageDate(LocalDateTime.now())
                .patientId(request.getPatientId())
                .appointmentId(request.getAppointmentId())
                .wasModified(request.getMedicineOverrides() != null && !request.getMedicineOverrides().isEmpty())
                .modifications(request.getMedicineOverrides() != null ? "Medicines modified" : null)
                .createdAt(LocalDateTime.now())
                .build();

        usageStatRepository.save(usageStat);
    }

    private PrescriptionTemplate buildDuplicateTemplate(PrescriptionTemplate original, DuplicateTemplateRequest request, String doctorId) {
        return PrescriptionTemplate.builder()
                .doctorId(doctorId)
                .name(request.getNewName())
                .description(request.getNewDescription() != null ? request.getNewDescription() : original.getDescription())
                .diagnosis(original.getDiagnosis())
                .notes(original.getNotes())
                .medicines(new ArrayList<>(original.getMedicines()))
                .tags(new ArrayList<>(original.getTags()))
                .applicableConditions(new ArrayList<>(original.getApplicableConditions()))
                .usageCount(0)
                .isFavorite(false)
                .isActive(true)
                .isShared(false)
                .shareCount(0)
                .categoryId(original.getCategoryId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private void updateCategoryTemplateCount(String categoryId, int delta) {
        categoryRepository.findById(categoryId).ifPresent(category -> {
            category.setTemplateCount(Math.max(0, category.getTemplateCount() + delta));
            categoryRepository.save(category);
        });
    }

    private LocalDateTime getLastUsedDate(String doctorId) {
        Page<TemplateUsageStat> usageStats = usageStatRepository.findByDoctorIdOrderByUsageDateDesc(
                doctorId, PageRequest.of(0, 1));

        if (usageStats.hasContent()) {
            return usageStats.getContent().getFirst().getUsageDate();
        }
        return null;
    }

    private Page<PrescriptionTemplate> applyTemplateFilters(
            String doctorId,
            TemplateFilterRequest filter,
            Pageable pageable
    ) {
        Query query = new Query();
        List<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where("doctorId").is(doctorId));

        if (filter != null) {
            if (filter.getSearchQuery() != null && !filter.getSearchQuery().isBlank()) {
                String search = filter.getSearchQuery();
                criteriaList.add(new Criteria().orOperator(
                        Criteria.where("title").regex(search, "i"),
                        Criteria.where("description").regex(search, "i"),
                        Criteria.where("notes").regex(search, "i")
                ));
            }

            if (filter.getTags() != null && !filter.getTags().isEmpty()) {
                criteriaList.add(Criteria.where("tags").in(filter.getTags()));
            }

            if (filter.getCategories() != null && !filter.getCategories().isEmpty()) {
                criteriaList.add(Criteria.where("categoryId").in(filter.getCategories()));
            }

            if (Boolean.TRUE.equals(filter.getFavoriteOnly())) {
                criteriaList.add(Criteria.where("isFavorite").is(true));
            }

            if (Boolean.TRUE.equals(filter.getSharedOnly())) {
                criteriaList.add(Criteria.where("isShared").is(true));
            }

            if (Boolean.TRUE.equals(filter.getActiveOnly())) {
                criteriaList.add(Criteria.where("isActive").is(true));
            }
        } else {
            criteriaList.add(Criteria.where("isActive").is(true));
        }

        query.addCriteria(new Criteria().andOperator(criteriaList.toArray(new Criteria[0])));

        if (filter != null && filter.getSortBy() != null) {
            Sort.Direction direction = (filter.getSortOrder() != null &&
                    filter.getSortOrder().equalsIgnoreCase("desc"))
                    ? Sort.Direction.DESC
                    : Sort.Direction.ASC;
            query.with(Sort.by(direction, filter.getSortBy()));
        }

        query.with(pageable);

        List<PrescriptionTemplate> templates = mongoTemplate.find(query, PrescriptionTemplate.class);
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), PrescriptionTemplate.class);

        return new PageImpl<>(templates, pageable, total);
    }


    private TemplateResponse convertToTemplateResponse(PrescriptionTemplate template) {
        TemplateResponse response = modelMapper.map(template, TemplateResponse.class);

        response.setMedicines(template.getMedicines().stream()
                .map(med -> modelMapper.map(med, PrescribedMedicineResponse.class))
                .collect(Collectors.toList()));

        if (template.getCategoryId() != null) {
            categoryRepository.findById(template.getCategoryId()).ifPresent(category -> {
                response.setCategoryName(category.getName());
            });
        }

        return response;
    }

    private TemplateSummaryResponse convertToTemplateSummaryResponse(PrescriptionTemplate template) {
        TemplateSummaryResponse response = modelMapper.map(template, TemplateSummaryResponse.class);

        if (template.getDiagnosis().length() > 100) {
            response.setDiagnosisPreview(template.getDiagnosis().substring(0, 100) + "...");
        } else {
            response.setDiagnosisPreview(template.getDiagnosis());
        }

        response.setMedicineCount(template.getMedicines().size());

        return response;
    }

    private CategoryResponse convertToCategoryResponse(TemplateCategory category) {
        return modelMapper.map(category, CategoryResponse.class);
    }

    private List<PrescribedMedicine> convertToPrescribedMedicines(List<PrescribedMedicineDto> dtos) {
        if (dtos == null) return new ArrayList<>();

        return dtos.stream()
                .map(dto -> modelMapper.map(dto, PrescribedMedicine.class))
                .collect(Collectors.toList());
    }

    private List<PrescribedMedicineDto> convertToPrescribedMedicineDtos(List<PrescribedMedicine> medicines) {
        if (medicines == null) return new ArrayList<>();

        return medicines.stream()
                .map(med -> modelMapper.map(med, PrescribedMedicineDto.class))
                .collect(Collectors.toList());
    }
}
