package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.TemplateCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TemplateCategoryRepository extends MongoRepository<TemplateCategory, String> {

    Optional<TemplateCategory> findByDoctorIdAndNameAndIsActiveTrue(String doctorId, String name);

    List<TemplateCategory> findByDoctorIdAndIsActiveTrue(String doctorId);

    Page<TemplateCategory> findByDoctorIdAndIsActiveTrue(String doctorId, Pageable pageable);

    Boolean existsByDoctorIdAndNameAndIsActiveTrue(String doctorId, String name);
}
