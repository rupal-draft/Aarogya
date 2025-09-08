package com.aarogya.auth_service.util;

import com.aarogya.auth_service.documents.Patient;
import com.aarogya.auth_service.repository.PatientRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@Slf4j
public class PatientSeeder implements CommandLineRunner {

    private final PatientRepository patientRepository;

    public PatientSeeder(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (patientRepository.count() == 1) {
            List<Patient> patients = new ArrayList<>();

            patients.add(Patient.builder()
                    .email("john.doe@example.com")
                    .password("password123")
                    .firstName("John")
                    .lastName("Doe")
                    .dateOfBirth(LocalDate.of(1990, 5, 15))
                    .gender("Male")
                    .bloodGroup("A+")
                    .phone("+919876543210")
                    .address("123 Main Street, Kolkata, India")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=John")
                    .emergencyContact("Jane Doe")
                    .emergencyPhone("+919123456789")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("sarah.smith@example.com")
                    .password("securePass1")
                    .firstName("Sarah")
                    .lastName("Smith")
                    .dateOfBirth(LocalDate.of(1988, 3, 22))
                    .gender("Female")
                    .bloodGroup("O+")
                    .phone("+447912345678")
                    .address("45 Baker Street, London, UK")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Sarah")
                    .emergencyContact("Michael Smith")
                    .emergencyPhone("+447965432198")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("rajiv.kumar@example.com")
                    .password("indiaPass99")
                    .firstName("Rajiv")
                    .lastName("Kumar")
                    .dateOfBirth(LocalDate.of(1995, 9, 10))
                    .gender("Male")
                    .bloodGroup("B+")
                    .phone("+919812345600")
                    .address("Sector 22, Chandigarh, India")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Rajiv")
                    .emergencyContact("Neha Kumar")
                    .emergencyPhone("+919823456789")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("emily.jones@example.com")
                    .password("EmilySecure1")
                    .firstName("Emily")
                    .lastName("Jones")
                    .dateOfBirth(LocalDate.of(1992, 7, 18))
                    .gender("Female")
                    .bloodGroup("AB-")
                    .phone("+14151234567")
                    .address("California Street, San Francisco, USA")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Emily")
                    .emergencyContact("Robert Jones")
                    .emergencyPhone("+14157654321")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("ahmed.hassan@example.com")
                    .password("ahmedPass11")
                    .firstName("Ahmed")
                    .lastName("Hassan")
                    .dateOfBirth(LocalDate.of(1987, 11, 30))
                    .gender("Male")
                    .bloodGroup("O-")
                    .phone("+201234567890")
                    .address("Nasr City, Cairo, Egypt")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Ahmed")
                    .emergencyContact("Fatima Hassan")
                    .emergencyPhone("+201098765432")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("lisa.martin@example.com")
                    .password("lisaSecure22")
                    .firstName("Lisa")
                    .lastName("Martin")
                    .dateOfBirth(LocalDate.of(1998, 4, 5))
                    .gender("Female")
                    .bloodGroup("B-")
                    .phone("+33123456789")
                    .address("Rue de Rivoli, Paris, France")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Lisa")
                    .emergencyContact("Paul Martin")
                    .emergencyPhone("+33987654321")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("kevin.brown@example.com")
                    .password("brownPass77")
                    .firstName("Kevin")
                    .lastName("Brown")
                    .dateOfBirth(LocalDate.of(1993, 12, 25))
                    .gender("Male")
                    .bloodGroup("A-")
                    .phone("+61234567890")
                    .address("George Street, Sydney, Australia")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Kevin")
                    .emergencyContact("Laura Brown")
                    .emergencyPhone("+61987654321")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("maria.garcia@example.com")
                    .password("maria12345")
                    .firstName("Maria")
                    .lastName("Garcia")
                    .dateOfBirth(LocalDate.of(1985, 2, 14))
                    .gender("Female")
                    .bloodGroup("AB+")
                    .phone("+34912345678")
                    .address("Gran Via, Madrid, Spain")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Maria")
                    .emergencyContact("Carlos Garcia")
                    .emergencyPhone("+34987654321")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("david.wilson@example.com")
                    .password("davidPass66")
                    .firstName("David")
                    .lastName("Wilson")
                    .dateOfBirth(LocalDate.of(1991, 6, 8))
                    .gender("Male")
                    .bloodGroup("O+")
                    .phone("+498912345678")
                    .address("Alexanderplatz, Berlin, Germany")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=David")
                    .emergencyContact("Sophia Wilson")
                    .emergencyPhone("+498976543210")
                    .createdAt(LocalDateTime.now())
                    .build());

            patients.add(Patient.builder()
                    .email("anna.kim@example.com")
                    .password("annaPass88")
                    .firstName("Anna")
                    .lastName("Kim")
                    .dateOfBirth(LocalDate.of(1999, 1, 3))
                    .gender("Female")
                    .bloodGroup("B+")
                    .phone("+821012345678")
                    .address("Gangnam, Seoul, South Korea")
                    .imageUrl("https://dummyimage.com/150x150/000/fff&text=Anna")
                    .emergencyContact("Jisoo Kim")
                    .emergencyPhone("+821098765432")
                    .createdAt(LocalDateTime.now())
                    .build());

            patientRepository.saveAll(patients);
            log.info("Saved {} patients in the database", patients.size());
        }
    }
}

