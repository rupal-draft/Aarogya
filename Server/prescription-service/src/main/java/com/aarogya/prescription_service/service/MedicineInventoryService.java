package com.aarogya.prescription_service.service;

import com.aarogya.prescription_service.dto.MedicineInventoryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface MedicineInventoryService {

    MedicineInventoryDTO addMedicine(MedicineInventoryDTO medicineDTO);

    MedicineInventoryDTO updateMedicine(String medicineId, MedicineInventoryDTO medicineDTO);

    MedicineInventoryDTO getMedicineById(String medicineId);

    MedicineInventoryDTO getMedicineByCode(String medicineCode);

    Page<MedicineInventoryDTO> getPharmacyInventory(String pharmacyId, Pageable pageable);

    List<MedicineInventoryDTO> searchMedicines(String query);

    List<MedicineInventoryDTO> getLowStockMedicines();

    List<MedicineInventoryDTO> getExpiringMedicines(LocalDate date);

    List<MedicineInventoryDTO> getOutOfStockMedicines();

    List<MedicineInventoryDTO> getControlledSubstances();

    void updateStock(String medicineId, Integer quantity, String operation);

    void markAsExpired(String medicineId);

    void reorderMedicine(String medicineId);

    boolean checkAvailability(String medicineCode, Integer requiredQuantity);

    void reserveMedicine(String medicineCode, Integer quantity);

    void releaseMedicine(String medicineCode, Integer quantity);

    void dispenseMedicine(String medicineCode, Integer quantity);
}
