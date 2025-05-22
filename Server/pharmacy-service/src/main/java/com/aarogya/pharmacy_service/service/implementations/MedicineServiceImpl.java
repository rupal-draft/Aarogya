package com.aarogya.pharmacy_service.service.implementations;

import com.aarogya.pharmacy_service.auth.UserContextHolder;
import com.aarogya.pharmacy_service.documents.Medicine;
import com.aarogya.pharmacy_service.dto.medicine.MedicineCreationDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineResponseDTO;
import com.aarogya.pharmacy_service.dto.medicine.MedicineStockUpdateDTO;
import com.aarogya.pharmacy_service.exceptions.MedicineNotFoundException;
import com.aarogya.pharmacy_service.exceptions.ServiceUnavailable;
import com.aarogya.pharmacy_service.mapper.MedicineMapper;
import com.aarogya.pharmacy_service.repository.MedicineRepository;
import com.aarogya.pharmacy_service.service.MedicineService;
import com.aarogya.pharmacy_service.utils.CheckRole;
import com.aarogya.pharmacy_service.utils.TextExtractionUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineServiceImpl implements MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;

    @Autowired
    private final TextExtractionUtil textExtractionUtil;

    @Transactional(readOnly = true)
    @Cacheable(value = "medicines")
    public List<MedicineResponseDTO> getAllMedicines() {
        log.info("Fetching all medicines");
        try {
            return medicineRepository.findAll().stream()
                    .map(medicineMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching medicines: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "medicines", key = "#id")
    public MedicineResponseDTO getMedicineById(String id) {
        log.info("Fetching medicine with id: {}", id);
        try {
            Medicine medicine = medicineRepository.findById(id)
                    .orElseThrow(() -> new MedicineNotFoundException(id));
            return medicineMapper.toResponseDTO(medicine);
        } catch (Exception e) {
            log.error("Error fetching medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    @CacheEvict(value = "medicines", allEntries = true)
    public MedicineResponseDTO createMedicine(MedicineCreationDTO medicineCreationDTO) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Creating medicine with details: {}", medicineCreationDTO);
        try {
            Medicine medicine = medicineMapper.toEntity(medicineCreationDTO);
            medicine.setCreatedAt(LocalDateTime.now());
            medicine.setUpdatedAt(LocalDateTime.now());
            Medicine savedMedicine = medicineRepository.save(medicine);
            return medicineMapper.toResponseDTO(savedMedicine);
        } catch (DataAccessException e) {
            log.error("Error creating medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        } catch (Exception e) {
            log.error("Error creating medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    @CacheEvict(value = "medicines", allEntries = true)
    public MedicineResponseDTO updateMedicine(String id, MedicineDTO medicineDTO) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        try {
            log.info("Updating medicine with id: {}", id);
            Medicine existingMedicine = medicineRepository.findById(id)
                    .orElseThrow(() -> new MedicineNotFoundException(id));

            medicineMapper.updateMedicineFromDTO(medicineDTO, existingMedicine);
            existingMedicine.setUpdatedAt(LocalDateTime.now());

            Medicine updatedMedicine = medicineRepository.save(existingMedicine);
            return medicineMapper.toResponseDTO(updatedMedicine);
        } catch (DataAccessException e) {
            log.error("Error updating medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        } catch (Exception e) {
            log.error("Error updating medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    @CacheEvict(value = "medicines", allEntries = true)
    public void deleteMedicine(String id) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Deleting medicine with id: {}", id);
        try {
            if (!medicineRepository.existsById(id)) {
                throw new MedicineNotFoundException(id);
            }
            medicineRepository.deleteById(id);
        } catch (Exception e) {
            log.error("Error deleting medicine: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "medicines", key = "#query")
    public List<MedicineResponseDTO> searchMedicines(String query) {
        log.info("Searching medicines with query: {}", query);
        try {
            if (query == null) {
                return getAllMedicines();
            }
            return medicineRepository.findByNameContainingIgnoreCase(query).stream()
                    .map(medicineMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error searching medicines: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "medicines", key = "#category + #prescriptionRequired")
    public List<MedicineResponseDTO> getMedicinesByCategory(String category) {
        log.info("Fetching medicines by category: {}", category);
        try {
            if (category != null) {
                return medicineRepository.findByCategory(category).stream()
                        .map(medicineMapper::toResponseDTO)
                        .collect(Collectors.toList());
            }
            return getAllMedicines();
        } catch (Exception e) {
            log.error("Error filtering medicines: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional
    public MedicineResponseDTO updateStock(String id, MedicineStockUpdateDTO stockUpdateDTO) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Updating stock for medicine with id: {}", id);
        try {
            Medicine medicine = medicineRepository.findById(id)
                    .orElseThrow(() -> new MedicineNotFoundException(id));

            medicine.setStockQuantity(stockUpdateDTO.getStockQuantity());
            medicine.setUpdatedAt(LocalDateTime.now());

            Medicine updatedMedicine = medicineRepository.save(medicine);
            return medicineMapper.toResponseDTO(updatedMedicine);
        } catch (Exception e) {
            log.error("Error updating stock: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "medicines", key = "#threshold")
    public List<MedicineResponseDTO> getLowStockMedicines(int threshold) {
        CheckRole.checkRole(UserContextHolder.getUserDetails().getRole(), "ADMIN");
        log.info("Fetching medicines with stock quantity less than: {}", threshold);
        try {
            return medicineRepository.findByStockQuantityLessThan(threshold).stream()
                    .map(medicineMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Error fetching medicines with low stock: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MedicineResponseDTO> searchMedicinesFromPrescription(MultipartFile file) {
        try {
            String extractedText = textExtractionUtil.extractTextFromFile(file);
            log.info("Extracted text from file: {}", extractedText);
            List<String> medicines = new ArrayList<>();
            log.info("Extracted medicines from prescription: {}", medicines);
            return medicines.stream()
                    .map(medicineRepository::findByName)
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .map(medicineMapper::toResponseDTO)
                    .collect(Collectors.toList());
        } catch (IOException e) {
            log.error("Error extracting text from file: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        } catch (Exception e) {
            log.error("Error searching medicines from prescription: {}", e.getMessage());
            throw new ServiceUnavailable(e.getMessage());
        }
    }
}
