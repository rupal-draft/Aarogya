package com.aarogya.prescription_service.controller;

import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.PrescriptionTemplateDTO;
import com.aarogya.prescription_service.service.PrescriptionTemplateService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prescription-templates")
@RequiredArgsConstructor
@Validated
public class PrescriptionTemplateController {

    private final PrescriptionTemplateService templateService;
    private final String doctorId = UserContextHolder.getUserDetails().getUserId();

    @PostMapping
    public ResponseEntity<PrescriptionTemplateDTO> createTemplate(
            @Valid @RequestBody PrescriptionTemplateDTO templateDTO) {

        templateDTO.setDoctorId(doctorId);
        PrescriptionTemplateDTO template = templateService.createTemplate(templateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(template);
    }

    @PutMapping("/{templateId}")
    public ResponseEntity<PrescriptionTemplateDTO> updateTemplate(
            @PathVariable String templateId,
            @Valid @RequestBody PrescriptionTemplateDTO templateDTO) {

        templateDTO.setDoctorId(doctorId);
        PrescriptionTemplateDTO template = templateService.updateTemplate(templateId, templateDTO);
        return ResponseEntity.ok(template);
    }

    @GetMapping("/{templateId}")
    public ResponseEntity<PrescriptionTemplateDTO> getTemplate(
            @PathVariable String templateId) {

        PrescriptionTemplateDTO template = templateService.getTemplateById(templateId);
        return ResponseEntity.ok(template);
    }

    @GetMapping("/doctors/{doctorId}")
    public ResponseEntity<Page<PrescriptionTemplateDTO>> getDoctorTemplates(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "usageCount") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<PrescriptionTemplateDTO> templates = templateService.getDoctorTemplates(doctorId, pageRequest);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/doctors/{doctorId}/category/{category}")
    public ResponseEntity<List<PrescriptionTemplateDTO>> getTemplatesByCategory(
            @PathVariable String doctorId,
            @PathVariable String category) {

        List<PrescriptionTemplateDTO> templates = templateService.getTemplatesByCategory(doctorId, category);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/doctors/{doctorId}/condition/{condition}")
    public ResponseEntity<List<PrescriptionTemplateDTO>> getTemplatesByCondition(
            @PathVariable String doctorId,
            @PathVariable String condition) {

        List<PrescriptionTemplateDTO> templates = templateService.getTemplatesByCondition(doctorId, condition);
        return ResponseEntity.ok(templates);
    }

    @GetMapping("/public")
    public ResponseEntity<Page<PrescriptionTemplateDTO>> getPublicTemplates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("usageCount").descending());
        Page<PrescriptionTemplateDTO> templates = templateService.getPublicTemplates(pageRequest);
        return ResponseEntity.ok(templates);
    }

    @DeleteMapping("/{templateId}")
    public ResponseEntity<Void> deleteTemplate(
            @PathVariable String templateId) {

        templateService.deleteTemplate(templateId, doctorId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<PrescriptionTemplateDTO>> searchTemplates(
            @RequestParam String query) {

        List<PrescriptionTemplateDTO> templates = templateService.searchTemplates(query, doctorId);
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/{templateId}/duplicate")
    public ResponseEntity<PrescriptionTemplateDTO> duplicateTemplate(
            @PathVariable String templateId,
            @RequestParam String newName) {

        PrescriptionTemplateDTO template = templateService.duplicateTemplate(templateId, newName, doctorId);
        return ResponseEntity.status(HttpStatus.CREATED).body(template);
    }

    @PostMapping("/{templateId}/use")
    public ResponseEntity<Void> incrementUsageCount(
            @PathVariable String templateId) {

        templateService.incrementUsageCount(templateId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/doctors/{doctorId}/popular")
    public ResponseEntity<List<PrescriptionTemplateDTO>> getPopularTemplates(
            @PathVariable String doctorId) {

        List<PrescriptionTemplateDTO> templates = templateService.getPopularTemplates(doctorId);
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/{templateId}/approve")
    public ResponseEntity<PrescriptionTemplateDTO> approveTemplate(
            @PathVariable String templateId) {

        PrescriptionTemplateDTO template = templateService.approveTemplate(templateId, doctorId);
        return ResponseEntity.ok(template);
    }

    @PostMapping("/{templateId}/share")
    public ResponseEntity<Void> shareTemplate(
            @PathVariable String templateId,
            @RequestParam boolean isPublic) {

        templateService.shareTemplate(templateId, isPublic);
        return ResponseEntity.ok().build();
    }
}
