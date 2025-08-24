package com.aarogya.patient_management_service.service;

import com.aarogya.patient_management_service.dto.request.CreateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.request.UpdateEmergencyContactRequest;
import com.aarogya.patient_management_service.dto.response.EmergencyContactResponse;

import java.util.List;

public interface EmergencyContactService {

    List<EmergencyContactResponse> getPatientEmergencyContacts(String patientId);

    EmergencyContactResponse getEmergencyContact(String patientId, String contactId);

    EmergencyContactResponse getPrimaryContact(String patientId);

    EmergencyContactResponse createEmergencyContact(String patientId, CreateEmergencyContactRequest request);

    EmergencyContactResponse updateEmergencyContact(String patientId, String contactId, UpdateEmergencyContactRequest request);

    EmergencyContactResponse partialUpdateEmergencyContact(String patientId, String contactId, UpdateEmergencyContactRequest request);

    EmergencyContactResponse setPrimaryContact(String patientId, String contactId);

    void deleteEmergencyContact(String patientId, String contactId);
}
