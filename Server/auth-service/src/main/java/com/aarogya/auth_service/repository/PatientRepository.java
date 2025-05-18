package com.aarogya.auth_service.repository;

import com.aarogya.auth_service.documents.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {

    Optional<Patient> findByEmail(String email);

    List<Patient> findByGender(String gender);

    boolean existsByEmail(String email);
}
