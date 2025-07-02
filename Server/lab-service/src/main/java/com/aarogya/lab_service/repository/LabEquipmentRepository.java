package com.aarogya.lab_service.repository;

import com.aarogya.lab_service.enums.EquipmentStatus;
import com.aarogya.lab_service.enums.EquipmentType;
import com.aarogya.lab_service.model.LabEquipment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LabEquipmentRepository extends MongoRepository<LabEquipment, String> {

    List<LabEquipment> findByStatusOrderByNameAsc(EquipmentStatus status);

    List<LabEquipment> findByTypeOrderByNameAsc(EquipmentType type);

    Optional<LabEquipment> findBySerialNumber(String serialNumber);

    @Query("{ 'supportedTests': { $in: [?0] }, 'status': 'ACTIVE' }")
    List<LabEquipment> findBySupportedTestsContaining(String testId);

    List<LabEquipment> findByAssignedTechnicianOrderByNameAsc(String technicianId);

    @Query("{ 'nextMaintenanceDate': { $lte: ?0 } }")
    List<LabEquipment> findEquipmentRequiringMaintenance(LocalDate currentDate);

    @Query("{ 'nextCalibrationDate': { $lte: ?0 } }")
    List<LabEquipment> findEquipmentRequiringCalibration(LocalDate currentDate);

    List<LabEquipment> findByLocationOrderByNameAsc(String location);

    long countByStatus(EquipmentStatus status);

    long countByType(EquipmentType type);
}
