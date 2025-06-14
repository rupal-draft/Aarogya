package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.MedicineInventory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedicineInventoryRepository extends MongoRepository<MedicineInventory, String> {

    Optional<MedicineInventory> findByMedicineCode(String medicineCode);

    @Query("{ 'medicineName': { $regex: ?0, $options: 'i' } }")
    List<MedicineInventory> findByMedicineNameContainingIgnoreCase(String medicineName);

    @Query("{ 'genericName': { $regex: ?0, $options: 'i' } }")
    List<MedicineInventory> findByGenericNameContainingIgnoreCase(String genericName);

    List<MedicineInventory> findByPharmacyId(String pharmacyId);

    @Query("{ 'currentStock': { $lte: '$reorderLevel' }, 'status': 'AVAILABLE' }")
    List<MedicineInventory> findLowStockMedicines();

    @Query("{ 'expiryDate': { $lte: ?0 }, 'status': 'AVAILABLE' }")
    List<MedicineInventory> findExpiringMedicines(LocalDate date);

    @Query("{ 'status': 'OUT_OF_STOCK' }")
    List<MedicineInventory> findOutOfStockMedicines();

    List<MedicineInventory> findByStatus(String status);

    Page<MedicineInventory> findByPharmacyIdOrderByMedicineNameAsc(String pharmacyId, Pageable pageable);

    @Query("{ 'isControlledSubstance': true }")
    List<MedicineInventory> findControlledSubstances();
}
