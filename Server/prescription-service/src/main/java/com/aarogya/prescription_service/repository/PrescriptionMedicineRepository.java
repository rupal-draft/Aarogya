package com.aarogya.prescription_service.repository;

import com.aarogya.prescription_service.model.PrescriptionMedicine;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionMedicineRepository extends MongoRepository<PrescriptionMedicine, String> {

    List<PrescriptionMedicine> findByPrescriptionId(String prescriptionId);

    void deleteByPrescriptionId(String prescriptionId);

    @Query("{ 'medicineName': { $regex: ?0, $options: 'i' } }")
    List<PrescriptionMedicine> findByMedicineNameContainingIgnoreCase(String medicineName);

    @Query("{ 'genericName': { $regex: ?0, $options: 'i' } }")
    List<PrescriptionMedicine> findByGenericNameContainingIgnoreCase(String genericName);

    List<PrescriptionMedicine> findByMedicineCode(String medicineCode);

    @Query("{ 'prescriptionId': { $in: ?0 } }")
    List<PrescriptionMedicine> findByPrescriptionIds(List<String> prescriptionIds);
}
