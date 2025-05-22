package com.aarogya.pharmacy_service.repository;

import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.repository.projections.MedicineNameProjection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicineRepository extends MongoRepository<Medicine, String> {

    @Query("{'name': {$regex : ?0, $options: 'i'}}")
    List<Medicine> findByNameContainingIgnoreCase(String name);

    List<Medicine> findByCategory(String category);

    List<Medicine> findByStockQuantityLessThan(int threshold);

    @Query(value = "{}", fields = "{ 'name' : 1, '_id' : 0 }")
    List<MedicineNameProjection> findAllMedicineNames();

    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    List<Medicine> findByNameRegex(String regex);
}
