package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.dto.PrescriptionTemplateDTO;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.exceptions.ResourceNotFound;
import com.aarogya.prescription_service.model.PrescriptionTemplate;
import com.aarogya.prescription_service.repository.PrescriptionTemplateRepository;
import com.aarogya.prescription_service.service.PrescriptionTemplateService;
import com.aarogya.prescription_service.validator.PrescriptionValidator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Validated
public class PrescriptionTemplateServiceImpl implements PrescriptionTemplateService {

    private final PrescriptionTemplateRepository templateRepository;
    private final ModelMapper modelMapper;
    private final PrescriptionValidator prescriptionValidator;


    @Override
    @Transactional
    @CacheEvict(value = "prescriptionTemplates", allEntries = true)
    public PrescriptionTemplateDTO createTemplate(PrescriptionTemplateDTO templateDTO) {
        prescriptionValidator.validatePrescriptionTemplate(templateDTO);

        PrescriptionTemplate template = modelMapper.map(templateDTO, PrescriptionTemplate.class);
        template.setUsageCount(0);
        template.setPublicTemplate(false);
        template.setApprovedTemplate(false);

        PrescriptionTemplate savedTemplate = templateRepository.save(template);

        log.info("Prescription template created: {} by doctor: {}", savedTemplate.getId(), templateDTO.getDoctorId());
        return modelMapper.map(savedTemplate, PrescriptionTemplateDTO.class);
    }

    @Override
    @Transactional
    @CacheEvict(value = "prescriptionTemplates", allEntries = true)
    public PrescriptionTemplateDTO updateTemplate(String templateId, PrescriptionTemplateDTO templateDTO) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        if (!template.getDoctorId().equals(templateDTO.getDoctorId())) {
            throw new BadRequestException("Unauthorized to update this template");
        }

        prescriptionValidator.validatePrescriptionTemplate(templateDTO);

        template.setTemplateName(templateDTO.getTemplateName());
        template.setDescription(templateDTO.getDescription());
        template.setCategory(templateDTO.getCategory());
        template.setCondition(templateDTO.getCondition());
        template.setStandardInstructions(templateDTO.getStandardInstructions());
        template.setFollowUpInstructions(templateDTO.getFollowUpInstructions());
        template.setEmergencyInstructions(templateDTO.getEmergencyInstructions());

        if (templateDTO.getMedicines() != null) {
            List<PrescriptionTemplate.TemplateMedicine> medicines = templateDTO.getMedicines().stream()
                    .map(dto -> modelMapper.map(dto, PrescriptionTemplate.TemplateMedicine.class))
                    .collect(Collectors.toList());
            template.setMedicines(medicines);
        }

        PrescriptionTemplate updatedTemplate = templateRepository.save(template);

        log.info("Prescription template updated: {}", templateId);
        return modelMapper.map(updatedTemplate, PrescriptionTemplateDTO.class);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#templateId")
    public PrescriptionTemplateDTO getTemplateById(String templateId) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        return modelMapper.map(template, PrescriptionTemplateDTO.class);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#doctorId")
    public Page<PrescriptionTemplateDTO> getDoctorTemplates(String doctorId, Pageable pageable) {
        Page<PrescriptionTemplate> templates = templateRepository.findByDoctorIdOrderByUsageCountDesc(doctorId, pageable);

        return templates.map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class));
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#doctorId + #category")
    public List<PrescriptionTemplateDTO> getTemplatesByCategory(String doctorId, String category) {
        List<PrescriptionTemplate> templates = templateRepository.findByDoctorIdAndCategory(doctorId, category);

        return templates.stream()
                .map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#doctorId + #condition")
    public List<PrescriptionTemplateDTO> getTemplatesByCondition(String doctorId, String condition) {
        List<PrescriptionTemplate> templates = templateRepository.findByDoctorIdAndCondition(doctorId, condition);

        return templates.stream()
                .map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = "prescriptionTemplates")
    public Page<PrescriptionTemplateDTO> getPublicTemplates(Pageable pageable) {
        Page<PrescriptionTemplate> templates = templateRepository.findPublicApprovedTemplates(pageable);

        return templates.map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class));
    }

    @Override
    @Transactional
    @CacheEvict(value = "prescriptionTemplates", allEntries = true)
    public void deleteTemplate(String templateId, String doctorId) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        if (!template.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("Unauthorized to delete this template");
        }

        templateRepository.delete(template);
        log.info("Prescription template deleted: {} by doctor: {}", templateId, doctorId);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#query + #doctorId")
    public List<PrescriptionTemplateDTO> searchTemplates(String query, String doctorId) {
        List<PrescriptionTemplate> templates = templateRepository.findByTemplateNameContainingIgnoreCaseAndDoctorId(query, doctorId);

        List<PrescriptionTemplate> conditionTemplates = templateRepository.findByConditionContainingIgnoreCaseAndDoctorId(query, doctorId);
        templates.addAll(conditionTemplates);

        return templates.stream()
                .distinct()
                .map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrescriptionTemplateDTO duplicateTemplate(String templateId, String newName, String doctorId) {
        PrescriptionTemplate originalTemplate = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        PrescriptionTemplate duplicateTemplate = PrescriptionTemplate.builder()
                .doctorId(doctorId)
                .templateName(newName)
                .description(originalTemplate.getDescription() + " (Copy)")
                .category(originalTemplate.getCategory())
                .condition(originalTemplate.getCondition())
                .medicines(originalTemplate.getMedicines())
                .standardInstructions(originalTemplate.getStandardInstructions())
                .followUpInstructions(originalTemplate.getFollowUpInstructions())
                .emergencyInstructions(originalTemplate.getEmergencyInstructions())
                .usageCount(0)
                .publicTemplate(false)
                .approvedTemplate(false)
                .build();

        PrescriptionTemplate savedTemplate = templateRepository.save(duplicateTemplate);

        log.info("Prescription template duplicated: {} -> {} by doctor: {}", templateId, savedTemplate.getId(), doctorId);
        return modelMapper.map(savedTemplate, PrescriptionTemplateDTO.class);
    }

    @Override
    @Transactional
    public void incrementUsageCount(String templateId) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        template.setUsageCount(template.getUsageCount() + 1);
        template.setLastUsed(LocalDateTime.now());

        templateRepository.save(template);
    }

    @Override
    @Cacheable(value = "prescriptionTemplates", key = "#doctorId")
    public List<PrescriptionTemplateDTO> getPopularTemplates(String doctorId) {
        List<PrescriptionTemplate> templates = templateRepository.findTop10ByDoctorIdOrderByUsageCountDesc(doctorId);

        return templates.stream()
                .map(template -> modelMapper.map(template, PrescriptionTemplateDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public PrescriptionTemplateDTO approveTemplate(String templateId, String approvedBy) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        template.setApprovedTemplate(true);
        template.setApprovedBy(approvedBy);
        template.setApprovedAt(LocalDateTime.now());

        PrescriptionTemplate approvedTemplate = templateRepository.save(template);

        log.info("Prescription template approved: {} by: {}", templateId, approvedBy);
        return modelMapper.map(approvedTemplate, PrescriptionTemplateDTO.class);
    }

    @Override
    @Transactional
    public void shareTemplate(String templateId, boolean isPublic) {
        PrescriptionTemplate template = templateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFound("Prescription Template not found with id: " + templateId));

        template.setPublicTemplate(isPublic);
        templateRepository.save(template);

        log.info("Prescription template sharing updated: {} - public: {}", templateId, isPublic);
    }
}
