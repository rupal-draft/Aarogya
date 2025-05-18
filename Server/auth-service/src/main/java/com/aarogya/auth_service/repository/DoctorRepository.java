package com.aarogya.auth_service.repository;

import com.aarogya.auth_service.documents.Doctor;
import com.aarogya.auth_service.documents.enums.Specialization;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {

    Optional<Doctor> findByEmail(String email);

    Optional<Doctor> findByLicenseNumber(String licenseNumber);

    List<Doctor> findBySpecialization(Specialization specialization);

    boolean existsByEmail(String email);
}
