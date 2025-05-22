package com.aarogya.pharmacy_service.service;

import com.aarogya.pharmacy_service.dto.medicine.MedicineCreationDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineResponseDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineStockUpdateDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface MedicineService {

    List<MedicineResponseDTO> getAllMedicines();

    MedicineResponseDTO getMedicineById(String id);

    MedicineResponseDTO createMedicine(MedicineCreationDTO medicineCreationDTO);

    MedicineResponseDTO updateMedicine(String id, MedicineDTO medicineDTO);

    void deleteMedicine(String id);

    List<MedicineResponseDTO> searchMedicines(String query);

    List<MedicineResponseDTO> getMedicinesByCategory(String category);

    MedicineResponseDTO updateStock(String id, MedicineStockUpdateDTO stockUpdateDTO);

    List<MedicineResponseDTO> getLowStockMedicines(int threshold);

    List<MedicineResponseDTO> searchMedicinesFromPrescription(MultipartFile file);
}
