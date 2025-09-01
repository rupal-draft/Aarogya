package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.PrescriptionTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionTemplateRepository extends MongoRepository<PrescriptionTemplate, String> {

    Optional<PrescriptionTemplate> findByDoctorIdAndNameAndIsActiveTrue(String doctorId, String name);

    Page<PrescriptionTemplate> findByDoctorIdAndIsActiveTrue(String doctorId, Pageable pageable);

    Page<PrescriptionTemplate> findByDoctorIdAndIsFavoriteTrueAndIsActiveTrue(String doctorId, Pageable pageable);

    Page<PrescriptionTemplate> findByDoctorIdAndIsSharedTrueAndIsActiveTrue(String doctorId, Pageable pageable);

    Page<PrescriptionTemplate> findByDoctorIdAndTagsInAndIsActiveTrue(String doctorId, List<String> tags, Pageable pageable);

    Page<PrescriptionTemplate> findByDoctorIdAndCategoryIdAndIsActiveTrue(String doctorId, String categoryId, Pageable pageable);

    @Query("{'doctorId': ?0, 'isActive': true, '$or': ["
            + "{'name': {$regex: ?1, $options: 'i'}}, "
            + "{'diagnosis': {$regex: ?1, $options: 'i'}}, "
            + "{'description': {$regex: ?1, $options: 'i'}}, "
            + "{'tags': {$regex: ?1, $options: 'i'}}"
            + "]}")
    Page<PrescriptionTemplate> search(String doctorId, String searchQuery, Pageable pageable);

    List<PrescriptionTemplate> findByDoctorIdAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndIsFavoriteTrueAndIsActiveTrue(String doctorId);

    Integer countByDoctorIdAndIsSharedTrueAndIsActiveTrue(String doctorId);

    @Query(value = "{'doctorId': ?0, 'isActive': true}", fields = "{'tags': 1}")
    List<PrescriptionTemplate> findTagsByDoctorId(String doctorId);

    @Query(value = "{'doctorId': ?0, 'isActive': true}", fields = "{'diagnosis': 1}")
    List<PrescriptionTemplate> findDiagnosesByDoctorId(String doctorId);

    List<PrescriptionTemplate> findByDoctorIdAndIsActiveTrueOrderByUsageCountDesc(String doctorId, Pageable pageable);

    long countByDoctorIdAndCategoryIdAndIsActiveTrue(String doctorId, String categoryId);
}
