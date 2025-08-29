package com.aarogya.prescription_service.service.implementation;

import com.aarogya.prescription_service.auth.UserContextHolder;
import com.aarogya.prescription_service.dto.*;
import com.aarogya.prescription_service.enums.PrescriptionStatus;
import com.aarogya.prescription_service.enums.Severity;
import com.aarogya.prescription_service.exceptions.AccessForbidden;
import com.aarogya.prescription_service.exceptions.BadRequestException;
import com.aarogya.prescription_service.exceptions.ResourceNotFound;
import com.aarogya.prescription_service.exceptions.ServiceUnavailable;
import com.aarogya.prescription_service.model.Medicine;
import com.aarogya.prescription_service.model.MedicineInteraction;
import com.aarogya.prescription_service.model.PrescribedMedicine;
import com.aarogya.prescription_service.model.Prescription;
import com.aarogya.prescription_service.repository.MedicineInteractionRepository;
import com.aarogya.prescription_service.repository.MedicineRepository;
import com.aarogya.prescription_service.repository.PrescriptionRepository;
import com.aarogya.prescription_service.service.PrescriptionService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicineRepository medicineRepository;
    private final MedicineInteractionRepository interactionRepository;
    private final ModelMapper modelMapper;

    private static final String PRESCRIPTION_CACHE = "prescriptions";
    private static final String MEDICINE_CACHE = "medicines";

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, allEntries = true),
            @CacheEvict(value = "patientPrescriptions", key = "#request.patientId")
    })
    @CircuitBreaker(name = "prescriptionService", fallbackMethod = "createPrescriptionFallback")
    @Retry(name = "prescriptionService")
    public PrescriptionResponse createPrescription(PrescriptionRequest request) {
        log.info("Creating prescription for appointment: {}", request.getAppointmentId());

        List<String> medicineNames = getMedicineNames(request.getMedicines());
        checkForCriticalInteractions(medicineNames);

        Prescription prescription = buildPrescription(request);
        Prescription savedPrescription = prescriptionRepository.save(prescription);

        log.info("Prescription created successfully with ID: {}", savedPrescription.getId());
        return convertToResponse(savedPrescription);
    }

    @Override
    @Cacheable(value = PRESCRIPTION_CACHE, key = "#id")
    public PrescriptionResponse getPrescription(String id) {
        log.debug("Fetching prescription with ID: {}", id);
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + id));
        return convertToResponse(prescription);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, key = "#id"),
            @CacheEvict(value = "patientPrescriptions", allEntries = true)
    })
    @CircuitBreaker(name = "prescriptionService", fallbackMethod = "updatePrescriptionFallback")
    public PrescriptionResponse updatePrescription(String id, PrescriptionRequest request) {
        log.info("Updating prescription with ID: {}", id);

        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + id));

        validateDoctorOwnership(existingPrescription);

        if (request.getMedicines() != null) {
            List<String> medicineNames = getMedicineNames(request.getMedicines());
            checkForCriticalInteractions(medicineNames);
        }

        updatePrescriptionFields(existingPrescription, request);
        Prescription updatedPrescription = prescriptionRepository.save(existingPrescription);

        log.info("Prescription updated successfully with ID: {}", id);
        return convertToResponse(updatedPrescription);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, key = "#id"),
            @CacheEvict(value = "patientPrescriptions", allEntries = true)
    })
    public void deletePrescription(String id) {
        log.info("Deleting prescription with ID: {}", id);

        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + id));

        validateDoctorOwnership(prescription);

        prescriptionRepository.delete(prescription);
        log.info("Prescription deleted successfully with ID: {}", id);
    }

    @Override
    @Cacheable(value = "doctorPrescriptions", key = "#pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<PrescriptionResponse> getPrescriptionsByDoctor(Pageable pageable) {
        String doctorId = UserContextHolder.getUserDetails().getUserId();
        log.debug("Fetching prescriptions for doctor: {}", doctorId);

        return prescriptionRepository.findByDoctorId(doctorId, pageable)
                .map(this::convertToResponse);
    }

    @Override
    @Cacheable(value = "patientPrescriptions", key = "#patientId")
    public List<PrescriptionResponse> getPrescriptionsByPatient(String patientId) {
        log.debug("Fetching prescriptions for patient: {}", patientId);
        return prescriptionRepository.findByPatientId(patientId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Cacheable(value = MEDICINE_CACHE, key = "#request.toString() + '-' + #pageable.pageNumber + '-' + #pageable.pageSize")
    public Page<MedicineDto> searchMedicines(MedicineSearchRequest request, Pageable pageable) {
        log.debug("Searching medicines with criteria: {}", request);

        String searchTerm = buildSearchTerm(request);
        Page<Medicine> medicines = medicineRepository.searchMedicines(searchTerm, pageable);

        return medicines.map(medicine -> modelMapper.map(medicine, MedicineDto.class));
    }

    @Override
    @Cacheable(value = MEDICINE_CACHE, key = "#medicineId")
    public MedicineDto getMedicineDetails(String medicineId) {
        log.debug("Fetching medicine details for ID: {}", medicineId);
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ResourceNotFound("Medicine not found with id: " + medicineId));
        return modelMapper.map(medicine, MedicineDto.class);
    }

    @Override
    public List<MedicineInteractionCheck> checkMedicineInteractions(List<String> medicineIds) {
        log.debug("Checking interactions for medicines: {}", medicineIds);

        List<Medicine> medicines = medicineRepository.findAllById(medicineIds);
        List<String> medicineNames = medicines.stream()
                .map(Medicine::getName)
                .collect(Collectors.toList());

        return checkInteractions(medicineNames);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, key = "#prescriptionId"),
            @CacheEvict(value = "patientPrescriptions", allEntries = true)
    })
    @CircuitBreaker(name = "prescriptionService", fallbackMethod = "addMedicineFallback")
    public PrescriptionResponse addMedicineToPrescription(String prescriptionId, AddMedicineRequest request) {
        log.info("Adding medicine {} to prescription {}", request.getMedicineId(), prescriptionId);

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + prescriptionId));

        validateDoctorOwnership(prescription);
        validateMedicineNotInPrescription(prescription, request.getMedicineId());

        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ResourceNotFound("Medicine not found with id: " + request.getMedicineId()));

        List<String> existingMedicineNames = prescription.getMedicines().stream()
                .map(PrescribedMedicine::getMedicineId)
                .map(this::getMedicineNameById)
                .collect(Collectors.toList());

        existingMedicineNames.add(medicine.getName());
        checkForCriticalInteractions(existingMedicineNames);

        PrescribedMedicine newMedicine = convertToPrescribedMedicine(request);
        prescription.addMedicine(newMedicine);
        prescription.setUpdatedAt(LocalDateTime.now());

        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        log.info("Medicine {} added successfully to prescription {}", request.getMedicineId(), prescriptionId);

        return convertToResponse(updatedPrescription);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, key = "#prescriptionId"),
            @CacheEvict(value = "patientPrescriptions", allEntries = true)
    })
    @CircuitBreaker(name = "prescriptionService", fallbackMethod = "removeMedicineFallback")
    public PrescriptionResponse removeMedicineFromPrescription(String prescriptionId, RemoveMedicineRequest request) {
        log.info("Removing medicine {} from prescription {}", request.getMedicineId(), prescriptionId);

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + prescriptionId));

        validateDoctorOwnership(prescription);
        validateMedicineInPrescription(prescription, request.getMedicineId());

        // Remove the medicine
        prescription.removeMedicine(request.getMedicineId());

        if (prescription.getMedicines().isEmpty()) {
            prescription.setStatus(PrescriptionStatus.CANCELLED);
        }

        prescription.setUpdatedAt(LocalDateTime.now());

        Prescription updatedPrescription = prescriptionRepository.save(prescription);
        log.info("Medicine {} removed successfully from prescription {}", request.getMedicineId(), prescriptionId);

        return convertToResponse(updatedPrescription);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(value = PRESCRIPTION_CACHE, key = "#id"),
            @CacheEvict(value = "patientPrescriptions", allEntries = true)
    })
    @CircuitBreaker(name = "prescriptionService", fallbackMethod = "partialUpdatePrescriptionFallback")
    public PrescriptionResponse partialUpdatePrescription(String id, Map<String, Object> updates) {
        log.info("Partial update of prescription with ID: {}", id);

        validatePartialUpdateFields(updates);

        Prescription existingPrescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFound("Prescription not found with id: " + id));

        validateDoctorOwnership(existingPrescription);

        if (updates.containsKey("medicines")) {
            try {
                @SuppressWarnings("unchecked")
                List<PrescribedMedicineDto> medicineDtos = (List<PrescribedMedicineDto>) updates.get("medicines");
                List<String> medicineNames = getMedicineNames(medicineDtos);
                checkForCriticalInteractions(medicineNames);
            } catch (ClassCastException e) {
                throw new BadRequestException("Invalid format for medicines");
            }
        }

        applyPartialUpdate(existingPrescription, updates);
        Prescription updatedPrescription = prescriptionRepository.save(existingPrescription);

        log.info("Prescription partially updated successfully with ID: {}", id);
        return convertToResponse(updatedPrescription);
    }


    private void validateMedicineNotInPrescription(Prescription prescription, String medicineId) {
        boolean medicineExists = prescription.getMedicines().stream()
                .anyMatch(med -> med.getMedicineId().equals(medicineId));

        if (medicineExists) {
            throw new BadRequestException("Medicine already exists in this prescription");
        }
    }

    private void validateMedicineInPrescription(Prescription prescription, String medicineId) {
        boolean medicineExists = prescription.getMedicines().stream()
                .anyMatch(med -> med.getMedicineId().equals(medicineId));

        if (!medicineExists) {
            throw new ResourceNotFound("Medicine not found in prescription: " + medicineId);
        }
    }

    private void checkForCriticalInteractions(List<String> medicineNames) {
        List<MedicineInteractionCheck> interactions = checkInteractions(medicineNames);

        boolean hasCriticalInteraction = interactions.stream()
                .anyMatch(interaction -> interaction.getSeverity() == Severity.CRITICAL);

        if (hasCriticalInteraction) {
            throw new BadRequestException("Critical medicine interaction detected");
        }
    }

    private List<MedicineInteractionCheck> checkInteractions(List<String> medicineNames) {
        List<MedicineInteraction> interactions = interactionRepository.findInteractionsForDrugs(medicineNames);

        return interactions.stream()
                .map(interaction -> {
                    Severity severity = determineInteractionSeverity(interaction.getInteractionDescription());
                    return MedicineInteractionCheck.builder()
                            .medicineId1(getMedicineIdByName(interaction.getDrug1()))
                            .medicineId2(getMedicineIdByName(interaction.getDrug2()))
                            .interactionDescription(interaction.getInteractionDescription())
                            .severity(severity)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private String getMedicineIdByName(String medicineName) {
        return medicineRepository.findByNameIgnoreCase(medicineName)
                .map(Medicine::getId)
                .orElse(null);
    }

    private Severity determineInteractionSeverity(String description) {
        if (description.toLowerCase().contains("death") ||
                description.toLowerCase().contains("fatal") ||
                description.toLowerCase().contains("contraindicated")) {
            return Severity.CRITICAL;
        } else if (description.toLowerCase().contains("serious") ||
                description.toLowerCase().contains("severe")) {
            return Severity.HIGH;
        } else if (description.toLowerCase().contains("moderate") ||
                description.toLowerCase().contains("caution")) {
            return Severity.MEDIUM;
        }
        return Severity.LOW;
    }

    private Prescription buildPrescription(PrescriptionRequest request) {
        return Prescription.builder()
                .appointmentId(request.getAppointmentId())
                .patientId(request.getPatientId())
                .doctorId(UserContextHolder.getUserDetails().getUserId())
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .medicines(convertToPrescribedMedicines(request.getMedicines()))
                .status(PrescriptionStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    private List<PrescribedMedicine> convertToPrescribedMedicines(List<PrescribedMedicineDto> dtos) {
        return dtos.stream()
                .map(dto -> modelMapper.map(dto, PrescribedMedicine.class))
                .collect(Collectors.toList());
    }

    private PrescriptionResponse convertToResponse(Prescription prescription) {
        PrescriptionResponse response = modelMapper.map(prescription, PrescriptionResponse.class);

        List<PrescribedMedicineResponse> enrichedMedicines = prescription.getMedicines().stream()
                .map(this::enrichMedicineDetails)
                .collect(Collectors.toList());

        response.setMedicines(enrichedMedicines);
        return response;
    }

    private PrescribedMedicineResponse enrichMedicineDetails(PrescribedMedicine prescribedMedicine) {
        PrescribedMedicineResponse response = modelMapper.map(prescribedMedicine, PrescribedMedicineResponse.class);

        Medicine medicine = medicineRepository.findById(prescribedMedicine.getMedicineId())
                .orElse(null);

        if (medicine != null) {
            response.setMedicineName(medicine.getName());

            List<MedicineInteraction> interactions = interactionRepository.findByDrug1(medicine.getName());

            if (!interactions.isEmpty()) {
                Map<String, String> potentialInteractions = interactions.stream()
                        .collect(Collectors.toMap(
                                MedicineInteraction::getDrug2,
                                MedicineInteraction::getInteractionDescription
                        ));
                response.setPotentialInteractions(potentialInteractions);
            }
        }

        return response;
    }

    private void validateDoctorOwnership(Prescription prescription) {
        String currentDoctorId = UserContextHolder.getUserDetails().getUserId();
        if (!prescription.getDoctorId().equals(currentDoctorId)) {
            throw new AccessForbidden("Doctor is not authorized to modify this prescription");
        }
    }

    private List<String> getMedicineNames(List<PrescribedMedicineDto> medicines) {
        List<String> medicineIds = medicines.stream()
                .map(PrescribedMedicineDto::getMedicineId)
                .collect(Collectors.toList());

        return medicineRepository.findAllById(medicineIds).stream()
                .map(Medicine::getName)
                .collect(Collectors.toList());
    }

    private String buildSearchTerm(MedicineSearchRequest request) {
        List<String> terms = new ArrayList<>();

        if (request.getName() != null) terms.add(request.getName());
        if (request.getChemicalClass() != null) terms.add(request.getChemicalClass());
        if (request.getTherapeuticClass() != null) terms.add(request.getTherapeuticClass());
        if (request.getActionClass() != null) terms.add(request.getActionClass());

        return terms.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.joining("|"));
    }

    private void updatePrescriptionFields(Prescription existingPrescription, PrescriptionRequest request) {
        log.debug("Updating prescription fields for ID: {}", existingPrescription.getId());

        if (request.getDiagnosis() != null && !request.getDiagnosis().trim().isEmpty()) {
            existingPrescription.setDiagnosis(request.getDiagnosis().trim());
        }

        if (request.getNotes() != null) {
            existingPrescription.setNotes(request.getNotes().trim());
        }

        if (request.getMedicines() != null && !request.getMedicines().isEmpty()) {
            List<PrescribedMedicine> updatedMedicines = convertToPrescribedMedicines(request.getMedicines());
            existingPrescription.setMedicines(updatedMedicines);
        }

        if (existingPrescription.getMedicines() != null && existingPrescription.getMedicines().isEmpty()) {
            existingPrescription.setStatus(PrescriptionStatus.CANCELLED);
        } else if (existingPrescription.getStatus() == PrescriptionStatus.CANCELLED && existingPrescription.getMedicines() != null) {
            existingPrescription.setStatus(PrescriptionStatus.ACTIVE);
        }

        existingPrescription.setUpdatedAt(LocalDateTime.now());

        log.debug("Prescription fields updated successfully for ID: {}", existingPrescription.getId());
    }

    private void applyPartialUpdate(Prescription existingPrescription, Map<String, Object> updates) {
        log.debug("Applying partial update to prescription ID: {}", existingPrescription.getId());

        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String field = entry.getKey();
            Object value = entry.getValue();

            switch (field) {
                case "diagnosis":
                    if (value instanceof String) {
                        String diagnosis = ((String) value).trim();
                        if (!diagnosis.isEmpty()) {
                            existingPrescription.setDiagnosis(diagnosis);
                        }
                    }
                    break;

                case "notes":
                    if (value instanceof String) {
                        existingPrescription.setNotes(((String) value).trim());
                    } else if (value == null) {
                        existingPrescription.setNotes(null);
                    }
                    break;

                case "status":
                    if (value instanceof String) {
                        try {
                            PrescriptionStatus status = PrescriptionStatus.valueOf(((String) value).toUpperCase());
                            existingPrescription.setStatus(status);
                        } catch (IllegalArgumentException e) {
                            log.warn("Invalid status value: {}", value);
                        }
                    }
                    break;

                case "medicines":
                    if (value instanceof List) {
                        try {
                            @SuppressWarnings("unchecked")
                            List<PrescribedMedicineDto> medicineDtos = (List<PrescribedMedicineDto>) value;
                            List<PrescribedMedicine> medicines = convertToPrescribedMedicines(medicineDtos);
                            existingPrescription.setMedicines(medicines);

                            if (medicines.isEmpty()) {
                                existingPrescription.setStatus(PrescriptionStatus.CANCELLED);
                            } else if (existingPrescription.getStatus() == PrescriptionStatus.CANCELLED) {
                                existingPrescription.setStatus(PrescriptionStatus.ACTIVE);
                            }
                        } catch (ClassCastException e) {
                            log.warn("Invalid medicines format: {}", e.getMessage());
                        }
                    }
                    break;

                default:
                    log.warn("Unknown field for update: {}", field);
                    break;
            }
        }

        existingPrescription.setUpdatedAt(LocalDateTime.now());
        log.debug("Partial update applied successfully to prescription ID: {}", existingPrescription.getId());
    }

    private void validatePartialUpdateFields(Map<String, Object> updates) {
        Set<String> allowedFields = Set.of("diagnosis", "notes", "status", "medicines");

        for (String field : updates.keySet()) {
            if (!allowedFields.contains(field)) {
                throw new BadRequestException("Field not allowed for update: " + field);
            }
        }

        if (updates.containsKey("status")) {
            Object statusValue = updates.get("status");
            if (statusValue instanceof String) {
                try {
                    PrescriptionStatus.valueOf(((String) statusValue).toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new BadRequestException("Invalid status value: " + statusValue);
                }
            } else {
                throw new BadRequestException("Status must be a string");
            }
        }

        if (updates.containsKey("medicines")) {
            Object medicinesValue = updates.get("medicines");
            if (!(medicinesValue instanceof List)) {
                throw new BadRequestException("Medicines must be a list");
            }
        }
    }

    private String getMedicineNameById(String medicineId) {
        return medicineRepository.findById(medicineId)
                .map(Medicine::getName)
                .orElseThrow(() -> new ResourceNotFound("Medicine not found with id: " + medicineId));
    }

    public PrescriptionResponse addMedicineFallback(String prescriptionId, AddMedicineRequest request, Throwable t) {
        log.error("Fallback triggered for addMedicineToPrescription: {}", t.getMessage());
        throw new ServiceUnavailable("Service temporarily unavailable. Please try again later.");
    }

    public PrescriptionResponse removeMedicineFallback(String prescriptionId, RemoveMedicineRequest request, Throwable t) {
        log.error("Fallback triggered for removeMedicineFromPrescription: {}", t.getMessage());
        throw new ServiceUnavailable("Service temporarily unavailable. Please try again later.");
    }

    private PrescribedMedicine convertToPrescribedMedicine(AddMedicineRequest dto) {
        return modelMapper.map(dto, PrescribedMedicine.class);
    }

    public PrescriptionResponse createPrescriptionFallback(PrescriptionRequest request, Throwable t) {
        log.error("Fallback triggered for createPrescription: {}", t.getMessage());
        throw new ServiceUnavailable("Service temporarily unavailable. Please try again later.");
    }

    public PrescriptionResponse updatePrescriptionFallback(String id, PrescriptionRequest request, Throwable t) {
        log.error("Fallback triggered for updatePrescription: {}", t.getMessage());
        throw new ServiceUnavailable("Service temporarily unavailable. Please try again later.");
    }

    public PrescriptionResponse partialUpdatePrescriptionFallback(String id, Map<String, Object> updates, Throwable t) {
        log.error("Fallback triggered for partialUpdatePrescription: {}", t.getMessage());
        throw new ServiceUnavailable("Service temporarily unavailable. Please try again later.");
    }
}
