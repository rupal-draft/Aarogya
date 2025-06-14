package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.DrugAllergy;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DrugAllergyRepository extends MongoRepository<DrugAllergy, String> {

    List<DrugAllergy> findByPatientIdAndIsActive(String patientId, boolean isActive);

    List<DrugAllergy> findByPatientId(String patientId);

    @Query("{ 'allergen': { $regex: ?0, $options: 'i' }, 'patientId': ?1, 'isActive': true }")
    List<DrugAllergy> findByAllergenContainingIgnoreCaseAndPatientIdAndIsActive(String allergen, String patientId);

    List<DrugAllergy> findBySeverityAndIsActive(String severity, boolean isActive);

    @Query("{ 'patientId': ?0, 'allergen': ?1, 'isActive': true }")
    List<DrugAllergy> findActiveAllergyByPatientAndAllergen(String patientId, String allergen);

    long countByPatientIdAndIsActive(String patientId, boolean isActive);
}
