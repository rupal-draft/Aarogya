package com.aarogya.pharmacy_service.repository;

import com.aarogya.pharmacy_service.documents.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByPatientId(String patientId);
    void deleteByPatientId(String patientId);
}
