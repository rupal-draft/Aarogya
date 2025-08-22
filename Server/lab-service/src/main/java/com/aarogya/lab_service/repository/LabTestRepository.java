package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.models.LabTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabTestRepository extends MongoRepository<LabTest, String> {

    Optional<LabTest> findByTestCodeAndIsActiveTrue(String testCode);

    List<LabTest> findByIsActiveTrueOrderByTestNameAsc();

    Page<LabTest> findByIsActiveTrueOrderByTestNameAsc(Pageable pageable);

    List<LabTest> findByCategoryAndIsActiveTrueOrderByTestNameAsc(String category);

    @Query("{'$and': [{'isActive': true}, {'$or': [{'testName': {'$regex': ?0, '$options': 'i'}}, {'testCode': {'$regex': ?0, '$options': 'i'}}, {'category': {'$regex': ?0, '$options': 'i'}}]}]}")
    Page<LabTest> searchActiveTests(String searchTerm, Pageable pageable);

    @Aggregation(pipeline = {
            "{ '$match': { 'isActive': true } }",
            "{ '$group': { '_id': '$category' } }"
    })
    List<String> findDistinctCategoriesByIsActiveTrue();

}
