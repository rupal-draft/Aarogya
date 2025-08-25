package com.aarogya.patient_management_service.seeders;

import com.aarogya.patient_management_service.model.EmergencyContact;
import com.aarogya.patient_management_service.repository.EmergencyContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EmergencyContactSeederService {

    private final EmergencyContactRepository emergencyContactRepository;

    private static final String PATIENT_ID = "68a80e1b0474d478779e5c6c";

    public List<EmergencyContact> seedEmergencyContacts() {
        if (emergencyContactRepository.count() > 0) {
            return emergencyContactRepository.findAll();
        }

        List<EmergencyContact> contacts = new ArrayList<>();

        contacts.add(EmergencyContact.builder()
                .patientId(PATIENT_ID)
                .contactName("Anita Paul")
                .relationship("Mother")
                .phoneNumber("9876543210")
                .secondaryPhone("9123456789")
                .email("anita.paul@example.com")
                .address("12 Park Street, Kolkata, West Bengal")
                .notes("Primary emergency contact")
                .isPrimary(true)
                .isActive(true)
                .build());

        contacts.add(EmergencyContact.builder()
                .patientId(PATIENT_ID)
                .contactName("Rohit Paul")
                .relationship("Father")
                .phoneNumber("9812345678")
                .email("rohit.paul@example.com")
                .address("12 Park Street, Kolkata, West Bengal")
                .notes("Prefers to be contacted during office hours")
                .isPrimary(false)
                .isActive(true)
                .build());

        contacts.add(EmergencyContact.builder()
                .patientId(PATIENT_ID)
                .contactName("Priya Das")
                .relationship("Sister")
                .phoneNumber("9001234567")
                .email("priya.das@example.com")
                .address("45 Lake Gardens, Kolkata")
                .notes("Lives nearby, can reach hospital quickly")
                .isPrimary(false)
                .isActive(true)
                .build());

        contacts.add(EmergencyContact.builder()
                .patientId(PATIENT_ID)
                .contactName("Arjun Paul")
                .relationship("Brother")
                .phoneNumber("9834567890")
                .email("arjun.paul@example.com")
                .address("Salt Lake Sector V, Kolkata")
                .notes("Has car, available for transport")
                .isPrimary(false)
                .isActive(true)
                .build());

        contacts.add(EmergencyContact.builder()
                .patientId(PATIENT_ID)
                .contactName("Sneha Roy")
                .relationship("Spouse")
                .phoneNumber("9876001122")
                .secondaryPhone("9900334455")
                .email("sneha.roy@example.com")
                .address("Apartment 3B, Ballygunge, Kolkata")
                .notes("Prefers urgent calls only")
                .isPrimary(true)
                .isActive(true)
                .build());

        return emergencyContactRepository.saveAll(contacts);
    }
}

