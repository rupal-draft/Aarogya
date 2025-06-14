package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.PrescriptionTemplateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PrescriptionTemplateService {

    PrescriptionTemplateDTO createTemplate(PrescriptionTemplateDTO templateDTO);

    PrescriptionTemplateDTO updateTemplate(String templateId, PrescriptionTemplateDTO templateDTO);

    PrescriptionTemplateDTO getTemplateById(String templateId);

    Page<PrescriptionTemplateDTO> getDoctorTemplates(String doctorId, Pageable pageable);

    List<PrescriptionTemplateDTO> getTemplatesByCategory(String doctorId, String category);

    List<PrescriptionTemplateDTO> getTemplatesByCondition(String doctorId, String condition);

    Page<PrescriptionTemplateDTO> getPublicTemplates(Pageable pageable);

    void deleteTemplate(String templateId, String doctorId);

    List<PrescriptionTemplateDTO> searchTemplates(String query, String doctorId);

    PrescriptionTemplateDTO duplicateTemplate(String templateId, String newName, String doctorId);

    void incrementUsageCount(String templateId);

    List<PrescriptionTemplateDTO> getPopularTemplates(String doctorId);

    PrescriptionTemplateDTO approveTemplate(String templateId, String approvedBy);

    void shareTemplate(String templateId, boolean isPublic);
}
