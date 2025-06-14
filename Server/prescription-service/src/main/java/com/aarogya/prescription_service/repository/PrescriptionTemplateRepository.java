package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.PrescriptionTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionTemplateRepository extends MongoRepository<PrescriptionTemplate, String> {

    Page<PrescriptionTemplate> findByDoctorIdOrderByUsageCountDesc(String doctorId, Pageable pageable);

    List<PrescriptionTemplate> findByDoctorIdAndCategory(String doctorId, String category);

    List<PrescriptionTemplate> findByDoctorIdAndCondition(String doctorId, String condition);

    @Query("{ 'isPublic': true, 'isApproved': true }")
    Page<PrescriptionTemplate> findPublicApprovedTemplates(Pageable pageable);

    @Query("{ 'templateName': { $regex: ?0, $options: 'i' }, 'doctorId': ?1 }")
    List<PrescriptionTemplate> findByTemplateNameContainingIgnoreCaseAndDoctorId(String templateName, String doctorId);

    @Query("{ 'condition': { $regex: ?0, $options: 'i' }, 'doctorId': ?1 }")
    List<PrescriptionTemplate> findByConditionContainingIgnoreCaseAndDoctorId(String condition, String doctorId);

    List<PrescriptionTemplate> findTop10ByDoctorIdOrderByUsageCountDesc(String doctorId);
}