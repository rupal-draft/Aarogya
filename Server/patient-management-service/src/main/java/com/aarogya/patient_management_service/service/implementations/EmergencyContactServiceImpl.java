package com.aarogya.patient_management_service.service.implementations;

import com.aarogya.patient_management_service.dto.request.CreateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.request.UpdateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.response.EmergencyContactResponse;
import com.aarogya.patient_management_service.exceptions.ResourceNotFoundException;
import com.aarogya.patient_management_service.exceptions.ServiceException;
import com.aarogya.patient_management_service.model.EmergencyContact;
import com.aarogya.patient_management_service.repository.EmergencyContactRepository;
import com.aarogya.patient_management_service.service.EmergencyContactService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmergencyContactServiceImpl implements EmergencyContactService {

    private static final String EMERGENCY_CONTACT_NOT_FOUND = "Emergency contact not found with ID: %s for patient: %s";
    private static final String PRIMARY_CONTACT_NOT_FOUND = "Primary emergency contact not found for patient: %s";
    private static final int MAX_EMERGENCY_CONTACTS = 5;

    private final EmergencyContactRepository emergencyContactRepository;
    private final ModelMapper modelMapper;
    private final CacheManager cacheManager;

    @Override
    @Cacheable(value = "patientEmergencyContacts", key = "#patientId")
    public List<EmergencyContactResponse> getPatientEmergencyContacts(String patientId) {
        try {
            log.info("Fetching emergency contacts for patient: {}", patientId);
            List<EmergencyContact> contacts = emergencyContactRepository
                    .findByPatientIdAndIsActiveTrueOrderByIsPrimaryDescContactNameAsc(patientId);

            log.info("Found {} emergency contacts for patient: {}", contacts.size(), patientId);
            return contacts.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        } catch (DataAccessException e) {
            log.error("Database error while fetching emergency contacts for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch emergency contacts due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "emergencyContact", key = "#patientId + '_' + #contactId")
    public EmergencyContactResponse getEmergencyContact(String patientId, String contactId) {
        try {
            log.info("Fetching emergency contact {} for patient: {}", contactId, patientId);
            EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(EMERGENCY_CONTACT_NOT_FOUND, contactId, patientId)));

            if (!contact.isActive()) {
                throw new ResourceNotFoundException("Emergency contact is not active");
            }

            return mapToResponse(contact);
        } catch (DataAccessException e) {
            log.error("Database error while fetching emergency contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException("Failed to fetch emergency contact due to database error", e);
        }
    }

    @Override
    @Cacheable(value = "primaryContact", key = "#patientId")
    public EmergencyContactResponse getPrimaryContact(String patientId) {
        try {
            log.info("Fetching primary emergency contact for patient: {}", patientId);
            EmergencyContact contact = emergencyContactRepository.findByPatientIdAndIsPrimaryTrueAndIsActiveTrue(patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(PRIMARY_CONTACT_NOT_FOUND, patientId)));
            return mapToResponse(contact);
        } catch (DataAccessException e) {
            log.error("Database error while fetching primary emergency contact for patient: {}", patientId, e);
            throw new ServiceException("Failed to fetch primary emergency contact due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientEmergencyContacts", "primaryContact"}, key = "#patientId")
    public EmergencyContactResponse createEmergencyContact(String patientId, CreateEmergencyContactRequest request) {
        try {
            log.info("Creating emergency contact for patient: {}", patientId);

            validateCreateRequest(request);
            validateContactLimit(patientId);

            if (emergencyContactRepository.existsByPatientIdAndContactNameAndIsActiveTrue(patientId, request.getContactName())) {
                throw new IllegalArgumentException("Emergency contact with this name already exists");
            }

            EmergencyContact contact = EmergencyContact.builder()
                    .patientId(patientId)
                    .contactName(request.getContactName().trim())
                    .relationship(request.getRelationship().trim())
                    .phoneNumber(request.getPhoneNumber().trim())
                    .secondaryPhone(request.getSecondaryPhone() != null ? request.getSecondaryPhone().trim() : null)
                    .email(request.getEmail() != null ? request.getEmail().trim().toLowerCase() : null)
                    .address(request.getAddress() != null ? request.getAddress().trim() : null)
                    .notes(request.getNotes() != null ? request.getNotes().trim() : null)
                    .isPrimary(request.getIsPrimary() != null ? request.getIsPrimary() : false)
                    .isActive(true)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // If this is set as primary, unset other primary contacts
            if (contact.isPrimary()) {
                unsetExistingPrimaryContact(patientId);
            }

            EmergencyContact savedContact = emergencyContactRepository.save(contact);
            log.info("Emergency contact created successfully with ID: {}", savedContact.getId());
            return mapToResponse(savedContact);
        } catch (DataAccessException e) {
            log.error("Database error while creating emergency contact for patient: {}", patientId, e);
            throw new ServiceException("Failed to create emergency contact due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while creating emergency contact for patient: {}", patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientEmergencyContacts", "emergencyContact", "primaryContact"}, allEntries = true)
    public EmergencyContactResponse updateEmergencyContact(String patientId, String contactId, UpdateEmergencyContactRequest request) {
        try {
            log.info("Updating emergency contact {} for patient: {}", contactId, patientId);

            validateUpdateRequest(request);

            EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(EMERGENCY_CONTACT_NOT_FOUND, contactId, patientId)));

            if (!contact.isActive()) {
                throw new ResourceNotFoundException("Cannot update inactive emergency contact");
            }

            // Update fields if provided
            if (request.getContactName() != null) {
                // Check for duplicate contact name (excluding current contact)
                if (!request.getContactName().trim().equalsIgnoreCase(contact.getContactName()) &&
                        emergencyContactRepository.existsByPatientIdAndContactNameAndIsActiveTrue(patientId, request.getContactName())) {
                    throw new IllegalArgumentException("Emergency contact with this name already exists");
                }
                contact.setContactName(request.getContactName().trim());
            }

            if (request.getRelationship() != null) contact.setRelationship(request.getRelationship().trim());
            if (request.getPhoneNumber() != null) contact.setPhoneNumber(request.getPhoneNumber().trim());
            if (request.getSecondaryPhone() != null) contact.setSecondaryPhone(request.getSecondaryPhone().trim());
            if (request.getEmail() != null) contact.setEmail(request.getEmail().trim().toLowerCase());
            if (request.getAddress() != null) contact.setAddress(request.getAddress().trim());
            if (request.getNotes() != null) contact.setNotes(request.getNotes().trim());

            boolean wasPrimary = contact.isPrimary();
            if (request.getIsPrimary() != null) {
                contact.setPrimary(request.getIsPrimary());
            }
            if (request.getIsActive() != null) {
                contact.setActive(request.getIsActive());
            }

            contact.setUpdatedAt(LocalDateTime.now());

            // Handle primary contact logic
            if (request.getIsPrimary() != null && request.getIsPrimary() && !wasPrimary) {
                unsetExistingPrimaryContact(patientId);
            }

            EmergencyContact updatedContact = emergencyContactRepository.save(contact);
            log.info("Emergency contact {} updated successfully", contactId);
            return mapToResponse(updatedContact);
        } catch (DataAccessException e) {
            log.error("Database error while updating emergency contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException("Failed to update emergency contact due to database error", e);
        } catch (IllegalArgumentException e) {
            log.error("Validation error while updating emergency contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException(e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientEmergencyContacts", "emergencyContact", "primaryContact"}, allEntries = true)
    public EmergencyContactResponse partialUpdateEmergencyContact(String patientId, String contactId, UpdateEmergencyContactRequest request) {
        try {
            log.info("Partially updating emergency contact {} for patient: {}", contactId, patientId);

            EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(EMERGENCY_CONTACT_NOT_FOUND, contactId, patientId)));

            if (!contact.isActive()) {
                throw new ResourceNotFoundException("Cannot update inactive emergency contact");
            }

            if (request.getContactName() != null) {
                validateContactName(request.getContactName());
                if (!request.getContactName().trim().equalsIgnoreCase(contact.getContactName()) &&
                        emergencyContactRepository.existsByPatientIdAndContactNameAndIsActiveTrue(patientId, request.getContactName())) {
                    throw new IllegalArgumentException("Emergency contact with this name already exists");
                }
                contact.setContactName(request.getContactName().trim());
            }

            if (request.getRelationship() != null) {
                validateRelationship(request.getRelationship());
                contact.setRelationship(request.getRelationship().trim());
            }

            if (request.getPhoneNumber() != null) {
                validatePhoneNumber(request.getPhoneNumber());
                contact.setPhoneNumber(request.getPhoneNumber().trim());
            }

            if (request.getSecondaryPhone() != null) contact.setSecondaryPhone(request.getSecondaryPhone().trim());
            if (request.getEmail() != null) contact.setEmail(request.getEmail().trim().toLowerCase());
            if (request.getAddress() != null) contact.setAddress(request.getAddress().trim());
            if (request.getNotes() != null) contact.setNotes(request.getNotes().trim());

            boolean wasPrimary = contact.isPrimary();
            if (request.getIsPrimary() != null) {
                contact.setPrimary(request.getIsPrimary());
            }
            if (request.getIsActive() != null) {
                contact.setActive(request.getIsActive());
            }

            contact.setUpdatedAt(LocalDateTime.now());

            // Handle primary contact logic
            if (request.getIsPrimary() != null && request.getIsPrimary() && !wasPrimary) {
                unsetExistingPrimaryContact(patientId);
            }

            EmergencyContact updatedContact = emergencyContactRepository.save(contact);
            log.info("Emergency contact {} partially updated successfully", contactId);
            return mapToResponse(updatedContact);
        } catch (DataAccessException e) {
            log.error("Database error while partially updating emergency contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException("Failed to partially update emergency contact due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientEmergencyContacts", "emergencyContact", "primaryContact"}, allEntries = true)
    public EmergencyContactResponse setPrimaryContact(String patientId, String contactId) {
        try {
            log.info("Setting emergency contact {} as primary for patient: {}", contactId, patientId);

            EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(EMERGENCY_CONTACT_NOT_FOUND, contactId, patientId)));

            if (!contact.isActive()) {
                throw new ResourceNotFoundException("Cannot set inactive emergency contact as primary");
            }

            // Unset current primary if different from new primary
            unsetExistingPrimaryContact(patientId);

            // Set new primary
            contact.setPrimary(true);
            contact.setUpdatedAt(LocalDateTime.now());

            EmergencyContact updatedContact = emergencyContactRepository.save(contact);
            log.info("Emergency contact {} set as primary successfully", contactId);
            return mapToResponse(updatedContact);
        } catch (DataAccessException e) {
            log.error("Database error while setting primary contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException("Failed to set primary contact due to database error", e);
        }
    }

    @Override
    @Transactional
    @CacheEvict(value = {"patientEmergencyContacts", "emergencyContact", "primaryContact"}, allEntries = true)
    public void deleteEmergencyContact(String patientId, String contactId) {
        try {
            log.info("Soft deleting emergency contact {} for patient: {}", contactId, patientId);

            EmergencyContact contact = emergencyContactRepository.findByIdAndPatientId(contactId, patientId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            String.format(EMERGENCY_CONTACT_NOT_FOUND, contactId, patientId)));

            if (contact.isPrimary()) {
                throw new IllegalStateException("Cannot delete primary emergency contact. Set another contact as primary first.");
            }

            contact.setActive(false);
            contact.setUpdatedAt(LocalDateTime.now());
            emergencyContactRepository.save(contact);

            log.info("Emergency contact {} soft deleted successfully", contactId);
        } catch (DataAccessException e) {
            log.error("Database error while deleting emergency contact {} for patient: {}", contactId, patientId, e);
            throw new ServiceException("Failed to delete emergency contact due to database error", e);
        }
    }

    private void unsetExistingPrimaryContact(String patientId) {
        emergencyContactRepository.findByPatientIdAndIsPrimaryTrueAndIsActiveTrue(patientId)
                .ifPresent(existingPrimary -> {
                    existingPrimary.setPrimary(false);
                    existingPrimary.setUpdatedAt(LocalDateTime.now());
                    emergencyContactRepository.save(existingPrimary);
                    log.info("Unset previous primary contact: {}", existingPrimary.getId());
                });
    }

    private void validateContactLimit(String patientId) {
        int currentCount = emergencyContactRepository.countByPatientIdAndIsActiveTrue(patientId);
        if (currentCount >= MAX_EMERGENCY_CONTACTS) {
            throw new IllegalStateException("Maximum limit of " + MAX_EMERGENCY_CONTACTS + " emergency contacts reached");
        }
    }

    private void validateCreateRequest(CreateEmergencyContactRequest request) {
        validateContactName(request.getContactName());
        validateRelationship(request.getRelationship());
        validatePhoneNumber(request.getPhoneNumber());

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            validateEmail(request.getEmail());
        }
    }

    private void validateUpdateRequest(UpdateEmergencyContactRequest request) {
        if (request.getContactName() != null) validateContactName(request.getContactName());
        if (request.getRelationship() != null) validateRelationship(request.getRelationship());
        if (request.getPhoneNumber() != null) validatePhoneNumber(request.getPhoneNumber());
        if (request.getEmail() != null && !request.getEmail().isEmpty()) validateEmail(request.getEmail());
    }

    private void validateContactName(String contactName) {
        if (contactName == null || contactName.trim().isEmpty()) {
            throw new IllegalArgumentException("Contact name is required");
        }
        if (contactName.trim().length() < 2) {
            throw new IllegalArgumentException("Contact name must be at least 2 characters long");
        }
        if (contactName.trim().length() > 100) {
            throw new IllegalArgumentException("Contact name cannot exceed 100 characters");
        }
    }

    private void validateRelationship(String relationship) {
        if (relationship == null || relationship.trim().isEmpty()) {
            throw new IllegalArgumentException("Relationship is required");
        }
        if (relationship.trim().length() > 50) {
            throw new IllegalArgumentException("Relationship cannot exceed 50 characters");
        }
    }

    private void validatePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone number is required");
        }
        if (!phoneNumber.matches("^[\\d\\s\\-()\\+]+$")) {
            throw new IllegalArgumentException("Invalid phone number format");
        }
        if (phoneNumber.replaceAll("\\D", "").length() < 10) {
            throw new IllegalArgumentException("Phone number must contain at least 10 digits");
        }
    }

    private void validateEmail(String email) {
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Invalid email format");
        }
    }

    private EmergencyContactResponse mapToResponse(EmergencyContact contact) {
        try {
            EmergencyContactResponse response = modelMapper.map(contact, EmergencyContactResponse.class);

            // Set additional calculated fields
            response.setRelationshipBadgeColor(getRelationshipBadgeColor(contact.getRelationship()));
            response.setContactInfo(buildContactInfo(contact));
            response.setHasCompleteInfo(hasCompleteInfo(contact));

            return response;
        } catch (Exception e) {
            log.error("Error mapping emergency contact to response for contact ID: {}", contact.getId(), e);
            throw new ServiceException("Failed to map emergency contact to response", e);
        }
    }

    private String getRelationshipBadgeColor(String relationship) {
        if (relationship == null) return "gray";
        return switch (relationship.toLowerCase()) {
            case "spouse", "partner" -> "pink";
            case "parent", "mother", "father" -> "blue";
            case "child", "son", "daughter" -> "green";
            case "sibling", "brother", "sister" -> "purple";
            case "friend" -> "orange";
            case "guardian", "caregiver" -> "red";
            case "relative" -> "teal";
            default -> "gray";
        };
    }

    private String buildContactInfo(EmergencyContact contact) {
        StringBuilder info = new StringBuilder();

        if (contact.getPhoneNumber() != null && !contact.getPhoneNumber().isEmpty()) {
            info.append(formatPhoneNumber(contact.getPhoneNumber()));
        }

        if (contact.getEmail() != null && !contact.getEmail().isEmpty()) {
            if (!info.isEmpty()) info.append(" • ");
            info.append(contact.getEmail());
        }

        return info.toString();
    }

    private String formatPhoneNumber(String phoneNumber) {
        // Basic phone number formatting
        String digits = phoneNumber.replaceAll("[^\\d]", "");
        if (digits.length() == 10) {
            return "(" + digits.substring(0, 3) + ") " + digits.substring(3, 6) + "-" + digits.substring(6);
        }
        return phoneNumber;
    }

    private boolean hasCompleteInfo(EmergencyContact contact) {
        return contact.getContactName() != null && !contact.getContactName().isEmpty() &&
                contact.getRelationship() != null && !contact.getRelationship().isEmpty() &&
                contact.getPhoneNumber() != null && !contact.getPhoneNumber().isEmpty();
    }

    public void clearEmergencyContactCache(String patientId) {
        Objects.requireNonNull(cacheManager.getCache("patientEmergencyContacts")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("primaryContact")).evict(patientId);
        Objects.requireNonNull(cacheManager.getCache("emergencyContact")).clear();
    }
}
