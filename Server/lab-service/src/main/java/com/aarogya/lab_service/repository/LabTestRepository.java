package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.SampleType;
import com.aarogya.lab_service.enums.TestType;
import com.aarogya.lab_service.model.LabTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends MongoRepository<LabTest, String> {

    Page<LabTest> findByIsActiveTrueOrderByNameAsc(Pageable pageable);

    Page<LabTest> findByCategoryIdAndIsActiveTrueOrderByNameAsc(String categoryId, Pageable pageable);

    List<LabTest> findByTypeAndIsActiveTrueOrderByNameAsc(TestType type);

    List<LabTest> findBySampleTypeAndIsActiveTrueOrderByNameAsc(SampleType sampleType);

    @Query("{ 'isActive': true, $or: [ " +
            "  { 'name': { $regex: ?0, $options: 'i' } }, " +
            "  { 'keywords': { $in: [?0] } } " +
            "] }")
    List<LabTest> searchByNameOrKeywords(String searchTerm);

    Optional<LabTest> findByCodeAndIsActiveTrue(String code);

    List<LabTest> findByIsUrgentTrueAndIsActiveTrueOrderByPriorityDesc();

    List<LabTest> findByIsFastingTrueAndIsActiveTrueOrderByNameAsc();

    List<LabTest> findByProcessingTimeHoursLessThanEqualAndIsActiveTrueOrderByProcessingTimeHoursAsc(Integer hours);

    boolean existsByCodeAndIsActiveTrue(String code);

    List<LabTest> findByIdInAndIsActiveTrue(List<String> ids);
}

