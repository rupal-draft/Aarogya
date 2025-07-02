package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.model.TestCategory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TestCategoryRepository extends MongoRepository<TestCategory, String> {

    List<TestCategory> findByIsActiveTrueOrderByDisplayOrderAsc();

    Optional<TestCategory> findByCodeAndIsActiveTrue(String code);

    Optional<TestCategory> findByNameAndIsActiveTrue(String name);

    List<TestCategory> findByNameContainingIgnoreCaseAndIsActiveTrue(String name);

    boolean existsByNameAndIsActiveTrue(String name);

    boolean existsByCodeAndIsActiveTrue(String code);
}
