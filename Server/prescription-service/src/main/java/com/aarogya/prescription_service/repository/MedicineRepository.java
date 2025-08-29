package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.Medicine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {

    @Query("{"
            + "$or: ["
            + "{'name': {$regex: ?0, $options: 'i'}}, "
            + "{'chemicalClass': {$regex: ?0, $options: 'i'}}, "
            + "{'therapeuticClass': {$regex: ?0, $options: 'i'}}, "
            + "{'actionClass': {$regex: ?0, $options: 'i'}}"
            + "]"
            + "}")
    Page<Medicine> searchMedicines(String searchTerm, Pageable pageable);

    @Query(value = "{"
            + "$or: ["
            + "{'name': {$regex: ?0, $options: 'i'}}, "
            + "{'chemicalClass': {$regex: ?0, $options: 'i'}}, "
            + "{'therapeuticClass': {$regex: ?0, $options: 'i'}}, "
            + "{'actionClass': {$regex: ?0, $options: 'i'}}"
            + "]"
            + "}", fields = "{'name': 1, 'chemicalClass': 1, 'therapeuticClass': 1}")
    Page<Medicine> searchMedicinesSummary(String searchTerm, Pageable pageable);

    Optional<Medicine> findByNameIgnoreCase(String name);

    List<Medicine> findByNameIn(List<String> names);
}
